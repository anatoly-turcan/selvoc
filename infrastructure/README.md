# Infrastructure Setup

This guide outlines the steps to provision and manage infrastructure using
Terraform, AWS, and Kubernetes. It assumes familiarity with AWS, Terraform,
and Kubernetes.

## Core Infrastructure Overview

The `core` Terraform configuration provisions the foundational AWS and Kubernetes
infrastructure for the Selvoc platform. Key resources include:

- **VPC**: A dedicated Virtual Private Cloud with public and private subnets for
  secure network segmentation.
- **EKS Cluster**: Managed Kubernetes cluster (Amazon EKS) for running
  microservices, with configurable node groups and IAM access roles.
- **RDS**: PostgreSQL database instance (Amazon RDS) deployed in private subnets
  for persistent data storage.
- **RabbitMQ (Amazon MQ)**: Managed message broker for event-driven
  communication between services.
- **ECR**: Elastic Container Registry repositories for storing Docker images of
  all microservices.
- **ALB**: Application Load Balancer for routing external traffic to Kubernetes
  services.
- **Route53**: DNS management and ACM certificate provisioning for secure,
  custom domain access.
- **Secrets Management**: AWS Secrets Manager integration for securely storing
  and distributing sensitive credentials.
- **External DNS & External Secrets**: Automated management of DNS records and
  Kubernetes secrets from AWS.
- **CI/CD IAM Role**: Dedicated IAM role for GitHub Actions or other CI/CD
  systems to deploy infrastructure and workloads.

This setup ensures a secure, scalable, and production-ready environment for
deploying and operating Selvoc microservices on AWS.

## Prerequisites

- AWS account with admin access
- AWS CLI configured with static credentials
- Terraform installed (version specified in GitHub Actions `TF_VERSION`,
  e.g., 1.11.4)
- Helm installed
- kubectl installed
- GitHub repository access with admin permissions

Follow online guides to set up an AWS account and configure the AWS CLI if needed.

## Terraform Setup

### 1. Provision the Terraform Backend (One-Time, Local)

This step sets up the Terraform backend using S3 and DynamoDB for state
management. It is a one-time setup. Backup the state file or use the provided
script to upload it to S3.

```bash
cd infrastructure/terraform/bootstrap
terraform init
terraform apply -auto-approve
# Backup the Terraform state to S3
./backup_state.sh upload $(terraform output -raw s3_bucket)
# Generate backend configuration file for core and internal infrastructure
terraform output -raw backend_config_core > ../core/backend.config
terraform output -raw backend_config_internal > ../internal/backend.config
```

### 2. Provision Core Infrastructure (First Time Local, Then CI/CD)

```bash
cd ../core
# Copy and adjust tfvars
cp envs/tfvars.example envs/dev.tfvars
# Edit envs/dev.tfvars with your values
terraform init -backend-config=backend.config -var-file=envs/dev.tfvars
terraform workspace new dev
# Initial apply for EKS and External Secrets
terraform apply -var-file=envs/dev.tfvars -target=module.eks -target=module.external_secrets.helm_release.this
terraform apply -var-file=envs/dev.tfvars -auto-approve
```

**Route53 Configuration**:

