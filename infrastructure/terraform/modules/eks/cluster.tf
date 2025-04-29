resource "aws_eks_cluster" "bobo" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks.arn
  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.eks.id]
  }
  depends_on = [aws_iam_role_policy_attachment.eks]
  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_openid_connect_provider" "eks" {
  url             = aws_eks_cluster.bobo.identity[0].oidc[0].issuer
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["06b25927c42a721631c1efd9431e648fa62e1e39", "c3c07e30211ff224dc6db2086d7bbaa42929a81e"]
}

resource "aws_iam_role" "eks" {
  name = "${var.environment}-bobo-eks-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "eks" {
  role       = aws_iam_role.eks.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_security_group" "eks" {
  vpc_id = var.vpc_id
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name        = "${var.environment}-bobo-eks-sg"
    Environment = var.environment
  }
}
