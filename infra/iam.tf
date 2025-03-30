# ref: https://zenn.dev/team_zenn/articles/cloud-build-update-service-account
resource "google_service_account" "builder" {
  account_id = "builder"
  display_name = "builder"
  description = "cloudbuild builder / deployer"
}

resource "google_project_iam_member" "builder" {
  for_each = toset([
    "roles/cloudbuild.builds.builder",
  ])

  project = data.google_project.current.project_id
  role = each.value
  member = "serviceAccount:${google_service_account.builder.email}"
}
