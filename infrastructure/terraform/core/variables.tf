variable "region" {
  default = "eu-central-1"
}

variable "project_name" {
  default = "selvoc"
  type    = string
}

variable "domain_name" {
  description = "The domain name for the hosted zone"
  type        = string
}

variable "vpc_cidrs" {
  description = "CIDR blocks for VPC by environment (workspace)"
  type        = map(string)
  default = {
    dev   = "10.0.0.0/16"
    prod  = "10.1.0.0/16"
    stage = "10.2.0.0/16"
  }
}

variable "vpc_public_subnet_cidrs" {
  description = "CIDR blocks for public subnets by environment (workspace)"
  type        = map(list(string))
  default = {
    dev   = ["10.0.1.0/24", "10.0.2.0/24"]
    prod  = ["10.1.1.0/24", "10.1.2.0/24"]
    stage = ["10.2.1.0/24", "10.2.2.0/24"]
  }
}

variable "vpc_private_subnet_cidrs" {
  description = "CIDR blocks for private subnets by environment (workspace)"
  type        = map(list(string))
  default = {
    dev   = ["10.0.3.0/24", "10.0.4.0/24"]
    prod  = ["10.1.3.0/24", "10.1.4.0/24"]
    stage = ["10.2.3.0/24", "10.2.4.0/24"]
  }
}

variable "eks_instance_types" {
  description = "Instance types for EKS node groups by environment (workspace)"
  type        = map(list(string))
  default = {
    dev   = ["t3.small"]
    prod  = ["t3.medium"]
    stage = ["t3.small"]
  }
}

variable "eks_scaling_configs" {
  description = "Scaling configuration for EKS node groups by environment (workspace)"
  type = map(object({
    desired_size = number
    max_size     = number
    min_size     = number
  }))
  default = {
    dev = {
      desired_size = 2,
      max_size     = 3,
      min_size     = 1
    }
    prod = {
      desired_size = 2,
      max_size     = 3,
      min_size     = 1
    }
    stage = {
      desired_size = 2,
      max_size     = 3,
      min_size     = 1
    }
  }
}

variable "rds_instance_classes" {
  description = "Instance classes for RDS by environment (workspace)"
  type        = map(string)
  default = {
    dev   = "db.t4g.micro"
    prod  = "db.t4g.medium"
    stage = "db.t4g.micro"
  }
}

variable "rds_allocated_storages" {
  description = "Allocated storage for RDS by environment (workspace)"
  type        = map(number)
  default = {
    dev   = 20
    prod  = 100
    stage = 20
  }
}

variable "mq_instance_types" {
  description = "Instance types for MQ by environment (workspace)"
  type        = map(string)
  default = {
    dev   = "mq.t3.micro"
    prod  = "mq.t3.medium"
    stage = "mq.t3.micro"
  }
}
