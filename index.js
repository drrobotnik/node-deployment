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

webhooks.on('error', (error) => {
  console.log(`Uncredentialled request`);
})

webhooks.on('*', ({id, name, payload}) => {

	const {
		commits,
		repository: { name: repo_name = "bar" }
	} = payload;

	console.log(`Recieving web hook for the ${repo_name} repository!`);

	console.log("Pulling files");

	const git = `git -C ${APP_PATH}`;
	const reset = `${git} reset --hard`;
	const clean = `${git} clean -df`;
	const pull = `$git pull -f`;

	// Pass through the corresponding stdio stream to/from the parent process.
	const execOptions = { stdio: 'inherit' };

	console.log(commits);

	exec(`${reset} && ${clean} && ${pull}`, execOptions );

	if( DOWNSTREAM_JOB_PATH ) {
		// Allow for configuration specific downstream jobs to be executed.
		exec( DOWNSTREAM_JOB_PATH, execOptions );
	}
})

app.use('/deploy', webhooks.middleware);

app.post('/deploy', (req, res) => {
	// Just to keep github happy, we will always respond with a 200
	res.sendStatus(200);
});

app.listen(SERVER_PORT, function () {
	console.log(`Listening for incoming git hooks on port ${SERVER_PORT}`)
});
