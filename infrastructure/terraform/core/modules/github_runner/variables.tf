variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "region" {
  type = string
}

variable "account_id" {
  type = string
}

variable "runner_version" {
  type    = string
  default = "2.324.0"
}

variable "repository_url" {
  type = string
}

variable "token" {
  type      = string
  sensitive = true
}

variable "eks_cluster_name" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.medium"
}

variable "vpc_id" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "subnet_id" {
  type = string
}
