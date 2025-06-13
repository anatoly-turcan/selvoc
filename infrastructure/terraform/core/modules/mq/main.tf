resource "aws_mq_broker" "this" {
  broker_name                = "${var.project_name}-${var.environment}-rabbitmq"
  engine_type                = "RabbitMQ"
  engine_version             = "3.13"
  auto_minor_version_upgrade = true
  host_instance_type         = var.instance_type
  publicly_accessible        = false
  security_groups            = [aws_security_group.this.id]
  subnet_ids                 = [var.private_subnet_ids[0]]

  user {
    username = var.username
    password = var.password
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_security_group" "this" {
  vpc_id = var.vpc_id

  ingress {
    from_port       = 5671
    to_port         = 5671
    protocol        = "tcp"
    security_groups = var.ingress_security_group_ids
  }

  ingress {
    from_port       = 15671
    to_port         = 15671
    protocol        = "tcp"
    security_groups = var.ingress_security_group_ids
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rabbitmq-sg"
    Project     = var.project_name
    Environment = var.environment
  }
}
