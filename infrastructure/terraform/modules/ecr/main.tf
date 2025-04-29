resource "aws_ecr_repository" "backend" {
  name         = "${var.environment}-bobo-backend"
  force_delete = true
  tags = {
    Environment = var.environment
  }
}

resource "aws_ecr_repository" "keycloak" {
  name         = "${var.environment}-bobo-keycloak"
  force_delete = true
  tags = {
    Environment = var.environment
  }
}
