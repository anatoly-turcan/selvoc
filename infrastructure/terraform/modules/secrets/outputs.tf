output "rds_secret_arn" {
  value = aws_secretsmanager_secret.rds.arn
}

output "mq_secret_arn" {
  value = aws_secretsmanager_secret.mq.arn
}

output "rds_username" {
  value = random_string.rds_username.result
}

output "rds_password" {
  value     = random_password.rds.result
  sensitive = true
}

output "mq_username" {
  value = random_string.mq_username.result
}

output "mq_password" {
  value     = random_password.mq.result
  sensitive = true
}
