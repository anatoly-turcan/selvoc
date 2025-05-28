# Create secret for rabbitmq main user
resource "random_string" "rabbitmq_username_suffix" {
  length  = 6
  special = false
  upper   = false
  numeric = true
}

resource "random_password" "rabbitmq" {
  length  = 20
  special = false
}

resource "aws_secretsmanager_secret" "rabbitmq" {
  name                    = "${var.project_name}/${var.environment}/rabbitmq-credentials"
  recovery_window_in_days = 0

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "rabbitmq" {
  secret_id = aws_secretsmanager_secret.rabbitmq.id
  secret_string = jsonencode({
    host     = var.rabbitmq_host
    username = local.rabbitmq_username
    password = random_password.rabbitmq.result
  })
}

# Create secrets for services (sharing one secret right now)
resource "aws_secretsmanager_secret" "rabbitmq_service" {
  for_each = toset(local.services_with_rabbitmq)

  name                    = "${var.project_name}/${var.environment}/service/${each.key}/rabbitmq-credentials"
  recovery_window_in_days = 0

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "rabbitmq_service" {
  for_each = toset(local.services_with_rabbitmq)

  secret_id = aws_secretsmanager_secret.rabbitmq_service[each.key].id
  secret_string = jsonencode({
    host     = var.rabbitmq_host
    username = local.rabbitmq_username
    password = random_password.rabbitmq.result
  })
}
