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


resource "aws_eks_node_group" "bobo" {
  cluster_name    = aws_eks_cluster.bobo.name
  node_group_name = "${var.environment}-bobo-nodes"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = ["t3.small"]
  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }
  depends_on = [aws_iam_role_policy_attachment.node]
  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_openid_connect_provider" "eks" {
  url             = aws_eks_cluster.bobo.identity[0].oidc[0].issuer
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["06b25927c42a721631c1efd9431e648fa62e1e39"]
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

resource "aws_iam_role" "node" {
  name = "${var.environment}-bobo-node-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "node" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  ])
  role       = aws_iam_role.node.name
  policy_arn = each.value
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

data "aws_security_group" "eks_node_group" {
  vpc_id = var.vpc_id
  filter {
    name   = "tag:kubernetes.io/cluster/${var.cluster_name}"
    values = ["owned"]
  }
  depends_on = [aws_eks_node_group.bobo]
}
