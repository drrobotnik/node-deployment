# Node Deployment

## Add Nginx proxy for node server

Add the `/deploy/` endpoint to nginx inside `server {}`

```
include <PATH>/node_deployment/nginx/deploy.conf;
```
<sub>* replace `<PATH>` with the full path to this project.</sub>

## Configure the environment

rename `.env.sample` to `.env`, and fill in the environmental variables that will tell the deployment hook where, what and when to deploy.

| Key      | Value | Required |
| ----------- | ----------- | ----------- |
| APP_PATH      | The path to the repo receiving the deployment. `EX: ~/detox-net/` | **Yes** |
| BRANCH   | The branch you want the deployment event to run on. `dev`, `master` | **Yes** |
| DOWNSTREAM_JOB   | You can trigger post-deployment jobs by including the path to an executable file. EX: `./bin/build/`. This can be stored in this local bin or anywhere else.        |
| REPO_NAME   | The name of the repo        | **Yes** |
| SERVER_PORT   | 4321        | **Yes** |
| SECRET   | [Webhooks Secret Key](https://github.com/drrobotnik/example/settings/hooks)        | **Yes** |

> All Environment variables are passed to the post-deploy job, so you can reference them directly.

## Create the webhook on github
[Go to github and create the webhook job](https://github.com/drrobotnik/example/settings/hooks). You'll need to include a URL to the `/deploy/` job. Pass all events, or just `push` and `pull_request`.

## Start the deployment server.

pm2 is a process manager for node which will keep the process alive daemonized. Most documentation will tell you to install it globally, but instead use npx.

`npm run pm2:start`

### Resources
https://developer.github.com/v3/activity/events/types/#pullrequestevent
https://developer.github.com/v3/activity/events/types/#pushevent
https://developer.github.com/v3/activity/events/types/#deploymentevent

https://developer.github.com/v3/guides/delivering-deployments/
https://github.com/github/platform-samples/blob/master/api/ruby/delivering-deployments/server.rb