- During `terraform apply`, open the AWS Route53 console
  ([eu-central-1](https://eu-central-1.console.aws.amazon.com/route53/v2/home))
  and retrieve nameservers.
- Or with cli (might need some time to propagate):

  ```bash
  terraform state show module.route53.aws_route53_zone.this
  ```

- Update your domain registrar with these nameservers.

**Kubernetes Access** (if needed):

```bash
terraform output -raw kubeconfig > ~/.kube/config-eks
export KUBECONFIG=~/.kube/config-eks
kubectl cluster-info
```

## Database and Message Queue Setup

### PostgreSQL (Manual, Automation Planned)

```bash
cd infrastructure/terraform/core

terraform output -raw kubeconfig > ~/.kube/config-eks
export KUBECONFIG=~/.kube/config-eks
kubectl config set-context --current --namespace=selvoc-dev

# Port-forward RDS PostgreSQL
helm install postgres-proxy ../../helm/postgres-proxy --set postgres.host=$(terraform output -raw rds_hostname)
kubectl port-forward pod/postgres-proxy 5432:5432
```

- Connect to PostgreSQL (host: `localhost`, port: `5432`) using credentials
  from AWS Secrets Manager (e.g., `selvoc/dev/postgres-credentials`).
- Create databases and users based on `./configs/postgres/init/init-db.sql`
  and AWS secrets (e.g., `selvoc/dev/service/*/postgres-credentials`).
  Example:

  ```sql
  CREATE USER <username> WITH ENCRYPTED PASSWORD '<password>';
  CREATE DATABASE <service_name>;
  ALTER DATABASE <service_name> OWNER TO <username>;
  ```

- After completion:

  ```bash
  helm uninstall postgres-proxy
  ```

### RabbitMQ (Manual, Automation Planned)

```bash
helm install rabbitmq-proxy ../../helm/rabbitmq-proxy --set rabbitmq.host=$(terraform output -raw mq_hostname)
kubectl port-forward pod/rabbitmq-proxy 15671:15671
```

- Connect to RabbitMQ (host: `localhost`, port: `15671`) using credentials
  from AWS Secrets Manager (e.g., `selvoc/dev/rabbitmq-credentials`).
- Create a durable `keycloak.topic` exchange of type `topic`.
- After completion:

  ```bash
  helm uninstall rabbitmq-proxy
  ```

## GitHub Actions Configuration

### Repository Secrets

- `AWS_REGION`: AWS region (e.g., `eu-central-1`)
- `DOMAIN_NAME`: Your domain (e.g., `example.com`)
- `TF_BACKEND_BUCKET`: S3 bucket name (from `terraform/bootstrap` output)
- `TF_BACKEND_DYNAMODB_TABLE`: DynamoDB table name
- `TF_BACKEND_KEY`: Terraform state file key
- `TF_BACKEND_WORKSPACE_PREFIX`: Workspace prefix

### Repository Variables

- `TF_VERSION`: Terraform version (e.g., `1.11.4`)

### Environment Secrets (Per Environment: dev/prod)

- `AWS_ACM_CERTIFICATE_ARN`: ACM certificate ARN (Terraform output:
  `route53_acm_certificate_arn`)
- `AWS_EKS_CALLER_ACCESS_ROLE_ARN`: User ARN for EKS access
- `AWS_EKS_CLUSTER_NAME`: EKS cluster name (Terraform output: `cluster_name`)
- `AWS_ROLE_ARN`: CI/CD role ARN (Terraform output: `cicd_role_arn`)
- `K8S_NAMESPACE`: Kubernetes namespace (e.g., `selvoc-dev`)
- `KEYCLOAK_ADMIN_PASSWORD`: Keycloak admin password (set manually, change after first login)

### Environment Variables

- `AWS_ECR_REPOSITORY_NAME_<SERVICE_NAME>`: ECR repository name per service
  (e.g., `AWS_ECR_REPOSITORY_NAME_USER=selvoc-dev-user`)
- `TF_WORKSPACE`: Terraform workspace (e.g., `dev`)

## Keycloak Configuration (Manual, Automation Planned)

1. After Keycloak Helm installation, access Keycloak at
   `https://keycloak.selvoc.<DOMAIN_NAME>/admin/master/console/#/selvoc`.
2. Log in with `admin` and the `KEYCLOAK_ADMIN_PASSWORD`.
3. Ensure the `selvoc` realm is selected.
4. Verify or create the following clients in the `selvoc` realm:
   - `user-service`:
     - Client ID: `user-service`
     - Client Authentication: `ON`
     - Service account roles: `ON`
     - Assign `view-users` service account role (from `realm-management`)
   - `chat-service`:
     - Client ID: `chat-service`
     - Client Authentication: `ON`
     - Service account roles: `ON`
5. For each client:
   - Retrieve the client secret from Keycloak > Clients > <CLIENT_NAME> > Credentials.
   - Store the secret in AWS Secrets Manager (e.g.,
     `selvoc/dev/service/<SERVICE_NAME>/keycloak-client-secret`) as a key/value
     pair with key `secret`.

## Deploying Microservices

1. Ensure Keycloak clients and AWS secrets are configured for each service.
2. Trigger the CI/CD workflow for the microservice (e.g., `user-ci-cd`) in
   GitHub Actions.

## Planned Improvements

- **EKS Access Control**: Currently, the EKS cluster is accessible from the
  internet. The plan is to implement a custom GitHub Actions CI/CD runner
  within the VPC, which will execute Terraform operations securely.
- **Automated Internal Resource Provisioning**: With the custom runner in
  place, a new Terraform directory, `internal`, will be introduced. This
  directory will manage the creation of internal resources such as PostgreSQL
  and RabbitMQ, automating what is currently a manual process.
- **Terraform Directory Structure Refactor**: The `kubernetes` and `helm`
  providers, along with their respective resources, will be migrated from the
  `core` Terraform directory to the new `internal` directory. This change will
  ensure that the `core` directory is focused solely on AWS resource
  provisioning (not requiring private VPC access), while the `internal`
  directory will handle resources that require VPC access.
