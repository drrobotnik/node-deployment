const slog = require('../slog/slog');
const startDeployment = (payload, octokit) => {
	const { pull_request, repository } = payload;
	const user = pull_request.user.login;
	const deployment_payload = {
		environment: 'production',
		deploy_user: user,
	};

	const description = `Deploying ${pull_request.head.ref}`;

	const deployment = {
		owner: repository.owner.login,
		repo: repository.name,
		ref: pull_request.head.ref,
		payload: deployment_payload,
		task: 'deployment',
		description
	};

	octokit.repos.createDeployment(deployment);
};

module.exports = startDeployment;
