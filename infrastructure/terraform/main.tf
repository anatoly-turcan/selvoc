provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

module "secrets" {
  source      = "./modules/secrets"
  environment = var.environment
}

module "vpc" {
  source               = "./modules/vpc"
  vpc_cidr             = var.environment == "prod" ? "10.1.0.0/16" : var.environment == "stage" ? "10.2.0.0/16" : "10.0.0.0/16"
  public_subnet_cidrs  = var.environment == "prod" ? ["10.1.1.0/24", "10.1.2.0/24"] : var.environment == "stage" ? ["10.2.1.0/24", "10.2.2.0/24"] : ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = var.environment == "prod" ? ["10.1.3.0/24", "10.1.4.0/24"] : var.environment == "stage" ? ["10.2.3.0/24", "10.2.4.0/24"] : ["10.0.3.0/24", "10.0.4.0/24"]
  azs                  = ["${var.region}a", "${var.region}b"]
  environment          = var.environment
}

module "eks" {
  source             = "./modules/eks"
  cluster_name       = "${var.environment}-bobo-eks"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  environment        = var.environment
  region             = var.region
}

module "ecr" {
  source      = "./modules/ecr"
  environment = var.environment
}

module "rds" {
  source               = "./modules/rds"
  vpc_id               = module.vpc.vpc_id
  private_subnet_ids   = module.vpc.private_subnet_ids
  db_username          = module.secrets.rds_username
  db_password          = module.secrets.rds_password
  environment          = var.environment
  eks_node_group_sg_id = module.eks.eks_node_group_sg_id
  k8s_namespace        = kubernetes_namespace.bobo.metadata[0].name
}

module "mq" {
  source               = "./modules/mq"
  vpc_id               = module.vpc.vpc_id
  private_subnet_ids   = module.vpc.private_subnet_ids
  mq_username          = module.secrets.mq_username
  mq_password          = module.secrets.mq_password
  environment          = var.environment
  eks_node_group_sg_id = module.eks.eks_node_group_sg_id
  k8s_namespace        = kubernetes_namespace.bobo.metadata[0].name
}

module "alb" {
  source       = "./modules/alb"
  cluster_name = module.eks.cluster_name
  oidc_arn     = module.eks.oidc_arn
  oidc_url     = module.eks.oidc_url
  environment  = var.environment
  region       = var.region
  vpc_id       = module.vpc.vpc_id
}

module "route53" {
  source      = "./modules/route53"
  domain_name = var.domain_name
}
