data "aws_caller_identity" "this" {}

data "terraform_remote_state" "core" {
  backend = "s3"
  config = {
    bucket               = var.core_backend.bucket
    key                  = var.core_backend.key
    region               = var.core_backend.region
    workspace_key_prefix = var.core_backend.workspace_key_prefix
  }
  workspace = terraform.workspace
}
