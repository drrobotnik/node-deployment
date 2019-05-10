const processDeployment = (payload, status='success', octokit) => {
	const defaultStatus = {
		owner: payload.repository.owner.name,
		repo: payload.repository.name,
		deployment_id: payload.id
	};

	octokit.repos.createDeploymentStatus({
		...defaultStatus,
		state: status,
	});

}

module.exports = processDeployment;
