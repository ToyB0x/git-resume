resource "google_cloudbuild_trigger" "git_job" {
  count = var.project_id == "git-resume-local" ? 0 : 1 # ローカル環境向けではデプロイしない

  name     = "git-job"
  location = "asia-northeast1"
  filename = "apps/job/cloudbuild.yaml"

  github {
    owner = "ToyB0x"
    name  = "git-resume"

    push {
      branch = "^main$"
    }
  }

  service_account = google_service_account.builder.id
}