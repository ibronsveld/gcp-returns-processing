resource "google_pubsub_topic" "ct_orders_created" {
  name = "${var.project_key}-${var.module_name}"
}

# data "google_iam_policy" "ct_platform_publisher" {
#   binding {
#     role    = "roles/pubsub.publisher"
#     members = [
#       "serviceAccount:subscriptions@commercetools-platform.iam.gserviceaccount.com",
#     ]
#   }
# }
resource "google_pubsub_topic_iam_member" "ctp-subscription-publisher" {
  topic = "${google_pubsub_topic.ct_orders_created.name}"
  role = "roles/pubsub.publisher"
  member = "serviceAccount:subscriptions@commercetools-platform.iam.gserviceaccount.com"
}

resource "commercetools_subscription" "subscribe" {
  key = "${var.module_name}"

  destination = {
    type = "google_pubsub"
    project_id = "${var.gcp_project}"
    topic = "${google_pubsub_topic.ct_orders_created.name}"
  }

  changes {
    resource_type_ids = [
      "order"
    ]
  }
  depends_on = [ "google_pubsub_topic_iam_member.ctp-subscription-publisher" ]
}