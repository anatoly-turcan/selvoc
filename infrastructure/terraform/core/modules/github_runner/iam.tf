resource "aws_iam_role" "this" {
  name = "${var.project_name}-${var.environment}-github-runner-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "this" {
  name = "${var.project_name}-${var.environment}-github-runner-policy"
  role = aws_iam_role.this.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "secretsmanager:*"
        Resource = "arn:aws:secretsmanager:${var.region}:${var.account_id}:secret:${var.project_name}/${var.environment}/*"
      },
      {
        Effect = "Allow"
        Action = "iam:*"
        Resource = [
          "arn:aws:iam::${var.account_id}:role/${var.project_name}-${var.environment}-*",
          "arn:aws:iam::${var.account_id}:policy/${var.project_name}-${var.environment}-*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:*", "dynamodb:*"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.this.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
