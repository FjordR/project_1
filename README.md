# Node.js App with Docker & GitHub Actions CI/CD

A simple full-stack Node.js and PostgreSQL application. The main goal of this repository is to demonstrate a proper DevOps setup, focusing on containerization best practices and a secure GitOps pipeline.

## Features

### Docker Setup
- **Multi-stage builds:** Uses `node:20-slim` and splits dependency installation from the runner stage to keep the final image lightweight and make use of Docker caching.
- **Security:** Runs under a non-root `appuser` instead of root.
- **Healthchecks:** Docker Compose handles the startup order, ensuring the Node app only starts after PostgreSQL passes its `pg_isready` check.

### CI/CD Pipeline (GitHub Actions)
The workflow triggers on pushes to `main` and pull requests. It handles:
- **Linting & Testing:** Code quality checks and test suites run inside the runner.
- **Security Scans:** Uses Aquasecurity Trivy to scan both the filesystem and the final Docker image for vulnerabilities. Results are uploaded to GitHub Security alerts via SARIF.
- **Registry:** Builds and pushes the image to GitHub Container Registry (GHCR) using Git SHA tags and Buildx caching.

### Deployment & Rollback Script
The deployment runs over SSH on a Linux server and includes a custom bash script that:
- Prevents concurrent deployments using a lockfile.
- Saves deployment logs to a history file.
- Automatically rolls back to the previous stable image tag if the new container fails the application health check.

## Tech Stack
- Node.js (Express)
- PostgreSQL
- Docker / Docker Compose
- GitHub Actions & GHCR
- Trivy Vulnerability Scanner
