variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "ingress_security_group_ids" {
  type = set(string)
}

variable "username" {
  type = string
}

variable "password" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "mq.t3.micro"
}
