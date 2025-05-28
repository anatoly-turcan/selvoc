locals {
  services_with_postgres               = ["keycloak", "user", "chat"]
  services_with_rabbitmq               = ["keycloak", "user", "chat"]
  services_with_keycloak_client_secret = ["user", "chat"]

  postgres_username = "postgres_${random_string.postgres_username_suffix.result}"
  rabbitmq_username = "admin_${random_string.rabbitmq_username_suffix.result}"
}
