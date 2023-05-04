## these dns changes are done in the infra shared project (https://gitlab.com/holisticfoundation/holi-infra)
## because the zone apis.project-holi.org is managed in that project.

locals {
  # effectively, this is geo.apis.project-holi.org
  geo_api_environments_zone_dns_name = "geo.${data.terraform_remote_state.holi_infra_state.outputs.dns_apis_zone_domain}."
}

# geo api environments zone
resource "google_dns_managed_zone" "geo_api_environments_zone" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = "geo-api-holi-social-environments-zone"
  dns_name = local.geo_api_environments_zone_dns_name
}

resource "google_dns_record_set" "geo_api_environments_zone_entry" {
  project = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name    = local.geo_api_environments_zone_dns_name
  type    = "NS"
  ttl     = 300

  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_apis_zone_name

  rrdatas = google_dns_managed_zone.geo_api_environments_zone.name_servers
}

output "dns_geo_api_domain" {
  value = trim(google_dns_managed_zone.geo_api_environments_zone.dns_name, ".")
}

output "dns_geo_api_domain_name" {
  value = google_dns_managed_zone.geo_api_environments_zone.name
}
