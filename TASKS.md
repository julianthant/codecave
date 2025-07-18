These are follow up questions/tasks based on our lastest conversation:

1) This is the terraform plan and apply actions log:

Configure Digital Ocean CLI:
Run digitalocean/action-doctl@v2
/usr/bin/tar xz --warning=no-unknown-keyword -C /home/runner/work/_temp/0a31f7d9-7b1c-40ed-9482-0ee50c597ffd -f /home/runner/work/_temp/dae28bf3-8cee-41b6-b93d-ffabc4990a7f
>>> doctl version v1.133.0 installed to /opt/hostedtoolcache/doctl/1.133.0/x64
Error: Input required and not supplied: token

This is the deploy to server and the actions log:

Run appleboy/ssh-action@v1.0.3
/usr/bin/docker run --name cd61ae79b53b5f6ba4418be2dfd4ac663734c_0d3920 --label 5cd61a --workdir /github/workspace --rm -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SCRIPT" -e "INPUT_PORT" -e "INPUT_PASSPHRASE" -e "INPUT_PASSWORD" -e "INPUT_SYNC" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_CIPHER" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_FINGERPRINT" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_CIPHER" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "INPUT_SCRIPT_STOP" -e "INPUT_ENVS" -e "INPUT_ENVS_FORMAT" -e "INPUT_DEBUG" -e "INPUT_ALLENVS" -e "INPUT_REQUEST_PTY" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/codecave/codecave":"/github/workspace" 5cd61a:e79b53b5f6ba4418be2dfd4ac663734c
======CMD======
# Navigate to project directory
cd ~/codecave

# Pull latest changes
echo "🔄 Pulling latest changes from main..."
git pull origin main

# Stop existing services
echo "🛑 Stopping existing services..."
doppler run --config=prd --project=codecave -- docker-compose -f docker-compose.prod.yml down

# Remove old images to ensure fresh build
echo "🧹 Cleaning up old images..."
docker image prune -f

# Build and start services
echo "🚀 Building and starting services..."
doppler run --config=prd --project=codecave -- docker-compose -f docker-compose.prod.yml up -d --build

