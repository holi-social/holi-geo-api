resource "google_service_account" "geo_api" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  account_id   = "cloudrun-service-geo-api"
  display_name = "Geo API service account for Cloud Run"
}

output "cloud_run_service_account_email" {
  value = google_service_account.geo_api.email
}
