output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  value = module.rds.rds_endpoint
}

output "mq_endpoint" {
  value = module.mq.mq_endpoint
}

output "kubeconfig" {
  value = module.eks.kubeconfig
}
