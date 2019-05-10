const express = require('express');
const WebhooksApi = require('@octokit/webhooks');
const Octokit = require('@octokit/rest')
const app = express();
require('dotenv').config();
const deploy = require('./lib/deploy/deploy');
const startDeployment = require('./lib/deploy/deploy-start');
const processDeployment = require('./lib/deploy/deploy-process');
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

const octokit = new Octokit({
	auth: TOKEN
});

const webhooks = new WebhooksApi({
  secret: SECRET
});

webhooks.on('error', (error) => {
  console.log(error);
});

//webhooks.on('*', ({payload}) => deploy(payload, APP_PATH, DOWNSTREAM_JOB_PATH));
webhooks.on('*', ({ id, name, payload}) => {
	console.log(id, name);

});

webhooks.on('pull_request', ({payload}) => {
	const {action, pull_request } = payload;
	if( action === 'closed' && pull_request.merged === true ) {
		slog('Should start deployment...');
		startDeployment(payload, octokit);
	}
});

webhooks.on('deployment', ({payload}) => {
	processDeployment(payload, 'pending', octokit);
	deploy(payload, APP_PATH, DOWNSTREAM_JOB_PATH, ()=>{ processDeployment(payload, 'success', octokit); })
});

webhooks.on('deployment_status', ({payload}) => updateDeploymentStatus(payload, octokit));

app.use('/deploy', webhooks.middleware);

app.post('/deploy', (req, res) => {
	// Just to keep github happy, we will always respond with a 200
	res.sendStatus(200);
});

app.listen(SERVER_PORT, function () {
	console.log(`Listening for incoming git hooks on port ${SERVER_PORT}`)
});
