resource "aws_db_instance" "postgres" {
  identifier              = "${var.environment}-bobo-postgres"
  engine                  = "postgres"
  engine_version          = "17.4"
  instance_class          = "db.t4g.micro"
  allocated_storage       = 20
  storage_type            = "gp2"
  username                = var.db_username
  password                = var.db_password
  db_name                 = "postgres"
  vpc_security_group_ids  = [aws_security_group.rds.id]
  db_subnet_group_name    = aws_db_subnet_group.rds.name
  multi_az                = false
  publicly_accessible     = false
  skip_final_snapshot     = true
  backup_retention_period = 7
  tags = {
    Environment = var.environment
  }
}

resource "aws_db_subnet_group" "rds" {
  name       = "${var.environment}-bobo-rds-subnet-group"
  subnet_ids = var.private_subnet_ids
  tags = {
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  vpc_id = var.vpc_id
  ingress {
    from_port       = 5432
    to_port         = 5432
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
    Name        = "${var.environment}-bobo-rds-sg"
    Environment = var.environment
  }
}
