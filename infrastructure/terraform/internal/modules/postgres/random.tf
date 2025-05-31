# Generate random username suffix for each service
resource "random_string" "postgres_username_suffix_service" {
  for_each = var.services

  length  = 6
  special = false
  upper   = false
  numeric = true
}

# Generate random password for each service
resource "random_password" "postgres_service" {
  for_each = var.services

  length  = 20
  special = false
}
