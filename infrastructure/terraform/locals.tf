locals {
  vpc_cidr                 = var.vpc_cidrs[var.environment]
  vpc_public_subnet_cidrs  = var.vpc_public_subnet_cidrs[var.environment]
  vpc_private_subnet_cidrs = var.vpc_private_subnet_cidrs[var.environment]
  vpc_availability_zones   = ["${var.region}a", "${var.region}b"]

  eks_cluster_name   = "${var.environment}-bobo-eks"
  eks_instance_types = var.eks_instance_types[var.environment]
  eks_scaling_config = var.eks_scaling_configs[var.environment]

  rds_instance_class    = var.rds_instance_classes[var.environment]
  rds_allocated_storage = var.rds_allocated_storages[var.environment]

  mq_instance_type = var.mq_instance_types[var.environment]
}
