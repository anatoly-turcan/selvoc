variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "host" {
  type = string
}

variable "services" {
  type        = set(string)
  description = "Names of services that require separate database and user"
}
