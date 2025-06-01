# Infrastructure Setup

This guide outlines the steps to provision and manage infrastructure using
Terraform, AWS, and Kubernetes. It assumes familiarity with AWS, Terraform,
and Kubernetes.

## Infrastructure Overview

### Core

The `core` Terraform configuration provisions the foundational AWS resources for
the Selvoc platform. Private VPC access not needed. Key resources include:

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
- **Route53**: DNS management and ACM certificate provisioning for secure,
  custom domain access.
- **Secrets Management**: AWS Secrets Manager integration for securely storing
  and distributing sensitive credentials.
- **CI/CD IAM Role**: Dedicated IAM role for GitHub Actions or other CI/CD
  systems to deploy infrastructure and workloads that doesn't require VPC access.
- **Github Runner**: A GitHub Actions runner module to execute Terraform mainly
  for the internal infrastructure, which requires VPC access.

### Internal

The `internal` Terraform configuration is used to manage internal resources
such as Kubernetes, Helm, PostgreSQL, which require VPC access. runs with self-hosted
github runner, provisioned by `core` Terraform. Key resources include:

- **ALB**: Application Load Balancer for routing external traffic to Kubernetes
  services.
- **External DNS**: Automated management of DNS records in Route53 based on
  Kubernetes Ingress resources.
- **External Secrets**: Integration with AWS Secrets Manager to
  automatically sync secrets into Kubernetes.
- **Kubernetes**: Basic resources like namespaces, manifests, etc.
- **PostgreSQL**: Database management (databases, users, schemas, etc.) using
  postgresql terraform provider.
- **RabbitMQ**: Planned, similar to PostgreSQL.

This setup ensures a secure, scalable, and production-ready environment for
deploying and operating Selvoc microservices on AWS.

## Prerequisites

- AWS account with admin access
- AWS CLI configured with static credentials
- Terraform installed
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

# Generate backend configuration file for core and internal infrastructures
terraform output -raw backend_config_core > ../core/backend.config
terraform output -raw backend_config_internal > ../internal/backend.config
```

### 2. Provision Core Infrastructure (First Time Local, Then CI/CD)

```bash
cd ../core
# Copy and adjust tfvars
cp envs/tfvars.example envs/dev.tfvars

terraform init -backend-config=backend.config -var-file=envs/dev.tfvars
terraform workspace new dev
terraform apply -var-file=envs/dev.tfvars -auto-approve
```

**Route53 Configuration**:

- During `terraform apply`, open the AWS Route53 console
  ([eu-central-1](https://eu-central-1.console.aws.amazon.com/route53/v2/home))
  and retrieve nameservers.

  Or with cli (might need some time to propagate):

  ```bash
  terraform state show module.route53.aws_route53_zone.this
  ```

- Update your domain registrar with these nameservers.

**Kubernetes Access** (if needed):

```bash
terraform output -raw kubeconfig > ~/.kube/config-eks
export KUBECONFIG=~/.kube/config-eks
kubectl cluster-info
kubectl config set-context --current --namespace=selvoc-dev
```

### 3. Provision Internal Infrastructure (In CI/CD)

Internal infrastructure is provisioned using a self-hosted GitHub Actions runner
deployed inside the VPC. To provision internal resources, trigger the
[Terraform [internal]](../.github/workflows/terraform-internal.yaml) in GitHub Actions.

## RabbitMQ Setup (Manual, Automation Planned)

```bash
cd ../core

terraform output -raw kubeconfig > ~/.kube/config-eks
export KUBECONFIG=~/.kube/config-eks
kubectl config set-context --current --namespace=selvoc-dev

# Port-forward RabbitMQ using Helm
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
- `TF_CORE_BACKEND_BUCKET`: Core terraform backend S3 bucket name (from `terraform/bootstrap` output)
- `TF_CORE_BACKEND_DYNAMODB_TABLE`: Core terraform backend DynamoDB table name
- `TF_CORE_BACKEND_KEY`: Core terraform backend state file key
- `TF_CORE_BACKEND_WORKSPACE_PREFIX`: Core terraform backend workspace prefix
- `TF_INTERNAL_BACKEND_BUCKET`: Internal terraform backend S3 bucket name (from `terraform/bootstrap` output)
- `TF_INTERNAL_BACKEND_DYNAMODB_TABLE`: Internal terraform backend DynamoDB table name
- `TF_INTERNAL_BACKEND_KEY`: Internal terraform backend state file key
- `TF_INTERNAL_BACKEND_WORKSPACE_PREFIX`: Internal terraform backend workspace prefix

### Environment Secrets (Per Environment: dev/prod)

- `AWS_ACM_CERTIFICATE_ARN`: ACM certificate ARN (Terraform output:
  `route53_acm_certificate_arn`)
- `AWS_EKS_CALLER_ACCESS_ROLE_ARN`: User ARN for EKS access
- `AWS_EKS_CLUSTER_NAME`: EKS cluster name (Terraform output: `cluster_name`)
- `AWS_ROLE_ARN`: CI/CD role ARN (Terraform output: `cicd_role_arn`)
- `K8S_NAMESPACE`: Kubernetes namespace (e.g., `selvoc-dev`)
- `KEYCLOAK_ADMIN_PASSWORD`: Keycloak admin password (set manually, change after first login)

### Repository Variables

- `TF_VERSION`: Terraform version (e.g., `1.11.4`)

### Environment Variables

- `AWS_ECR_REPOSITORY_NAME_<SERVICE_NAME>`: ECR repository name per service
  (e.g., `AWS_ECR_REPOSITORY_NAME_USER=selvoc-dev-user`)
- `TF_WORKSPACE`: Terraform workspace (e.g., `dev`)

## Keycloak Configuration (Manual, Automation Planned)

1. Run `keycloak-ci-cd` GitHub Actions workflow to deploy Keycloak
2. After Keycloak Helm installation and a few minutes, access Keycloak at
   `https://keycloak.selvoc.<DOMAIN_NAME>/admin/master/console/#/selvoc`.
3. Log in with `admin` and the `KEYCLOAK_ADMIN_PASSWORD`.
4. Ensure the `selvoc` realm is selected.
5. Verify or create the following clients in the `selvoc` realm:
   - `user-service`:
     - Client ID: `user-service`
     - Client Authentication: `ON`
     - Service account roles: `ON`
     - Assign `view-users` service account role (from `realm-management`)
   - `chat-service`:
     - Client ID: `chat-service`
     - Client Authentication: `ON`
     - Service account roles: `ON`
6. For each client:
   - Retrieve the client secret from Keycloak > Clients > <CLIENT_NAME> > Credentials.
   - Store the secret in AWS Secrets Manager (e.g.,
     `selvoc/dev/service/<SERVICE_NAME>/keycloak-client-secret`) as a key/value
     pair with key `secret`.

## Deploying Microservices

1. Ensure Keycloak clients and AWS secrets are configured for each service.
2. Trigger the CI/CD workflow for the microservice in GitHub Actions in the
  following order:
   1. `keycloak-ci-cd` (should already be done in the previous steps)
   2. `user-ci-cd`
   3. `chat-ci-cd`
   4. `gateway-ci-cd`
