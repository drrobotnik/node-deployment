const p = require('path');
const bodyParser = require('body-parser');
const { execSync: exec } = require('child_process');
const slog = require('../slog/slog');

const isValidPath = (path=null) => path && p.resolve(__dirname, path) !== process.cwd();

const deploy = ( payload={}, app_path=null, downstream_path=null) => {

	const {
		repository: { name: repo_name = null } = { name: null }
	} = payload;

	if( !isValidPath(app_path) ) {
		process.exit(0);
	}

	slog(`Recieving web hook for the ${repo_name} repository!`);
	slog("Pulling files");

	const git = `git -C ${app_path}`;
	const stash = `${git} stash`; // courteously non-destructive
	const reset = `${git} reset --hard`;
	const clean = `${git} clean -df`;
	const pull = `${git} pull -f`;

	// Pass through the corresponding stdio stream to/from the parent process.
	const execOptions = { stdio: 'inherit' };

	exec(`${stash} && ${reset} && ${clean} && ${pull}`, execOptions );

	if( !isValidPath(downstream_path) ) {
		// Allow for configuration specific downstream jobs to be executed.
		exec( downstream_path, execOptions );
	}
}

module.exports = deploy;
