resource "aws_ecr_repository" "this" {
  for_each     = toset(local.repositories)
  name         = "${var.project_name}-${var.environment}-${each.key}"
  force_delete = true

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}
