# Frontend - Hotel Booking System

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Vite Version](https://img.shields.io/badge/Vite-5.x-purple)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://www.docker.com/)

Modern, responsive React + TypeScript frontend for the Hotel Booking System. Built with Vite for lightning-fast development and production builds.

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Building for Production](#-building-for-production)
- [Development Guide](#-development-guide)
- [Docker Deployment](#-docker-deployment)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

## 🧠 Overview

The frontend provides a complete user interface for the Hotel Booking System with:

- **Modern UI/UX** - Responsive design with Tailwind CSS
- **Type-Safe Development** - Full TypeScript support
- **Fast Development** - Vite with HMR (Hot Module Replacement)
- **API Integration** - Axios for HTTP requests
- **Authentication** - JWT token management
- **Routing** - React Router for navigation
- **State Management** - Context API + Custom Hooks
- **Error Handling** - Global error handling and user feedback
- **Responsive Design** - Mobile-first approach

## ⚙️ Tech Stack

| Category             | Technology          | Version |
| -------------------- | ------------------- | ------- |
| **Framework**        | React               | 18+     |
| **Language**         | TypeScript          | 5.x     |
| **Build Tool**       | Vite                | 5.x     |
| **Styling**          | Tailwind CSS        | 3.x     |
| **HTTP Client**      | Axios               | 1.x     |
| **Routing**          | React Router        | 6.x     |
| **State Management** | Context API + Hooks | -       |
| **Package Manager**  | npm                 | 9+      |
| **Containerization** | Docker              | 20.10+  |

## 📋 Prerequisites

### Required

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)
- **Git 2.30+**

### Optional

- **Docker 20.10+** - For containerized deployment
- **VS Code** - Recommended editor with extensions

### Installation Commands

```bash
# macOS (using Homebrew)
brew install node

# Windows (using Chocolatey)
choco install nodejs

# Ubuntu/Debian
sudo apt-get install nodejs npm

# Verify installation
node --version
npm --version
```

## 🛠 Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/HoangQuyCoder/hotel-booking-system.git
cd hotel-booking-system/frontend
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or use npm ci (recommended for CI/CD)
npm ci
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
cat .env.local
```

### Step 4: Verify Setup

```bash
# Check Node.js and npm versions
node --version   # Should be 18+
npm --version    # Should be 9+

# Check TypeScript
npm run type-check

# Linting
npm run lint
```

## ⚙️ Configuration

### Environment Variables

**Development (`.env.local`):**

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
VITE_ENV=development
VITE_DEBUG=true
```

**Production (`.env.production`):**

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENV=production
VITE_DEBUG=false
```

## 🚀 Running the Application

### Development Mode

```bash
# Start development server
npm run dev

# Access at http://localhost:5173
```

**Features:**

- Hot Module Replacement (HMR)
- Fast refresh on file changes
- Source maps for debugging

### Preview Mode

```bash
# Build and preview production build
npm run build
npm run preview

# Access at http://localhost:4173
```

## 🔨 Building for Production

### Create Production Build

```bash
# Build optimized bundle
npm run build

# Output: dist/ directory
```

### Build Analysis

```bash
# Analyze bundle size
npm run build -- --reporter=verbose
```

### Production Build Contents

```
dist/
├── index.html
├── assets/
│   ├── index-*.js       # Main bundle
│   ├── vendor-*.js      # Vendor dependencies
│   └── *.css            # Compiled styles
└── favicon.ico
```

### Serve Production Build

```bash
# Using Node.js HTTP server
npx serve dist

# Using Python
python -m http.server --directory dist
```

## 📚 Development Guide

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint --fix

# Type checking
npm run type-check

# Format with Prettier
npm run format
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
# From project root
docker build -f frontend/Dockerfile -t hotel-booking-frontend:latest ./frontend

# Or from frontend directory
cd frontend
docker build -t hotel-booking-frontend:latest .
```

### Run Docker Container

```bash
docker run -d \
  --name hotel-booking-frontend \
  -p 3000:80 \
  -e VITE_API_BASE_URL=http://backend:8081/api/v1 \
  hotel-booking-frontend:latest

# View logs
docker logs -f hotel-booking-frontend
```

### Using Docker Compose

```bash
# From project root
docker-compose up -d frontend

# View logs
docker-compose logs -f frontend

# Rebuild
docker-compose up -d --build frontend
```

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test -- --coverage
```

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Dependency Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### API Connection Errors

```bash
# Check backend running on 8081
curl http://localhost:8081/api/v1/health

# Verify VITE_API_BASE_URL in .env.local
cat .env.local | grep VITE_API_BASE_URL
```

### TypeScript Errors

```bash
npm run type-check

# Restart TS server in IDE
# VS Code: Ctrl+Shift+P > \"TypeScript: Restart TS Server\"
```

### Build Fails

```bash
# Check Node.js version
node --version  # Should be 18+

# Clean build
rm -rf dist
npm run build
```

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint rules
- Format with Prettier
- Component names in PascalCase
- File names in kebab-case
- Constants in UPPER_SNAKE_CASE

---

**Last Updated:** April 2026

**For questions:** hoangquyle11@gmail.com
