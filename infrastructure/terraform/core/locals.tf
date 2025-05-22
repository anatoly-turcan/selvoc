locals {
  vpc_cidr                 = var.vpc_cidrs[terraform.workspace]
  vpc_public_subnet_cidrs  = var.vpc_public_subnet_cidrs[terraform.workspace]
  vpc_private_subnet_cidrs = var.vpc_private_subnet_cidrs[terraform.workspace]
  vpc_availability_zones   = ["${var.region}a", "${var.region}b"]

  eks_cluster_name   = "${var.project_name}-${terraform.workspace}-eks"
  eks_instance_types = var.eks_instance_types[terraform.workspace]
  eks_scaling_config = var.eks_scaling_configs[terraform.workspace]

  rds_instance_class    = var.rds_instance_classes[terraform.workspace]
  rds_allocated_storage = var.rds_allocated_storages[terraform.workspace]

  mq_instance_type = var.mq_instance_types[terraform.workspace]
}
