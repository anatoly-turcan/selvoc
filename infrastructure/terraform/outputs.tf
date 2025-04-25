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

output "ecr_keycloak_repository_url" {
  value = module.ecr.keycloak_repository_url
}

output "ecr_backend_repository_url" {
  value = module.ecr.backend_repository_url
}

output "route53_nameservers" {
  value = module.route53.nameservers
}

output "route53_acm_certificate_arn" {
  value = module.route53.acm_certificate_arn
}
