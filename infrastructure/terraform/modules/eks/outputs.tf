output "cluster_endpoint" {
  value = aws_eks_cluster.selvoc.endpoint
}

output "cluster_ca_certificate" {
  value = aws_eks_cluster.selvoc.certificate_authority[0].data
}

output "cluster_name" {
  value = aws_eks_cluster.selvoc.name
}

output "node_group_sg_id" {
  value = data.aws_security_group.node_group.id
}

output "oidc_arn" {
  value = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_url" {
  value = aws_eks_cluster.selvoc.identity[0].oidc[0].issuer
}

output "oidc_provider_id" {
  value = trimprefix(aws_eks_cluster.selvoc.identity[0].oidc[0].issuer, "https://")
}

output "kubeconfig" {
  value = <<EOT
apiVersion: v1
clusters:
- cluster:
    server: ${aws_eks_cluster.selvoc.endpoint}
    certificate-authority-data: ${aws_eks_cluster.selvoc.certificate_authority[0].data}
  name: ${aws_eks_cluster.selvoc.name}
contexts:
- context:
    cluster: ${aws_eks_cluster.selvoc.name}
    user: ${aws_eks_cluster.selvoc.name}
  name: ${aws_eks_cluster.selvoc.name}
current-context: ${aws_eks_cluster.selvoc.name}
kind: Config
preferences: {}
users:
- name: ${aws_eks_cluster.selvoc.name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${aws_eks_cluster.selvoc.name}
        - --region
        - ${var.region}
EOT
}
