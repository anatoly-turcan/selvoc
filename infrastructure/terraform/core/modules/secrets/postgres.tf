# Create secret for postgres main user
resource "random_string" "postgres_username_suffix" {
  length  = 6
  special = false
  upper   = false
  numeric = true
}

resource "random_password" "postgres" {
  length  = 20
  special = false
}

resource "aws_secretsmanager_secret" "postgres" {
  name                    = "${var.project_name}/${var.environment}/postgres-credentials"
  recovery_window_in_days = 0

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "postgres" {
  secret_id = aws_secretsmanager_secret.postgres.id
  secret_string = jsonencode({
    host     = var.postgres_host
    username = local.postgres_username
    password = random_password.postgres.result
  })
}
