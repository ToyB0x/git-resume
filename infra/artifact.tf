resource "google_artifact_registry_repository" "git_job" {
  location      = "us-central1"
  repository_id = "git-job"
  format        = "DOCKER"

  cleanup_policies {
    id     = "keep_latest_1_versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 1
    }
  }

  cleanup_policies {
    id     = "delete_older_than_1hour"
    action = "DELETE"
    condition {
      older_than = "3600s" # 60 秒 * 60 分 * 1 時間 = 3600 秒
    }
  }
}