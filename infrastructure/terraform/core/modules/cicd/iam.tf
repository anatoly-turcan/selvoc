data "tls_certificate" "this" {
  url = local.oidc_config.provider_url
}

resource "aws_iam_openid_connect_provider" "this" {
  url             = local.oidc_config.provider_url
  client_id_list  = [local.oidc_config.audience]
  thumbprint_list = [data.tls_certificate.this.certificates[0].sha1_fingerprint]
}

resource "aws_iam_role" "this" {
  name = "cicd-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.this.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${local.provider_domain}:aud" = local.oidc_config.audience
          }
          StringLike = {
            "${local.provider_domain}:sub" = local.oidc_config.sub_format
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "this" {
  name = "cicd-policy"
  role = aws_iam_role.this.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:*",
          "eks:*",
          "ec2:*",
          "elasticloadbalancing:*",
          "rds:*",
          "mq:*",
          "secretsmanager:*",
          "route53:*",
          "acm:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:CreateRole",
          "iam:UpdateRole",
          "iam:DeleteRole",
          "iam:CreatePolicy",
          "iam:UpdatePolicy",
          "iam:DeletePolicy",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PassRole"
        ]
        Resource = "*"
      }
    ]
  })
}
