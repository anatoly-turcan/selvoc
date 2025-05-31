resource "kubectl_manifest" "cluster_secret_store" {
  depends_on = [helm_release.this]

  yaml_body = <<YAML
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: aws-secrets-manager
spec:
  provider:
    aws:
      service: SecretsManager
      region: ${var.region}
      auth:
        jwt:
          serviceAccountRef:
            name: ${var.service_account_name}
            namespace: ${var.namespace}
YAML
}
