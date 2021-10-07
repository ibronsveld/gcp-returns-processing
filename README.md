# gcp-returns-processing
Processing returns on orders for use with BigQuery

## Contents of the repo
This repo contains the following folders:

* /
The root of the project contains a CLI application to help generate orders or add returns programmatically

* /order-processing
The order processing folder contains the logic to process order update messages from GCP

* /order-processing/infra-as-code
This folder contains the terraform logic to deploy the code on gcp

## Using the CLI application
First install the application dependencies

```
yarn install
```

### Importing a number of orders
The CLI application can import certain orders