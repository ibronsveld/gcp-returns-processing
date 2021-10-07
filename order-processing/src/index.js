var base64 = require('base-64');
const _app = require('./app');

// running commandline within a node environment
if (process.env.NODE_ENV === 'development') {      
  //const input = require(process.cwd() + '/src/test-data.json')
  
  const input = require(process.cwd() + '/src/test-data-message.json')
  // //var d = JSON.parse(input);
  if (!process.env.projectKey || !process.env.clientId || !process.env.clientSecret ||
    !process.env.authUrl || !process.env.apiUrl) {
      throw new Error("Missing configuration")
  }
  
  _app.AppInit(input).then(data => { if(data) { console.log(data) } }).catch(err => console.log(err))
}

//running the functionality with a http trigger, as well be able to test locally using 'functions' google module
// exports.entryPoint = (req, res) => {
//     if (!process.env.projectKey || !process.env.clientId || !process.env.clientSecret) {
//         throw new Error("Missing configuration")
//     }
//     let message = req.body;
//     _app.AppInit(message).then(data => data === null ? res.status(200).end() : res.status(200).json(data))
// }

// running functionality as back-ground job such as Google PubSub
exports.entryPoint = (data, context) => {
  if (!process.env.projectKey || !process.env.clientId || !process.env.clientSecret ||
      !process.env.authUrl || !process.env.apiUrl) {
      throw new Error("Missing configuration")
  }
  const pubsubMessage = data;
  const message = pubsubMessage.data
    ? Buffer.from(pubsubMessage.data, 'base64').toString()
    : '{}';
  console.log(message);
  _app.AppInit(JSON.parse(message));
};

