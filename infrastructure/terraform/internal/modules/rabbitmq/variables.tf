variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "host" {
  type = string
}

variable "username" {
  type      = string
  sensitive = true
}

variable "password" {
  type      = string
  sensitive = true
}

variable "services" {
  type        = set(string)
  description = "Names of services that require rabbitmq access"
}
