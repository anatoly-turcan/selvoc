output "repositories" {
  value = { for repo in local.repositories : repo => aws_ecr_repository.this[repo].repository_url }
}
