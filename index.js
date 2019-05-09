const express = require('express');
const WebhooksApi = require('@octokit/webhooks');
const app = express();
require('dotenv').config();
const deploy = require('./lib/deploy/deploy');

const {
	APP_PATH,
	DOWNSTREAM_JOB_PATH,
	REPO_NAME,
	SECRET,
	SERVER_PORT,
} = process.env;

if( !APP_PATH || !REPO_NAME || !SECRET || !SERVER_PORT ) {
	console.error('Please configure the application.');
	process.exit(0);
}

const webhooks = new WebhooksApi({
  secret: SECRET
});

webhooks.on('error', (error) => {
  console.log(`Uncredentialled request`);
})

webhooks.on('*', ({payload}) => deploy(payload, APP_PATH, DOWNSTREAM_JOB_PATH));

app.use('/deploy', webhooks.middleware);

app.post('/deploy', (req, res) => {
	// Just to keep github happy, we will always respond with a 200
	res.sendStatus(200);
});

app.listen(SERVER_PORT, function () {
	console.log(`Listening for incoming git hooks on port ${SERVER_PORT}`)
});
