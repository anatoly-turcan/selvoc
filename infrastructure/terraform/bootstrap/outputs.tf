output "s3_bucket" {
  value = aws_s3_bucket.terraform_state.id
}

output "backend_config_core" {
  value = <<EOT
bucket               = "${aws_s3_bucket.terraform_state.id}"
key                  = "core/terraform.tfstate"
workspace_key_prefix = "core"
region               = "${var.region}"
dynamodb_table       = "${aws_dynamodb_table.terraform_state_lock.name}"
EOT
}

output "backend_config_internal" {
  value = <<EOT
bucket               = "${aws_s3_bucket.terraform_state.id}"
key                  = "internal/terraform.tfstate"
workspace_key_prefix = "internal"
region               = "${var.region}"
dynamodb_table       = "${aws_dynamodb_table.terraform_state_lock.name}"
EOT
}
