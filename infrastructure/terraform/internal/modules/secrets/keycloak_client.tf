resource "aws_secretsmanager_secret" "keycloak_client_secret" {
  for_each = var.services_with_keycloak_client_secret

  name                    = "${var.project_name}/${var.environment}/service/${each.key}/keycloak-client-secret"
  recovery_window_in_days = 0

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}
