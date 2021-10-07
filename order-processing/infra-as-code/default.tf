provider "commercetools" {
  project_key = "${var.project_key}"
  client_id = "${var.client_id}"
  client_secret  = "${var.client_secret}"
  scopes        = "manage_project:${var.project_key}"
  api_url       = "${var.api_url}"
  token_url     = "${var.auth_url}"
}

provider "google" {
  credentials = "${file("account-admin.json")}"
  project     = "${var.gcp_project}"
  region      = "${var.gcp_region}"
}

variable "gcp_project" {
  type = "string"
  default = "ct-sales-207211"
}
variable "gcp_region" {
  type = "string"
  default = "europe-west1"
}

variable "project_key" {
  type = "string"
}
variable "client_id" {
  type = "string"
}

variable "client_secret" {
  type = "string"
}

variable "auth_url" {
  type = "string"
}

variable "api_url" {
  type = "string"
}


variable "module_name" {
  type = "string"
}
