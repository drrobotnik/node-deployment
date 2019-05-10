const express = require('express');
const WebhooksApi = require('@octokit/webhooks');
const Octokit = require('@octokit/rest')
const app = express();
require('dotenv').config();
const deploy = require('./lib/deploy/deploy');
const slog = require('./lib/slog/slog');
const {
	APP_PATH,
	DOWNSTREAM_JOB_PATH,
	REPO_NAME,
	SECRET,
	SERVER_PORT,
	TOKEN,
} = process.env;

if( !APP_PATH || !REPO_NAME || !SECRET || !TOKEN || !SERVER_PORT ) {
	console.error('Please configure the application.');
	process.exit(0);
}

const webhooks = new WebhooksApi({
  secret: SECRET
});

webhooks.on('error', (error) => {
  console.log(error);
});

webhooks.on('*', ({ id, name, payload}) => {
	console.log(id, name);
});

webhooks.on('pull_request', ({payload}) => {
	const {action, pull_request } = payload;
	// output the status of the PR.
	slog( `Pull Request ${action}, ${pull_request.merged}` );
	if( action === 'closed' && pull_request.merged === true ) {
		deploy(payload, APP_PATH, DOWNSTREAM_JOB_PATH);
	}
});

app.use('/deploy', webhooks.middleware);

app.post('/deploy', (req, res) => {
	// Just to keep github happy, we will always respond with a 200
	res.sendStatus(200);
});

app.listen(SERVER_PORT, function () {
	console.log(`Listening for incoming git hooks on port ${SERVER_PORT}`)
});
