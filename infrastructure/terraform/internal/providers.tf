provider "aws" {
  region = local.region

  default_tags {
    tags = {
      Project = local.project_name
    }
  }
}

provider "kubernetes" {
  host                   = local.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(local.eks.cluster_ca_certificate)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", local.eks.cluster_name, "--region", local.region]
  }
}

provider "kubectl" {
  host                   = local.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(local.eks.cluster_ca_certificate)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", local.eks.cluster_name, "--region", local.region]
  }
}

provider "helm" {
  kubernetes {
    host                   = local.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(local.eks.cluster_ca_certificate)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", local.eks.cluster_name, "--region", local.region]
    }
  }
}
