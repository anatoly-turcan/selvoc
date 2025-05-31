terraform {
  required_version = ">= 1.11, < 2.0"

  backend "s3" {
    # Load with `terraform init -backend-config=backend.config`
    # More details in ../bootstrap
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.96.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.36.0"
    }

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.19.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.17.0"
    }

    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.25.0"
    }
  }
}

module "k8s" {
  source       = "./modules/k8s"
  project_name = local.project_name
  environment  = terraform.workspace
}

module "alb" {
  source           = "./modules/alb"
  vpc_id           = local.vpc.id
  cluster_name     = local.eks.cluster_name
  oidc_arn         = local.eks.oidc_arn
  oidc_provider_id = local.eks.oidc_provider_id
  project_name     = local.project_name
  environment      = terraform.workspace
  region           = local.region
}

module "external_dns" {
  source               = "./modules/external_dns"
  domain_name          = local.domain_name
  route53_zone_id      = local.route53.zone_id
  eks_oidc_arn         = local.eks.oidc_arn
  eks_oidc_provider_id = local.eks.oidc_provider_id
  project_name         = local.project_name
  environment          = terraform.workspace

  depends_on = [module.alb, module.k8s]
}

module "external_secrets" {
  source               = "./modules/external_secrets"
  eks_oidc_arn         = local.eks.oidc_arn
  eks_oidc_provider_id = local.eks.oidc_provider_id
  project_name         = local.project_name
  environment          = terraform.workspace
  region               = local.region
  account_id           = data.aws_caller_identity.this.account_id

  depends_on = [module.alb, module.k8s]

  providers = {
    kubectl = kubectl
  }
}

module "secrets" {
  source       = "./modules/secrets"
  project_name = local.project_name
  environment  = terraform.workspace

  services_with_keycloak_client_secret = ["user", "chat"]
}

module "postgres" {
  source       = "./modules/postgres"
  region       = local.region
  project_name = local.project_name
  environment  = terraform.workspace
  host         = local.rds.hostname
  services     = ["keycloak", "user", "chat"]

  providers = {
    postgresql = postgresql
  }
}

module "rabbitmq" {
  source       = "./modules/rabbitmq"
  project_name = local.project_name
  environment  = terraform.workspace
  host         = local.mq.hostname
  username     = local.mq.username
  password     = local.mq.password
  services     = ["keycloak", "user", "chat"]
}
