resource "aws_mq_broker" "bobo" {
  broker_name                = "${var.environment}-bobo-mq"
  engine_type                = "RabbitMQ"
  engine_version             = "3.13"
  auto_minor_version_upgrade = true
  host_instance_type         = "mq.t3.micro"
  publicly_accessible        = false
  security_groups            = [aws_security_group.mq.id]
  subnet_ids                 = [var.private_subnet_ids[0]]
  user {
    username = var.mq_username
    password = var.mq_password
  }
  tags = {
    Environment = var.environment
  }
}

resource "aws_security_group" "mq" {
  vpc_id = var.vpc_id
  ingress {
    from_port       = 5672
    to_port         = 5672
    protocol        = "tcp"
    security_groups = [var.eks_node_group_sg_id]
  }
  ingress {
    from_port       = 15672
    to_port         = 15672
    protocol        = "tcp"
    security_groups = [var.eks_node_group_sg_id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name        = "${var.environment}-bobo-mq-sg"
    Environment = var.environment
  }
}
