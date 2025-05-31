variable "environment" {
  type = string
}


variable "project_name" {
  type = string
}

variable "services_with_keycloak_client_secret" {
  type        = set(string)
  description = "Names of services that require a Keycloak client secret"
}
