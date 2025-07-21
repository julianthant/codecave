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
├── kong/                     # API Gateway configuration
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
docker-compose up -d db redis search mq

# Start development servers
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📚 Documentation

Comprehensive documentation is available in the `documentation` directory:

- [Project Overview](documentation/PROJECT-OVERVIEW.md)
- [Local Development Guide](documentation/development/LOCAL-DEVELOPMENT.md)
- [Authentication Overview](documentation/authentication/AUTHENTICATION-OVERVIEW.md)
- [Infrastructure Guide](documentation/infrastructure/DOCKER-INFRASTRUCTURE.md)
- [Frontend Architecture](documentation/frontend/FRONTEND-PLAN.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm web:test

# Run API tests
pnpm api:test

# Run E2E tests
pnpm test:e2e
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

**CodeCave** - Where Developers Share Their Journey and Build Amazing Projects Together.
