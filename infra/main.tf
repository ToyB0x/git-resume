terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.14.1"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "6.14.1"
    }
  }
  backend "gcs" {}
}

# Configures the provider to use the resource block's specified project for quota checks.
# https://firebase.google.com/docs/projects/terraform/get-started?hl=ja#resources-authentication
# https://zenn.dev/maretol/articles/d68bf92c76d0ba
provider "google" {
  project               = var.project_id
  user_project_override = true
}

provider "google" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

data "google_project" "current" {}
