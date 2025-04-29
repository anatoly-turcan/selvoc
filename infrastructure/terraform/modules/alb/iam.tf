resource "aws_iam_role" "alb" {
  name = "${var.environment}-bobo-alb-role"
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
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "alb" {
  role       = aws_iam_role.alb.name
  policy_arn = aws_iam_policy.alb.arn
}

resource "aws_iam_policy" "alb" {
  name   = "${var.environment}-bobo-alb-policy"
  policy = file("${path.module}/policy.json")
  tags = {
    Environment = var.environment
  }
}
