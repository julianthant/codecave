CodeCave.tech: Project Setup & Foundation Guide
This document provides a comprehensive checklist to establish the complete technical foundation for the CodeCave.tech project. The goal is to set up the repository structure, local development environment, cloud infrastructure, and all third-party services before application development begins.

Section 1: Foundational Setup
This section covers the absolute basics: the code's home and the secrets' home.

Step 1.1: GitHub Repository & Monorepo
Goal: Create a central, version-controlled home for all project code using a modern monorepo structure. This simplifies dependency management and cross-project changes between the frontend and backend.

Checklist:

[ ] Create a new private GitHub repository named codecave.

[ ] Initialize the repository on your local machine.

[ ] Configure the repository to use pnpm as the package manager.

[ ] Create a pnpm-workspace.yaml file at the root to define the monorepo structure.

[ ] Create placeholder directories:

apps/web (for the Next.js frontend)

apps/api (for the NestJS backend)

packages/ (for shared code, e.g., packages/ui, packages/config)

Step 1.2: Doppler for Secret Management
Goal: Establish a single, secure source of truth for all API keys, environment variables, and other secrets. This prevents secrets from ever being committed to the codebase.

Checklist:

[ ] Create a new Doppler account and organization.

[ ] Create a new project named codecave.

[ ] Within the codecave project, create three initial environments (configs): dev, staging, and prd.

[ ] Note: As you complete each of the following steps in this guide, you will generate API keys and secrets. Add each one to all three Doppler environments immediately after generating it.

Section 2: Core Infrastructure & Services
This section provisions the primary cloud services that will run the application.

Step 2.1: Supabase (Database & Auth)
Goal: Provision the primary PostgreSQL database, user authentication service, and a simple backend API for initial data management.

Checklist:

[ ] Create a new Supabase project named codecave.

[ ] Gather the following keys and add them to Doppler:

SUPABASE_URL: In your Supabase project, go to Project Settings > API. Copy the URL.

SUPABASE_ANON_KEY: This is the public-facing key for your frontend. From the same API page, copy the anon public key.

SUPABASE_SERVICE_ROLE_KEY: This is the secret key for backend use with full privileges. From the same API page, copy the service_role secret key.

DATABASE_URL: This is the direct PostgreSQL connection string for your backend. Go to Project Settings > Database > Connection string. Copy the URI.

Step 2.2: DigitalOcean (Hosting & Storage)
Goal: Set up the cloud provider that will host the backend server and store all user-uploaded files.

Checklist:

[ ] Create a new DigitalOcean Project named codecave.

[ ] Create a new Spaces Bucket for file storage. Name it something globally unique (e.g., codecave-production-storage).

[ ] Navigate to the API section in your DigitalOcean account.

[ ] Gather the following keys and add them to Doppler:

DO_API_TOKEN: Under Tokens, generate a new Personal Access Token with both read and write scopes. This will be used by Terraform.

DO_SPACES_KEY & DO_SPACES_SECRET: Under Spaces access keys, generate a new key pair.

DO_SPACES_BUCKET: The name of the bucket you created (e.g., codecave-production-storage).

DO_SPACES_REGION: The region of your bucket (e.g., nyc3).

Step 2.3: Vercel (Frontend Hosting)
Goal: Connect the hosting platform that will build and deploy the Next.js frontend automatically.

Checklist:

[ ] Create a new Vercel account/team.

[ ] Connect your Vercel account to your GitHub account.

[ ] Gather the following key and add it to Doppler:

VERCEL_API_TOKEN: In Vercel, go to Account Settings > Tokens. Generate a new token.

Section 3: Development & Testing Environment
This section focuses on setting up the local development workflow and testing frameworks.

Step 3.1: Local Environment (Docker Compose)
Goal: Define the complete local development environment in a single, reproducible file. This allows any developer to start all backend services with one command.

Checklist:

[ ] Create a docker-compose.yml file at the root of the monorepo.

[ ] Inside this file, define services for:

api: The NestJS application.

db: A PostgreSQL database container for local testing.

search: The Meilisearch container.

mq: The RabbitMQ container.

gateway: The Kong API Gateway container.

[ ] Configure these services to pull necessary environment variables from a local .env file, which will be populated by the Doppler CLI.

Step 3.2: End-to-End Testing (Playwright)
Goal: Set up the framework for writing automated tests that simulate real user journeys, ensuring application quality before deployment.

Checklist:

[ ] In the apps/web directory of your monorepo, initialize Playwright.

[ ] Configure Playwright to run against the local development environment.

Section 4: Production Infrastructure (Terraform)
Goal: Define all production cloud infrastructure as code, ensuring a reproducible, version-controlled, and automated setup process.

Checklist:

[ ] Create a new directory at the root of the monorepo: infra/terraform.

[ ] Inside this directory, create Terraform configuration files (.tf).

[ ] Define the following DigitalOcean resources in your configuration:

A Droplet that will run the Docker containers for the backend services.

A VPC Network to provide a secure private network for your resources.

Firewall rules to control traffic to the Droplet.

[ ] Configure the Terraform provider to authenticate using the DO_API_TOKEN stored in Doppler.

Section 5: Integrating Supporting Services
This section covers the setup and key generation for all third-party tools.

Step 5.1: Stripe (Payments)
Goal: Integrate the payment processing platform for all monetization features.

Checklist:

[ ] Create a new Stripe account.

[ ] Gather the following keys and add them to Doppler:

STRIPE_PUBLISHABLE_KEY: In the Stripe Dashboard, go to Developers > API keys. Copy the Publishable key.

STRIPE_SECRET_KEY: From the same page, reveal and copy the Secret key.

STRIPE_WEBHOOK_SECRET: Go to Developers > Webhooks. Create a new endpoint and copy the signing secret.

Step 5.2: New Relic (Observability)
Goal: Set up the platform for application performance monitoring (APM) and infrastructure logging.

Checklist:

[ ] Create a New Relic account.

[ ] Gather the following key and add them to Doppler:

NEW_RELIC_LICENSE_KEY: In the New Relic UI, go to (User Menu) > API keys. Copy your Ingest - License key.

Step 5.3: Sentry (Error Tracking)
Goal: Integrate real-time error tracking for both the frontend and backend.

Checklist:

[ ] Create a Sentry account.

[ ] Create two projects within Sentry: codecave-web and codecave-api.

[ ] For each project, navigate to its Settings > Client Keys (DSN).

[ ] Gather the following keys and add them to Doppler:

SENTRY_DSN_WEB: The DSN for the codecave-web project.

SENTRY_DSN_API: The DSN for the codecave-api project.

Step 5.4: Additional Tools Setup
Goal: Integrate the remaining security, code quality, and feature flag tools.

Checklist:

[ ] Astra Security: Create an account and get an API key for vulnerability scanning. Add ASTRA_API_KEY to Doppler.

[ ] ConfigCat: Create an account and a new project. Get the SDK Key. Add CONFIGCAT_SDK_KEY to Doppler.

[ ] CodeScene: Connect your GitHub account to set up code analysis.

[ ] Blackfire.io: Create an account and get your Client ID and Client Token for profiling. Add BLACKFIRE_CLIENT_ID and BLACKFIRE_CLIENT_TOKEN to Doppler.

[ ] ImgBot: Install the ImgBot application on your GitHub repository.