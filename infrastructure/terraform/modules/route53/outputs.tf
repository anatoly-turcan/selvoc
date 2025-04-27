output "nameservers" {
  value = aws_route53_zone.main.name_servers
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.app.arn
}

output "external_dns_role_arn" {
  value = aws_iam_role.external_dns.arn
}
