locals {
  region       = data.terraform_remote_state.core.outputs.region
  project_name = data.terraform_remote_state.core.outputs.project_name
  domain_name  = data.terraform_remote_state.core.outputs.domain_name
  vpc          = data.terraform_remote_state.core.outputs.vpc
  eks          = data.terraform_remote_state.core.outputs.eks
  route53      = data.terraform_remote_state.core.outputs.route53
  rds          = data.terraform_remote_state.core.outputs.rds
  mq           = data.terraform_remote_state.core.outputs.mq
}
