output "postgres_username" {
  value     = local.postgres_username
  sensitive = true
}

output "postgres_password" {
  value     = random_password.postgres.result
  sensitive = true
}

output "rabbitmq_username" {
  value     = local.rabbitmq_username
  sensitive = true
}

output "rabbitmq_password" {
  value     = random_password.rabbitmq.result
  sensitive = true
}
