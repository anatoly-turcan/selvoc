resource "kubernetes_namespace" "this" {
  metadata {
    name = "${var.project_name}-${var.environment}"
  }
}
