terraform {
  required_version = "~> 1.11.4"

  backend "s3" {
    # Load with `terraform init -backend-config=backend.config`
    # More details in ../bootstrap
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.96.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.17.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.36.0"
    }
  }
}

module "vpc" {
  source               = "./modules/vpc"
  cidr                 = local.vpc_cidr
  public_subnet_cidrs  = local.vpc_public_subnet_cidrs
  private_subnet_cidrs = local.vpc_private_subnet_cidrs
  availability_zones   = local.vpc_availability_zones
  project_name         = var.project_name
  environment          = terraform.workspace
}

module "eks" {
  source             = "./modules/eks"
  vpc_id             = module.vpc.id
  cluster_name       = local.eks_cluster_name
  instance_types     = local.eks_instance_types
  scaling_config     = local.eks_scaling_config
  private_subnet_ids = module.vpc.private_subnet_ids
  project_name       = var.project_name
  environment        = terraform.workspace
  region             = var.region
  access_role_arns = {
    caller = data.aws_caller_identity.this.arn
    cicd   = module.cicd.role_arn
  }
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
  environment  = terraform.workspace
}

module "rds" {
  source                     = "./modules/rds"
  vpc_id                     = module.vpc.id
  private_subnet_ids         = module.vpc.private_subnet_ids
  instance_class             = local.rds_instance_class
  allocated_storage          = local.rds_allocated_storage
  username                   = module.secrets.postgres_username
  password                   = module.secrets.postgres_password
  project_name               = var.project_name
  environment                = terraform.workspace
  ingress_security_group_ids = [module.eks.node_group_sg_id]
}

module "mq" {
  source                     = "./modules/mq"
  vpc_id                     = module.vpc.id
  instance_type              = local.mq_instance_type
  private_subnet_ids         = module.vpc.private_subnet_ids
  username                   = module.secrets.rabbitmq_username
  password                   = module.secrets.rabbitmq_password
  project_name               = var.project_name
  environment                = terraform.workspace
  ingress_security_group_ids = [module.eks.node_group_sg_id]
}

module "secrets" {
  source        = "./modules/secrets"
  project_name  = var.project_name
  environment   = terraform.workspace
  postgres_host = module.rds.hostname
  rabbitmq_host = module.mq.hostname
}

module "alb" {
  source           = "./modules/alb"
  vpc_id           = module.vpc.id
  cluster_name     = module.eks.cluster_name
  oidc_arn         = module.eks.oidc_arn
  oidc_provider_id = module.eks.oidc_provider_id
  project_name     = var.project_name
  environment      = terraform.workspace
  region           = var.region
}

module "route53" {
  source       = "./modules/route53"
  domain_name  = var.domain_name
  project_name = var.project_name
}

module "k8s" {
  source       = "./modules/k8s"
  project_name = var.project_name
  environment  = terraform.workspace
}

module "external_dns" {
  source               = "./modules/external_dns"
  domain_name          = var.domain_name
  route53_zone_id      = module.route53.zone_id
  eks_oidc_arn         = module.eks.oidc_arn
  eks_oidc_provider_id = module.eks.oidc_provider_id
  project_name         = var.project_name
  environment          = terraform.workspace
}

module "cicd" {
  source     = "./modules/cicd"
  platform   = var.cicd_platform
  repository = var.cicd_repository
}
