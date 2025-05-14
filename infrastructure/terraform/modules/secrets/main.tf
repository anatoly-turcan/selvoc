resource "random_string" "rds_username" {
  length  = 12
  special = false
  upper   = false
  numeric = true
}

resource "random_password" "rds" {
  length  = 20
  special = false
}

resource "random_string" "mq_username" {
  length  = 12
  special = false
  upper   = false
  numeric = true
}

resource "random_password" "mq" {
  length  = 20
  special = false
}

resource "aws_secretsmanager_secret" "rds" {
  name                    = "${var.environment}-selvoc-rds-credentials"
  recovery_window_in_days = 0
  tags = {
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "rds" {
  secret_id = aws_secretsmanager_secret.rds.id
  secret_string = jsonencode({
    username = random_string.rds_username.result
    password = random_password.rds.result
  })
}

resource "aws_secretsmanager_secret" "mq" {
  name                    = "${var.environment}-selvoc-mq-credentials"
  recovery_window_in_days = 0
  tags = {
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "mq" {
  secret_id = aws_secretsmanager_secret.mq.id
  secret_string = jsonencode({
    username = random_string.mq_username.result
    password = random_password.mq.result
  })
}
