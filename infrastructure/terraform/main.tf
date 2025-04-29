module "secrets" {
  source      = "./modules/secrets"
  environment = var.environment
}

module "vpc" {
  source               = "./modules/vpc"
  cidr                 = local.vpc_cidr
  public_subnet_cidrs  = local.vpc_public_subnet_cidrs
  private_subnet_cidrs = local.vpc_private_subnet_cidrs
  availability_zones   = local.vpc_availability_zones
  environment          = var.environment
}

module "eks" {
  source             = "./modules/eks"
  vpc_id             = module.vpc.id
  cluster_name       = local.eks_cluster_name
  instance_types     = local.eks_instance_types
  scaling_config     = local.eks_scaling_config
  private_subnet_ids = module.vpc.private_subnet_ids
  environment        = var.environment
  region             = var.region
}

module "ecr" {
  source      = "./modules/ecr"
  environment = var.environment
}

module "rds" {
  source                     = "./modules/rds"
  vpc_id                     = module.vpc.id
  private_subnet_ids         = module.vpc.private_subnet_ids
  instance_class             = local.rds_instance_class
  allocated_storage          = local.rds_allocated_storage
  username                   = module.secrets.rds_username
  password                   = module.secrets.rds_password
  environment                = var.environment
  ingress_security_group_ids = [module.eks.node_group_sg_id]
}

module "mq" {
  source                     = "./modules/mq"
  vpc_id                     = module.vpc.id
  instance_type              = local.mq_instance_type
  private_subnet_ids         = module.vpc.private_subnet_ids
  username                   = module.secrets.mq_username
  password                   = module.secrets.mq_password
  environment                = var.environment
  ingress_security_group_ids = [module.eks.node_group_sg_id]
}

module "alb" {
  source           = "./modules/alb"
  vpc_id           = module.vpc.id
  cluster_name     = module.eks.cluster_name
  oidc_arn         = module.eks.oidc_arn
  oidc_provider_id = module.eks.oidc_provider_id
  environment      = var.environment
  region           = var.region
}

module "route53" {
  source      = "./modules/route53"
  domain_name = var.domain_name
}

module "k8s" {
  source      = "./modules/k8s"
  environment = var.environment
}

module "external_dns" {
  source               = "./modules/external_dns"
  domain_name          = var.domain_name
  route53_zone_id      = module.route53.zone_id
  eks_oidc_arn         = module.eks.oidc_arn
  eks_oidc_provider_id = module.eks.oidc_provider_id
}
