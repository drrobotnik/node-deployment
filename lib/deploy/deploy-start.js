
const startDeployment = (pull_request, octokit) => {
	const user = pull_request.user.login;
	const payload = {
		environment: 'production',
		deploy_user: user,
	};

	const description = `Deploying ${pull_request.ref}`;

	octokit.repos.createDeployment({
		owner: pull_request.repository.owner.name,
		repo: pull_request.repository.name,
		ref: pull_request.ref,
		payload,
		description
	})
};

module.exports = startDeployment;
