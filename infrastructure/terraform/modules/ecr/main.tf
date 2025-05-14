resource "aws_ecr_repository" "backend" {
  name         = "${var.environment}-selvoc-backend"
  force_delete = true
  tags = {
    Environment = var.environment
  }
}

resource "aws_ecr_repository" "keycloak" {
  name         = "${var.environment}-selvoc-keycloak"
  force_delete = true
  tags = {
    Environment = var.environment
  }
}
