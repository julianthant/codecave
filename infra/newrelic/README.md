# New Relic Infrastructure Agent

This directory contains the configuration and Docker setup for the New Relic Infrastructure Agent that monitors the CodeCave production environment.

## Files

- `newrelic-infra.yml` - Agent configuration file with license key
- `newrelic-infra.dockerfile` - Docker image definition extending the official New Relic infrastructure image

## Usage

The New Relic agent is automatically started as part of the production Docker Compose stack:

```bash
# Start the agent
docker compose -f docker-compose.prod.yml up -d newrelic-agent

# View logs
docker logs newrelic-infra

# Stop the agent
docker compose -f docker-compose.prod.yml stop newrelic-agent
```

## Configuration

The agent is configured to:

- Monitor host system metrics
- Monitor Docker containers
- Connect to the `codecave-prod-network`
- Run with privileged access for full system monitoring

## Network

The agent connects to the `codecave-prod-network` and can monitor all other services in the stack including:

- API (NestJS)
- Search (Meilisearch)
- Message Queue (RabbitMQ)
- Cache (Redis)
- Gateway (Kong)

## Troubleshooting

The agent may show warnings about DMI/systemd when running on macOS in Docker. These are expected and don't affect functionality.
