locals {
  oidc_configs = {
    github = {
      provider_url = "https://token.actions.githubusercontent.com"
      audience     = "sts.amazonaws.com"
      sub_format   = "repo:${var.repository}:*"
    }
  }

  oidc_config = local.oidc_configs[var.platform]
  provider_domain = replace(local.oidc_config.provider_url, "https://", "")
}
