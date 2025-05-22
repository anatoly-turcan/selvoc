output "cluster_endpoint" {
  value = aws_eks_cluster.this.endpoint
}

output "cluster_ca_certificate" {
  value = aws_eks_cluster.this.certificate_authority[0].data
}

output "cluster_name" {
  value = aws_eks_cluster.this.name
}

output "node_group_sg_id" {
  value = data.aws_security_group.node_group.id
}

output "oidc_arn" {
  value = aws_iam_openid_connect_provider.this.arn
}

output "oidc_url" {
  value = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

output "oidc_provider_id" {
  value = trimprefix(aws_eks_cluster.this.identity[0].oidc[0].issuer, "https://")
}

output "kubeconfig" {
  value = <<EOT
apiVersion: v1
clusters:
- cluster:
    server: ${aws_eks_cluster.this.endpoint}
    certificate-authority-data: ${aws_eks_cluster.this.certificate_authority[0].data}
  name: ${aws_eks_cluster.this.name}
contexts:
- context:
    cluster: ${aws_eks_cluster.this.name}
    user: ${aws_eks_cluster.this.name}
  name: ${aws_eks_cluster.this.name}
current-context: ${aws_eks_cluster.this.name}
kind: Config
preferences: {}
users:
- name: ${aws_eks_cluster.this.name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${aws_eks_cluster.this.name}
        - --region
        - ${var.region}
EOT
}
