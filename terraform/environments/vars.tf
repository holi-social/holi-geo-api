locals {
  # predefined environment names are staging, production, and <branchname>
  environment      = terraform.workspace
  environment_name = trim(substr(local.environment, 0, 22), ".-") # limits the length of the name that it fits constraints google imposes for some resources, e.g. project ids
  environment_type = contains(["staging", "production"], local.environment) ? local.environment : "review"

  # the dns name can be at most 64 chars in total
  dns_name = "${trimsuffix(substr(local.environment, 0, 34), ".-")}.${data.terraform_remote_state.holi_geo_api_common_state.outputs.dns_geo_api_domain}"

  api_domain       = trimsuffix(google_dns_record_set.holi_social_geo_api_domain_record_set.name, ".")
  api_endpoint_url = "https://${local.api_domain}/graphql"

  default_region = data.terraform_remote_state.holi_infra_state.outputs.default_region
}

output "api_domain" {
  value       = local.api_domain
  description = "Domain under which the GeoAPI runs"
}

output "api_endpoint_url" {
  value       = local.api_endpoint_url
  description = "GraphQL API endpoint URL of the GeoAPI"
}
