resource "aws_route53_record" "keycloak" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "keycloak.bobo.turcan.dev"
  type    = "CNAME"
  ttl     = 300
  records = ["k8s-bobodev-keycloak-7d63691711-1547005420.eu-central-1.elb.amazonaws.com"] # TODO: improve
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.bobo.turcan.dev"
  type    = "CNAME"
  ttl     = 300
  records = ["k8s-bobodev-backend-fbb927ea83-1331075438.eu-central-1.elb.amazonaws.com"] # TODO: improve
}
