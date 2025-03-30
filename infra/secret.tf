resource "google_secret_manager_secret" "neon" {
  secret_id = "neon"
  replication {
    auto {}
  }
}
