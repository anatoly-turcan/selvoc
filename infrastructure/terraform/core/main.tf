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
  access_role_arns   = local.eks_access_role_arns
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
  ingress_security_group_ids = [module.eks.node_group_sg_id, module.github_runner.sg_id]
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
  ingress_security_group_ids = [module.eks.node_group_sg_id, module.github_runner.sg_id]
}

module "secrets" {
  source        = "./modules/secrets"
  project_name  = var.project_name
  environment   = terraform.workspace
  region        = var.region
  postgres_host = module.rds.hostname
  rabbitmq_host = module.mq.hostname
}

module "route53" {
  source       = "./modules/route53"
  domain_name  = var.domain_name
  project_name = var.project_name
}

module "cicd" {
  source     = "./modules/cicd"
  platform   = var.cicd_platform
  repository = var.cicd_repository
}

module "github_runner" {
  source           = "./modules/github_runner"
  project_name     = var.project_name
  environment      = terraform.workspace
  region           = var.region
  account_id       = data.aws_caller_identity.this.account_id
  vpc_id           = module.vpc.id
  vpc_cidr         = local.vpc_cidr
  subnet_id        = module.vpc.private_subnet_ids[0]
  eks_cluster_name = module.eks.cluster_name
  repository_url   = var.github_runner_repository_url
  token            = var.github_runner_token
  runner_version   = var.github_runner_version
  instance_type    = var.github_runner_instance_type
}
