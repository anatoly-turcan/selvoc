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
