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
  value     = module.eks.kubeconfig
  sensitive = true
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

output "cicd_role_arn" {
  value = module.cicd.role_arn
}

output "region" {
  value = var.region
}

output "project_name" {
  value = var.project_name
}

output "domain_name" {
  value = var.domain_name
}

output "vpc" {
  value = {
    id = module.vpc.id
  }
}

output "eks" {
  value = {
    oidc_arn               = module.eks.oidc_arn
    oidc_provider_id       = module.eks.oidc_provider_id
    cluster_name           = module.eks.cluster_name
    cluster_endpoint       = module.eks.cluster_endpoint
    cluster_ca_certificate = module.eks.cluster_ca_certificate
  }
}

output "route53" {
  value = {
    zone_id = module.route53.zone_id
  }
}
