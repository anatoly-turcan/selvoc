output "keycloak_repository_url" {
  value = aws_ecr_repository.keycloak.repository_url
}

output "backend_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}
