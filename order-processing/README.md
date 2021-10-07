# Overview

Process Order & Returns

## prerequisite

- [yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
- [terraform](https://www.terraform.io/downloads.html)
- [commercetools-terraform-proivder](https://github.com/labd/terraform-provider-commercetools)
- commercetools project
 
 ## How to:

[Install commercetools-terraform-proivder](https://github.com/labd/terraform-provider-commercetools#installation)


## Deployment

1. configure commercetools project detail in `./.env` (mkdir .env):

```json
NODE_ENV=development
module_name=order-processing-module
gcp_region=europe-west1
apiUrl=https://api.europe-west1.gcp.commercetools.com
authUrl=https://auth.europe-west1.gcp.commercetools.com
projectKey=<projectKey>
clientId=<clientid>
clientSecret=<clientSecret>
```

---
**<span style="color:red">NOTE</span>**

<span style="color:blue">terraform state is used to keep an state for multiple commercetools project. the states are kept in `.terraform.tfstate.d` directory. do not delete, the `projectKey` in the config section is used to `create` or `select` terraform environments.</span>

---


3. `yarn deploy`

## Data-Overview

On Order update the order is pushed to Google Pub/Sub.
Serverless function process the queue and post to bigquery

### Example Message send by CTP to Google Pub/Sub

```json
{
    "notificationType": "ResourceUpdated",
    "projectKey": "<projectKey>",
    "resource": {
        "typeId": "order",
        "id": "<orderId>"
    },
    "resourceUserProvidedIdentifiers": {},
    "version": 1,
    "modifiedAt": "2020-06-22T16:30:36.315Z"
}
```