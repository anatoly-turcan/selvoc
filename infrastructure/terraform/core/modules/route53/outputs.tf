output "zone_id" {
  value = aws_route53_zone.this.zone_id
}

output "nameservers" {
  value = aws_route53_zone.this.name_servers
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.this.arn
}
