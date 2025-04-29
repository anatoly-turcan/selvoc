resource "kubernetes_namespace" "bobo" {
  metadata {
    name = "bobo-${var.environment}"
  }
}
