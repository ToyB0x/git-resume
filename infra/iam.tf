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

resource "google_service_account" "git_job_runner" {
  account_id = "git-job-runner"
  display_name = "git-job-runner"
  description = "git-job runner account"
}

resource "google_project_iam_member" "git_job_runner" {
  for_each = toset([
    "roles/run.invoker",
  ])

  project = data.google_project.current.project_id
  role = each.value
  member = "serviceAccount:${google_service_account.git_job_runner.email}"
}

# Add permissions to the specified service account
resource "google_secret_manager_secret_iam_member" "git_job_runner" {
  for_each = toset([
    google_secret_manager_secret.neon.id,
    google_secret_manager_secret.gemini.id,
  ])

  secret_id = each.value
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.git_job_runner.email}"
}

# resource "google_service_account" "git_job_caller_cloudflare" {
#   account_id = "git-job-caller-cloudflare"
#   display_name = "git-job-caller-cloudflare"
#   description = "git-job caller from cloudflare"
# }
#
# resource "google_project_iam_member" "git_job_runner" {
#   for_each = toset([
#     "roles/run.jobsExecutorWithOverrides", # for pass arguments to cloud run job
#   ])
#
#   project = data.google_project.current.project_id
#   role = each.value
#   member = "serviceAccount:${google_service_account.git_job_caller_cloudflare.email}"
# }
