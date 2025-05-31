variable "core_backend" {
  description = "Core backend configuration for remote terraform state."
  type = object({
    bucket               = string
    key                  = string
    workspace_key_prefix = string
    region               = string
  })
}
