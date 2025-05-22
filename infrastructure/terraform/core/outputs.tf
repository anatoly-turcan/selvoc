output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "rds_hostname" {
  value = module.rds.hostname
}

output "mq_endpoint" {
  value = module.mq.endpoint
}

output "mq_hostname" {
  value = module.mq.hostname
}

output "kubeconfig" {
  value = module.eks.kubeconfig
}

output "ecr_repositories" {
  value = module.ecr.repositories
}

output "route53_nameservers" {
  value = module.route53.nameservers
}

output "route53_acm_certificate_arn" {
  value = module.route53.acm_certificate_arn
}
