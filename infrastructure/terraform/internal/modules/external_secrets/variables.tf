variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "eks_oidc_arn" {
  type = string
}

variable "eks_oidc_provider_id" {
  type = string
}

variable "namespace" {
  type    = string
  default = "external-secrets"
}

variable "service_account_name" {
  type    = string
  default = "external-secrets"
}
