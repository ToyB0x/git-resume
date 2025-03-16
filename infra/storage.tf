# Steps:
# 1. comment out main.tf backend "gcs" {}
# 2. run terraform init / apply below bucket
# 3. remove above comment out (main.tf backend "gcs" {})
# 4. run terraform init -migrate-state (or simply run terraform init: it will ask to migrate state)
# ref: https://cloud.google.com/docs/terraform/resource-management/store-state
resource "google_storage_bucket" "terraform" {
  name     = var.bucket_terraform
  project  = var.project_id
  location = local.region

  force_destroy               = false
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}
