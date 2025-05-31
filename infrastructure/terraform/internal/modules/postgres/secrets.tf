resource "aws_secretsmanager_secret" "postgres_service" {
  for_each = var.services

  name                    = "${var.project_name}/${var.environment}/service/${each.key}/postgres-credentials"
  recovery_window_in_days = 0

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "postgres_service" {
  for_each = var.services

  secret_id = aws_secretsmanager_secret.postgres_service[each.key].id
  secret_string = jsonencode({
    host     = var.host
    database = postgresql_database.service_db[each.key].name
    username = postgresql_role.service_role[each.key].name
    password = random_password.postgres_service[each.key].result
    cert     = data.http.rds_cert.response_body
  })
}
