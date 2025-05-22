output "endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "hostname" {
  value = aws_db_instance.postgres.address
}
