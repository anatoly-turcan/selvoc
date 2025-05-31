output "endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "hostname" {
  value = aws_db_instance.postgres.address
}

output "username" {
  value     = var.username
  sensitive = true
}

output "password" {
  value     = var.password
  sensitive = true
}