# Show running containers
echo "✅ Deployment complete! Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Show service health
echo "🏥 Service health check:"
sleep 5
curl -f http://localhost:3001/health || echo "⚠️  API health check failed" 
======END======
out: 🔄 Pulling latest changes from main...
err: From https://github.com/julianthant/codecave
err:  * branch            main       -> FETCH_HEAD
err:    4f92f80..15cda68  main       -> origin/main
out: Updating 4f92f80..15cda68
out: Fast-forward
out:  .github/workflows/deploy.yml                       |  46 +++
out:  .github/workflows/terraform.yml                    |  74 +++++
out:  .../daemon/c9775faf3c93c06a-turbo.log.2025-07-18   |   0
out:  PRODUCTION-FIX.md                                  | 102 ------
out:  TASKS.md                                           |  12 +
out:  apps/api/Dockerfile.prod                           |  68 +---
out:  apps/web/.next/app-build-manifest.json             |  30 +-
out:  apps/web/.next/build-manifest.json                 |  23 +-
out:  apps/web/.next/package.json                        |   4 +-
out:  apps/web/.next/prerender-manifest.json             |   6 +-
out:  apps/web/.next/server/app-paths-manifest.json      |   5 +-
out:  .../a0aae_@sentry_nextjs_build_cjs_793b3315._.js   |   2 +-
out:  .../edge/chunks/node_modules__pnpm_be30d731._.js   |   2 +-
out:  apps/web/.next/server/middleware-build-manifest.js |  23 +-
out:  apps/web/.next/server/next-font-manifest.js        |   2 +-
out:  apps/web/.next/server/next-font-manifest.json      |   9 +-
out:  apps/web/.next/trace                               |   4 +
out:  docker-compose.prod.yml                            |  51 +--
out:  documentation/LOCAL-ENV-SETUP.md                   | 107 +++++++
out:  PROJECT-PLAN.md => documentation/PROJECT-PLAN.md   |   0
out:  PROJECT-SETUP.md => documentation/PROJECT-SETUP.md |   0
out:  .../TERRAFORM-SETUP.md                             |   0
out:  documentation/THIRD-PARTY-TOOLS-SETUP.md           | 269 ++++++++++++++++
out:  infra/terraform/outputs.tf                         |  28 +-
out:  infra/terraform/spaces.tf                          | 110 +++++++
out:  infra/terraform/terraform.tfstate                  | 355 ++++++++++++++++++++-
out:  infra/terraform/terraform.tfstate.backup           |  74 ++++-
out:  kong/kong.yml                                      | 142 +++++++++
out:  nginx/nginx.conf                                   |  50 ---
out:  nginx/sites/codecave.conf                          |  75 -----
out:  scripts/deploy-production.sh                       |  89 ------
out:  scripts/deploy-server.sh                           |  67 ++++
out:  scripts/setup-production.sh                        | 289 -----------------
out:  33 files changed, 1313 insertions(+), 805 deletions(-)
out:  create mode 100644 .github/workflows/deploy.yml
out:  create mode 100644 .github/workflows/terraform.yml
out:  create mode 100644 .turbo/daemon/c9775faf3c93c06a-turbo.log.2025-07-18
out:  delete mode 100644 PRODUCTION-FIX.md
out:  create mode 100644 TASKS.md
out:  create mode 100644 documentation/LOCAL-ENV-SETUP.md
out:  rename PROJECT-PLAN.md => documentation/PROJECT-PLAN.md (100%)
out:  rename PROJECT-SETUP.md => documentation/PROJECT-SETUP.md (100%)
out:  rename TERRAFORM-SETUP.md => documentation/TERRAFORM-SETUP.md (100%)
out:  create mode 100644 documentation/THIRD-PARTY-TOOLS-SETUP.md
out:  create mode 100644 infra/terraform/spaces.tf
out:  create mode 100644 kong/kong.yml
out:  delete mode 100644 nginx/nginx.conf
out:  delete mode 100644 nginx/sites/codecave.conf
out:  delete mode 100755 scripts/deploy-production.sh
out:  create mode 100755 scripts/deploy-server.sh
out:  delete mode 100644 scripts/setup-production.sh
out: 🛑 Stopping existing services...
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"REDIS_PASSWORD\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"RABBITMQ_USER\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"RABBITMQ_PASS\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"MEILI_MASTER_KEY\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"RABBITMQ_USER\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"RABBITMQ_PASS\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:12Z" level=warning msg="The \"REDIS_PASSWORD\" variable is not set. Defaulting to a blank string."
err:  Container codecave-api-prod  Stopping
err:  Container codecave-gateway-prod  Stopping
err:  Container codecave-api-prod  Stopped
err:  Container codecave-api-prod  Removing
err:  Container codecave-api-prod  Removed
err:  Container codecave-search-prod  Stopping
err:  Container codecave-mq-prod  Stopping
err:  Container codecave-redis-prod  Stopping
err:  Container codecave-redis-prod  Stopped
err:  Container codecave-redis-prod  Removing
err:  Container codecave-search-prod  Stopped
err:  Container codecave-search-prod  Removing
err:  Container codecave-redis-prod  Removed
err:  Container codecave-search-prod  Removed
err:  Container codecave-gateway-prod  Stopped
err:  Container codecave-gateway-prod  Removing
err:  Container codecave-gateway-prod  Removed
err:  Container codecave-kong-migrations-prod  Stopping
err:  Container codecave-kong-migrations-prod  Stopped
err:  Container codecave-kong-migrations-prod  Removing
err:  Container codecave-kong-migrations-prod  Removed
err:  Container codecave-mq-prod  Stopped
err:  Container codecave-mq-prod  Removing
err:  Container codecave-mq-prod  Removed
err:  Network codecave-prod-network  Removing
err:  Network codecave-prod-network  Removed
out: 🧹 Cleaning up old images...
out: Total reclaimed space: 0B
out: 🚀 Building and starting services...
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"RABBITMQ_USER\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"RABBITMQ_PASS\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"REDIS_PASSWORD\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"MEILI_MASTER_KEY\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"RABBITMQ_USER\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"RABBITMQ_PASS\" variable is not set. Defaulting to a blank string."
err: time="2025-07-18T11:25:14Z" level=warning msg="The \"REDIS_PASSWORD\" variable is not set. Defaulting to a blank string."
out: #1 [internal] load local bake definitions
out: #1 reading from stdin 337B done
out: #1 DONE 0.0s
out: #2 [internal] load build definition from Dockerfile.prod
out: #2 transferring dockerfile: 755B done
out: #2 DONE 0.0s
out: #3 [internal] load metadata for docker.io/library/node:18-alpine
out: #3 DONE 0.0s
out: #4 [internal] load .dockerignore
out: #4 transferring context: 2B done
out: #4 DONE 0.0s
out: #5 [ 1/11] FROM docker.io/library/node:18-alpine
out: #5 DONE 0.0s
out: #6 [ 2/11] WORKDIR /app
out: #6 DONE 0.1s
out: #7 [internal] load build context
out: #7 transferring context: 117.32MB 3.5s done
out: #7 DONE 3.5s
out: #8 [ 3/11] RUN npm install -g pnpm@8.15.0
out: #8 4.575 npm warn deprecated pnpm@8.15.0: This version switched to a hashing algorithm for side-effects cache keys that didn't solve the long string error it was supposed to fix. Upgrade to v8.15.1 or newer, which has the fix.
out: #8 4.585 
out: #8 4.585 added 1 package in 3s
out: #8 4.586 
out: #8 4.586 1 package is looking for funding
out: #8 4.587   run `npm fund` for details
out: #8 4.592 npm notice
out: #8 4.592 npm notice New major version of npm available! 10.8.2 -> 11.4.2
out: #8 4.592 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.4.2
out: #8 4.592 npm notice To update run: npm install -g npm@11.4.2
out: #8 4.592 npm notice
out: #8 DONE 4.8s
out: #9 [ 4/11] COPY package*.json ./
out: #9 DONE 0.0s
out: #10 [ 5/11] COPY pnpm-lock.yaml ./
out: #10 DONE 0.0s
out: #11 [ 6/11] COPY pnpm-workspace.yaml ./
out: #11 DONE 0.0s
out: #12 [ 7/11] COPY apps/api/package*.json ./apps/api/
out: #12 DONE 0.0s
out: #13 [ 8/11] COPY apps/web/package*.json ./apps/web/
out: #13 DONE 0.0s
out: #14 [ 9/11] RUN pnpm install --filter @codecave/api --prod --no-frozen-lockfile
out: #14 1.388 Lockfile is up to date, resolution step is skipped
out: #14 1.572 Progress: resolved 1, reused 0, downloaded 0, added 0
out: #14 1.853 .                                        | +463 ++++++++++++++++++++++++++++++++
out: #14 2.346 
out: #14 2.346    ╭───────────────────────────────────────────────────────────────────╮
out: #14 2.346    │                                                                   │
out: #14 2.346    │                Update available! 8.15.0 → 10.13.1.                │
out: #14 2.346    │   Changelog: https://github.com/pnpm/pnpm/releases/tag/v10.13.1   │
out: #14 2.346    │                 Run "pnpm add -g pnpm" to update.                 │
out: #14 2.346    │                                                                   │
out: #14 2.346    │      Follow @pnpmjs for updates: https://twitter.com/pnpmjs       │
out: #14 2.346    │                                                                   │
out: #14 2.346    ╰───────────────────────────────────────────────────────────────────╯
out: #14 2.346 
out: #14 2.574 Progress: resolved 463, reused 0, downloaded 0, added 0
out: #14 3.578 Progress: resolved 463, reused 0, downloaded 20, added 7
out: #14 4.601 Progress: resolved 463, reused 0, downloaded 64, added 53
out: #14 5.607 Progress: resolved 463, reused 0, downloaded 115, added 103
out: #14 6.609 Progress: resolved 463, reused 0, downloaded 148, added 134
out: #14 7.612 Progress: resolved 463, reused 0, downloaded 207, added 196
out: #14 8.617 Progress: resolved 463, reused 0, downloaded 242, added 226
out: #14 9.629 Progress: resolved 463, reused 0, downloaded 275, added 261
out: #14 10.63 Progress: resolved 463, reused 0, downloaded 293, added 279
out: #14 11.63 Progress: resolved 463, reused 0, downloaded 332, added 317
out: #14 12.67 Progress: resolved 463, reused 0, downloaded 390, added 377
out: #14 13.69 Progress: resolved 463, reused 0, downloaded 409, added 395
out: #14 14.72 Progress: resolved 463, reused 0, downloaded 415, added 401
out: #14 15.72 Progress: resolved 463, reused 0, downloaded 419, added 405
out: #14 17.89 Progress: resolved 463, reused 0, downloaded 420, added 405
out: #14 18.90 Progress: resolved 463, reused 0, downloaded 425, added 410
out: #14 19.90 Progress: resolved 463, reused 0, downloaded 428, added 412
out: #14 20.91 Progress: resolved 463, reused 0, downloaded 448, added 435
out: #14 21.91 Progress: resolved 463, reused 0, downloaded 462, added 452
out: #14 23.29 Progress: resolved 463, reused 0, downloaded 463, added 452
out: #14 23.37 Progress: resolved 463, reused 0, downloaded 463, added 463, done
out: #14 23.85 .../node_modules/@nestjs/core postinstall$ opencollective || exit 0
out: #14 24.36 .../node_modules/@nestjs/core postinstall:                            Thanks for installing nest 
out: #14 24.36 .../node_modules/@nestjs/core postinstall:                  Please consider donating to our open collective
out: #14 24.37 .../node_modules/@nestjs/core postinstall:                         to help us maintain this package.
out: #14 24.37 .../node_modules/@nestjs/core postinstall:                                          
out: #14 24.37 .../node_modules/@nestjs/core postinstall:                             Number of contributors: 0
out: #14 24.37 .../node_modules/@nestjs/core postinstall:                              Number of backers: 1119
out: #14 24.45 .../node_modules/@nestjs/core postinstall:                              Annual budget: $138,302
out: #14 24.45 .../node_modules/@nestjs/core postinstall:                              Current balance: $16,128
out: #14 24.46 .../node_modules/@nestjs/core postinstall:                                          
out: #14 24.46 .../node_modules/@nestjs/core postinstall:              Become a partner: https://opencollective.com/nest/donate
out: #14 24.46 .../node_modules/@nestjs/core postinstall:                                          
out: #14 24.52 .../node_modules/@nestjs/core postinstall: Done
out: #14 24.72 .../node_modules/@sentry/cli postinstall$ node ./scripts/install.js
out: #14 24.94 .../node_modules/@sentry/cli postinstall: Done
out: #14 24.97 .../sharp@0.34.3/node_modules/sharp install$ node install/check.js
out: #14 25.15 .../sharp@0.34.3/node_modules/sharp install: Done
out: #14 25.18 .../node_modules/@vercel/speed-insights postinstall$ node scripts/postinstall.mjs
out: #14 25.29 .../node_modules/@vercel/speed-insights postinstall: Done
out: #14 25.64 Done in 25.3s
out: #14 DONE 26.1s
out: #15 [10/11] COPY . .
out: #15 DONE 0.8s
out: #16 [11/11] RUN pnpm --filter @codecave/api build
out: #16 1.109 
out: #16 1.109 > @codecave/api@0.1.0 build /app/apps/api
out: #16 1.109 > nest build
out: #16 1.109 
out: #16 1.161 node:internal/modules/cjs/loader:1143
out: #16 1.161   throw err;
out: #16 1.161   ^
out: #16 1.161 
out: #16 1.161 Error: Cannot find module '/app/apps/api/node_modules/@nestjs/cli/bin/nest.js'
out: #16 1.161     at Module._resolveFilename (node:internal/modules/cjs/loader:1140:15)
out: #16 1.161     at Module._load (node:internal/modules/cjs/loader:981:27)
out: #16 1.161     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
out: #16 1.161     at node:internal/main/run_main_module:28:49 {
out: #16 1.161   code: 'MODULE_NOT_FOUND',
out: #16 1.161   requireStack: []
out: #16 1.161 }
out: #16 1.162 
out: #16 1.162 Node.js v18.20.8
out: #16 1.173 /app/apps/api:
out: #16 1.173  ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @codecave/api@0.1.0 build: `nest build`
out: #16 1.173 Exit status 1
out: #16 ERROR: process "/bin/sh -c pnpm --filter @codecave/api build" did not complete successfully: exit code: 1
out: ------
out:  > [11/11] RUN pnpm --filter @codecave/api build:
out: 1.161     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
out: 1.161     at node:internal/main/run_main_module:28:49 {
out: 1.161   code: 'MODULE_NOT_FOUND',
out: 1.161   requireStack: []
out: 1.161 }
out: 1.162 
out: 1.162 Node.js v18.20.8
out: 1.173 /app/apps/api:
out: 1.173  ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @codecave/api@0.1.0 build: `nest build`
out: 1.173 Exit status 1
out: ------
err: Dockerfile.prod:26
err: --------------------
err:   24 |     
err:   25 |     # Build the API
err:   26 | >>> RUN pnpm --filter @codecave/api build
err:   27 |     
err:   28 |     # Expose the port
err: --------------------
err: failed to solve: process "/bin/sh -c pnpm --filter @codecave/api build" did not complete successfully: exit code: 1
out: ✅ Deployment complete! Running containers:
out: NAMES     STATUS    PORTS
out: 🏥 Service health check:
err:   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
err:                                  Dload  Upload   Total   Spent    Left  Speed
err: 
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
err: curl: (7) Failed to connect to localhost port 3001 after 3 ms: Connection refused
out: ⚠️  API health check failed
==============================================
✅ Successfully executed commands to all host.
==============================================