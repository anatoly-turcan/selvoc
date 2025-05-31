output "endpoint" {
  value = local.endpoint
}

output "hostname" {
  value = local.hostname
}

output "username" {
  value     = var.username
  sensitive = true
}

output "password" {
  value     = var.password
  sensitive = true
}
