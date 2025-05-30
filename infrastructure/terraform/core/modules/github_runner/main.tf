resource "aws_instance" "this" {
  ami                    = data.aws_ssm_parameter.al2023.value
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  iam_instance_profile   = aws_iam_instance_profile.this.name
  vpc_security_group_ids = [aws_security_group.this.id]

  user_data = templatefile("${path.module}/user-data.sh.tpl", {
    region           = var.region
    repository_url   = var.repository_url
    token            = var.token
    eks_cluster_name = var.eks_cluster_name
    version          = var.runner_version
    environment      = var.environment
  })

  tags = {
    Name    = "${var.project_name}-${var.environment}-github-runner"
    Project = var.project_name
  }

  lifecycle {
    # Prevent token changes from triggering instance recreation
    ignore_changes = [user_data]
  }
}

data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_iam_instance_profile" "this" {
  name = "${var.project_name}-${var.environment}-github-runner-profile"
  role = aws_iam_role.this.name
}

resource "aws_security_group" "this" {
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-${var.environment}-github-runner-sg"
    Project = var.project_name
  }
}
