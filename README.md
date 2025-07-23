# CodeCave

CodeCave is a developer-focused social platform designed for sharing and collaborating on coding projects.

## 🚀 Features

- **Project Showcase**: Share your coding projects with the community
- **Developer Networking**: Connect with other developers
- **Collaboration**: Find partners for your projects
- **OAuth Authentication**: Easy sign-in with GitHub and Google
- **Developer Groups**: Join communities around specific technologies

## 🛠️ Tech Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: NestJS with GraphQL API
- **Database**: PostgreSQL (Digital Ocean managed)
- **Search**: Meilisearch
- **Authentication**: Better Auth (OAuth)
- **Infrastructure**: Docker, Terraform, Digital Ocean

## 📦 Project Structure

```
codecave/
├── apps/                     # Application modules
│   ├── api/                  # NestJS backend
│   └── web/                  # Next.js frontend
├── documentation/            # Project documentation
│   ├── authentication/       # Authentication docs
│   ├── development/          # Development setup docs
│   ├── frontend/             # Frontend architecture docs
│   └── infrastructure/       # Infrastructure docs
├── infra/                    # Infrastructure as code
│   └── terraform/            # Terraform configurations
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Local development services
└── pnpm-workspace.yaml       # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Docker and Docker Compose
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/codecave.git
cd codecave

# Install dependencies
pnpm install

# Copy environment template
cp env.example .env

# Start infrastructure services
docker-compose up -d

# Start development servers
pnpm dev
```

## 🏗️ Architecture

### Production Setup

- **Load Balancer**: Digital Ocean Load Balancer with SSL termination
- **API**: NestJS backend with Docker containers
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis for sessions and caching
- **Search**: Meilisearch for full-text search
- **Queue**: RabbitMQ for background jobs
- **Monitoring**: New Relic APM + Sentry error tracking

### Development Services

Access your local services:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Meilisearch**: http://localhost:7700
- **RabbitMQ Admin**: http://localhost:15672

## 📚 Documentation

Comprehensive guides are available in the `documentation/` directory:

- [Project Overview](documentation/PROJECT-OVERVIEW.md)
- [Local Development Guide](documentation/development/LOCAL-DEVELOPMENT-GUIDE.md)
- [Authentication Guide](documentation/authentication/AUTHENTICATION-GUIDE.md)
- [Infrastructure Guide](documentation/infrastructure/DOCKER-GUIDE.md)

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start all services
docker-compose up -d

# Start development (frontend + backend)
pnpm dev

# Database operations
cd apps/api
pnpm prisma:migrate:dev     # Create migration
pnpm prisma:migrate:deploy  # Apply migrations
pnpm prisma studio          # Open database browser

# Testing
pnpm test                   # Run tests
pnpm test:e2e              # Run E2E tests

# Build for production
pnpm build
```

## 🚀 Deployment

The project uses automated deployment via GitHub Actions:

1. **Push to main** triggers deployment
2. **SSH to server** and pulls latest code
3. **Docker build** and container restart
4. **Health checks** verify deployment

Production API: https://api.codecave.tech

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Production API**: https://api.codecave.tech
- **Documentation**: [./documentation/](./documentation/)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-username/codecave/issues)
