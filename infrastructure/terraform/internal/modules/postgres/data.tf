data "http" "rds_cert" {
  url = "https://truststore.pki.rds.amazonaws.com/${var.region}/${var.region}-bundle.pem"
}
