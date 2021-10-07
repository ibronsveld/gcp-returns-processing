resource "google_storage_bucket" "bucket" {
  name = "${var.project_key}-${var.module_name}-bucket"
}

resource "google_storage_bucket_object" "cloud_code" {
  name   = "${var.project_key}-${var.module_name}-code.zip"
  bucket = "${google_storage_bucket.bucket.name}"
  source = "./code/code.zip"
}


resource "google_cloudfunctions_function" "google_func" {
  name                  = "${var.project_key}-${var.module_name}"
  description           = "commercetools"
  available_memory_mb   = 128
  source_archive_bucket = "${google_storage_bucket.bucket.name}"
  source_archive_object = "${google_storage_bucket_object.cloud_code.name}"
  event_trigger {
    event_type = "providers/cloud.pubsub/eventTypes/topic.publish"
    resource   = "${google_pubsub_topic.ct_orders_created.name}"
    failure_policy {
      retry = true
    }   
  }
#   trigger_http          = false
  timeout               = 60
  runtime               = "nodejs10"
  entry_point           = "entryPoint"

  environment_variables = {
    projectKey = "${var.project_key}"
    clientId = "${var.client_id}"
    clientSecret = "${var.client_secret}"
    apiUrl = "${var.api_url}"
    authUrl = "${var.auth_url}"
  }
}

resource "google_cloudfunctions_function_iam_member" "member" {
    project = google_cloudfunctions_function.google_func.project
    region = google_cloudfunctions_function.google_func.region
    cloud_function = google_cloudfunctions_function.google_func.name
    role = "roles/cloudfunctions.invoker"
    member = "allUsers"
}

