variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "project_name" {
  type = string
}

variable "postgres_host" {
  type = string
}

variable "rabbitmq_host" {
  type = string
}

variable "rabbitmq_username" {
  type      = string
  sensitive = true
}
