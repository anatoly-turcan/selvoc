resource "aws_db_instance" "postgres" {
  identifier                = "${var.project_name}-${var.environment}-postgres"
  engine                    = "postgres"
  engine_version            = "17.4"
  instance_class            = var.instance_class
  allocated_storage         = var.allocated_storage
  storage_type              = "gp2"
  username                  = var.username
  password                  = var.password
  db_name                   = "postgres"
  vpc_security_group_ids    = [aws_security_group.this.id]
  db_subnet_group_name      = aws_db_subnet_group.this.name
  multi_az                  = false
  publicly_accessible       = false
  skip_final_snapshot       = var.environment == "prod" ? false : true
  final_snapshot_identifier = "${var.project_name}-${var.environment}-postgres-final-snapshot"
  backup_retention_period   = 7

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-${var.environment}-rds-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_security_group" "this" {
  vpc_id = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
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
    Name        = "${var.project_name}-${var.environment}-rds-sg"
    Project     = var.project_name
    Environment = var.environment
  }
}
