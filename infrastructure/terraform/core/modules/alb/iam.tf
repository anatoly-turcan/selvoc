resource "aws_iam_role" "this" {
  name = "${var.project_name}-${var.environment}-alb-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = var.oidc_arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${var.oidc_provider_id}:sub" = "system:serviceaccount:kube-system:alb-ingress-controller"
        }
      }
    }]
  })
  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.this.arn
}

resource "aws_iam_policy" "this" {
  name   = "${var.project_name}-${var.environment}-alb-policy"
  policy = file("${path.module}/policy.json")
  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}
