resource "kubernetes_service" "postgres" {
  metadata {
    name      = "postgres"
    namespace = var.k8s_namespace
  }
  spec {
    type          = "ExternalName"
    external_name = aws_db_instance.postgres.address
  }
}
