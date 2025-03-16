variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "bucket_terraform" {
  type        = string
  description = "GCS bucket for storing tfstate"
}
