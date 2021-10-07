const _sdkClient = require('@commercetools/sdk-client')
const _sdkMiddlewareAuth = require('@commercetools/sdk-middleware-auth')
const _sdkMiddleWareHttp = require('@commercetools/sdk-middleware-http')

const _apiRequestBuilder = require('@commercetools/api-request-builder')
const fetch = require('node-fetch');

const config = {
    authUrl: process.env.authUrl,
    apiUrl: process.env.apiUrl,
    projectKey: process.env.projectKey,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
}

const client = _sdkClient.createClient({
  // The order of the middlewares is important !!!
  middlewares: [
    _sdkMiddlewareAuth.createAuthMiddlewareForClientCredentialsFlow({
      host: config.authUrl,
      projectKey: config.projectKey,
      credentials: {
        clientId: config.clientId,
        clientSecret: config.clientSecret
      },
      fetch
    }),
    _sdkMiddleWareHttp.createHttpMiddleware({ host: config.apiUrl, fetch })
  ]
});

const requestBuilder = _apiRequestBuilder.createRequestBuilder({ projectKey: config.projectKey })

module.exports = {      
    client, 
    requestBuilder
}