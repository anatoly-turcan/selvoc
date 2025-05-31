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
    username = var.rabbitmq_username
    password = random_password.rabbitmq.result
  })
}
