output "cluster_endpoint" {
  value = aws_eks_cluster.bobo.endpoint
}

output "cluster_ca_certificate" {
  value = aws_eks_cluster.bobo.certificate_authority[0].data
}

output "cluster_name" {
  value = aws_eks_cluster.bobo.name
}

output "eks_node_group_sg_id" {
  value = data.aws_security_group.eks_node_group.id
}

output "oidc_arn" {
  value = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_url" {
  value = aws_eks_cluster.bobo.identity[0].oidc[0].issuer
}

output "oidc_provider_id" {
  value = trimprefix(aws_eks_cluster.bobo.identity[0].oidc[0].issuer, "https://")
}

output "kubeconfig" {
  value = <<EOT
apiVersion: v1
clusters:
- cluster:
    server: ${aws_eks_cluster.bobo.endpoint}
    certificate-authority-data: ${aws_eks_cluster.bobo.certificate_authority[0].data}
  name: ${aws_eks_cluster.bobo.name}
contexts:
- context:
    cluster: ${aws_eks_cluster.bobo.name}
    user: ${aws_eks_cluster.bobo.name}
  name: ${aws_eks_cluster.bobo.name}
current-context: ${aws_eks_cluster.bobo.name}
kind: Config
preferences: {}
users:
- name: ${aws_eks_cluster.bobo.name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${aws_eks_cluster.bobo.name}
        - --region
        - ${var.region}
EOT
}
