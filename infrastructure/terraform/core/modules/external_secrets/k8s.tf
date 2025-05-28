resource "kubernetes_manifest" "cluster_secret_store" {
  depends_on = [helm_release.this]
  manifest = {
    apiVersion = "external-secrets.io/v1"
    kind       = "ClusterSecretStore"
    metadata = {
      name = "aws-secrets-manager"
    }
    spec = {
      provider = {
        aws = {
          service = "SecretsManager"
          region  = var.region
          auth = {
            jwt = {
              serviceAccountRef = {
                name      = var.service_account_name
                namespace = var.namespace
              }
            }
          }
        }
      }
    }
  }
}
