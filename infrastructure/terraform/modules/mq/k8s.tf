resource "kubernetes_service" "rabbitmq" {
  metadata {
    name      = "rabbitmq"
    namespace = var.k8s_namespace
  }
  spec {
    type          = "ExternalName"
    external_name = local.hostname
  }
}
