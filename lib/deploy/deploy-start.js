
const startDeployment = (payload, octokit) => {
	const { pull_request, repository } = payload;
	const user = pull_request.user.login;
	const deployment_payload = {
		environment: 'production',
		deploy_user: user,
	};

	const description = `Deploying ${pull_request.head.ref}`;

	octokit.repos.createDeployment({
		owner: repository.owner.login,
		repo: repository.name,
		ref: pull_request.head.ref,
		payload: deployment_payload,
		description
	})
};

module.exports = startDeployment;
