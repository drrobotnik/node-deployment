
const startDeployment = (payload, octokit) => {
	const {pull_request, repository } = payload;
	const user = user.login;
	const payload = {
		environment: 'production',
		deploy_user: user,
	};

	const description = `Deploying ${pull_request.ref}`;

	octokit.repos.createDeployment({
		owner: repository.owner.name,
		repo: repository.name,
		ref,
		payload,
		description
	})
};

module.exports = startDeployment;
