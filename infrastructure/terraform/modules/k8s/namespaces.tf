resource "kubernetes_namespace" "selvoc" {
  metadata {
    name = "selvoc-${var.environment}"
  }
}
