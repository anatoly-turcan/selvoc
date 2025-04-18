variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "eks_node_group_sg_id" {}

variable "mq_username" {
  type = string
}

variable "mq_password" {
  type = string
}
