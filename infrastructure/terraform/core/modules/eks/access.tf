resource "aws_eks_access_entry" "admin_roles" {
  for_each = var.access_role_arns

  cluster_name      = aws_eks_cluster.this.name
  principal_arn     = each.value
  kubernetes_groups = ["cluster-admin"]
  type              = "STANDARD"
}

resource "aws_eks_access_policy_association" "admin_roles" {
  for_each = var.access_role_arns

  cluster_name  = aws_eks_cluster.this.name
  principal_arn = each.value
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
  access_scope {
    type = "cluster"
  }

  depends_on = [aws_eks_access_entry.admin_roles]
}
