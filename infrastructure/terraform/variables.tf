variable "region" {
  default = "eu-central-1"
}

variable "environment" {
  description = "Environment (dev, stage, prod)"
  type        = string
}

variable "domain_name" {
  description = "The domain name for the hosted zone"
  type        = string
}
