const updateDeploymentStatus = (payload, octokit) => {
	console.log(`Deployment status for ${payload['id']} is ${payload['state']}`);
};

module.exports = updateDeploymentStatus;
