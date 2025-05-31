locals {
  services_with_postgres               = ["keycloak", "user", "chat"]
  services_with_rabbitmq               = ["keycloak", "user", "chat"]
  services_with_keycloak_client_secret = ["user", "chat"]
}
