resource "google_secret_manager_secret" "neon" {
  secret_id = "neon"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "gemini" {
  secret_id = "gemini"
  replication {
    auto {}
  }
}
