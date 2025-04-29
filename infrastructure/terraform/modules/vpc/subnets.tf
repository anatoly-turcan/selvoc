resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name                     = "${var.environment}-bobo-public-${count.index}"
    Environment              = var.environment
    "kubernetes.io/role/elb" = "1" # https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html
  }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = {
    Name        = "${var.environment}-bobo-private-${count.index}"
    Environment = var.environment
  }
}
