variable "region" {
  default = "eu-central-1"
}

variable "environment" {
  description = "Environment (dev, stage, prod)"
  type        = string
}
