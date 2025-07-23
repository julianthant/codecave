I want you to set newrelic up for me. These are the instructions they gave me.

Create a config file for the agent
Use this command to create the newrelic-infra.yml agent config file with your New Relic license key.

mkdir ~/newrelic-infra && cd ~/newrelic-infra && echo "license_key: 997ac2c1092758946616c3070b82dda9FFFFNRAL" > newrelic-infra.yml

2
Step 2:Create the dockerfile
Create the newrelic-infra.dockerfile extending the newrelic/infrastructure image and add your config to /etc/newrelic-infra.yml.

cat >> newrelic-infra.dockerfile << EOF
FROM newrelic/infrastructure:latest
ADD newrelic-infra.yml /etc/newrelic-infra.yml
EOF

3
Step 3:Create a Docker Compose file
Run this command to create a docker-compose.yaml that specifies the newrelic infrastructure agent as a docker compose service.

cat >> docker-compose.yaml << EOF
version: '3'

services:
agent:
container_name: newrelic-infra
build:
context: .
dockerfile: newrelic-infra.dockerfile
cap_add: - SYS_PTRACE
pid: host
privileged: true
volumes: - "/:/host:ro" - "/var/run/docker.sock:/var/run/docker.sock"
restart: unless-stopped
networks: - codecave-prod-network

networks:
codecave-prod-network:
driver: bridge
EOF

4
Step 4:Build and run your container
Use docker compose to build and start your container.

If you're using Docker Compose v1, replace the above command with docker-compose.

docker compose -f docker-compose.yaml up -d
