locals {
  postgres_username = "postgres_${random_string.postgres_username_suffix.result}"
  rabbitmq_username = "admin_${random_string.rabbitmq_username_suffix.result}"
}
