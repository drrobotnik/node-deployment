const express = require('express');
const bodyParser = require('body-parser');
const { execSync: exec } = require('child_process');
const WebhooksApi = require('@octokit/webhooks');
const app = express();
require('dotenv').config();

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

webhooks.on('*', ({id, name, payload}) => {

	console.log(id, name, 'event received');
	console.log(payload);

})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/deploy', webhooks.middleware);

app.post('/deploy', (req, res) => {
	// Just to keep github happy, we will always respond with a 200
	res.sendStatus(200);
});

app.listen(SERVER_PORT, function () {
	console.log(`Listening for incoming git hooks on port ${SERVER_PORT}`)
});
