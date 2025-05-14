resource "aws_eks_node_group" "selvoc" {
  cluster_name    = aws_eks_cluster.selvoc.name
  node_group_name = "${var.environment}-selvoc-nodes"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.instance_types
  scaling_config {
    desired_size = var.scaling_config.desired_size
    max_size     = var.scaling_config.max_size
    min_size     = var.scaling_config.min_size
  }
  depends_on = [aws_iam_role_policy_attachment.node]
  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role" "node" {
  name = "${var.environment}-selvoc-node-role"
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

data "aws_security_group" "node_group" {
  vpc_id = var.vpc_id
  filter {
    name   = "tag:kubernetes.io/cluster/${var.cluster_name}"
    values = ["owned"]
  }
  depends_on = [aws_eks_node_group.selvoc]
}
