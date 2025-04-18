resource "aws_ecr_repository" "backend" {
  name = "${var.environment}-bobo-backend"
  tags = {
    Environment = var.environment
  }
}

resource "aws_ecr_repository" "keycloak" {
  name = "${var.environment}-bobo-keycloak"
  tags = {
    Environment = var.environment
  }
}
