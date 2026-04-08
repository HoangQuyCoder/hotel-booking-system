# Backend - Hotel Booking System

[![Java Version](https://img.shields.io/badge/Java-17%2B-brightgreen)](https://www.oracle.com/java/)
[![Spring Boot Version](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)](https://spring.io/)
[![Maven Version](https://img.shields.io/badge/Maven-3.8%2B-blue)](https://maven.apache.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://www.docker.com/)

Spring Boot 3.x backend REST API for the Hotel Booking System. This service handles all business logic, database operations, and provides RESTful endpoints for the frontend application.

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Management](#-database-management)
- [Building & Testing](#-building--testing)
- [Docker Deployment](#-docker-deployment)
- [Troubleshooting](#-troubleshooting)

## 🧠 Overview

The backend service implements a complete hotel booking system with:

- **JWT Authentication** - Secure token-based user authentication
- **Role-Based Authorization** - RBAC for USER and ADMIN roles
- **RESTful API** - Comprehensive REST endpoints for all operations
- **Database Layer** - Spring Data JPA with PostgreSQL
- **Business Logic** - Complete booking workflow implementation
- **Error Handling** - Centralized exception handling with meaningful responses
- **Data Validation** - Input validation using Jakarta validation
- **API Documentation** - Swagger/OpenAPI integration

## ⚙️ Tech Stack

| Component            | Technology              | Version |
| -------------------- | ----------------------- | ------- |
| **Language**         | Java                    | 17+     |
| **Framework**        | Spring Boot             | 3.x     |
| **Build Tool**       | Maven                   | 3.8+    |
| **Database**         | PostgreSQL              | 14+     |
| **ORM**              | Spring Data JPA         | -       |
| **Security**         | Spring Security + JWT   | -       |
| **API Docs**         | Springdoc OpenAPI       | 2.x     |
| **Validation**       | Jakarta Bean Validation | 3.x     |
| **Logging**          | SLF4J + Logback         | -       |
| **Testing**          | JUnit 5 + Mockito       | -       |
| **Containerization** | Docker                  | 20.10+  |

## 📋 Prerequisites

### Required

- **Java JDK 17+** ([Download](https://www.oracle.com/java/technologies/downloads/#java17))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **PostgreSQL 14+** ([Download](https://www.postgresql.org/download/))
- **Git 2.30+**

### Optional

- **Docker 20.10+** - For containerized deployment
- **Docker Compose 2.0+** - For multi-container orchestration
- **Postman** or **Insomnia** - For API testing

### Installation Commands

```bash
# macOS (using Homebrew)
brew install java17
brew install maven
brew install postgresql

# Windows (using Chocolatey)
choco install openjdk17
choco install maven
choco install postgresql

# Verify installations
java -version
mvn -version
psql --version
```

## 🛠 Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/HoangQuyCoder/hotel-booking-system.git
cd hotel-booking-system/backend
```

### Step 2: Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

```bash
# Start PostgreSQL
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo systemctl start postgresql

# Access PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE hotel_booking;
CREATE USER hbs_user WITH PASSWORD 'hbs_password';
ALTER ROLE hbs_user SET client_encoding TO 'utf8';
ALTER ROLE hbs_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE hbs_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE hotel_booking TO hbs_user;
\q
```

#### Option B: Using Docker

```bash
# Start from project root
docker-compose up -d postgres

# Wait for database to be ready
sleep 10
```

### Step 3: Configure Application

```bash
# Copy default configuration
cp src/main/resources/application.yml src/main/resources/application-local.yml
```

### Step 4: Build Project

```bash
# Using Maven wrapper (no Maven installation needed)
./mvnw clean install

# Or using Maven directly
mvn clean install
```

## ⚙️ Configuration

### Application Profiles

The backend supports multiple Spring profiles:

#### Development (`dev`)

```bash
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
logging:
  level: DEBUG
```

#### Production (`prod`)

```bash
spring:
  jpa:
    hibernate:
      ddl-auto: validate
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
logging:
  level: INFO
```

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_booking
DB_USER=hbs_user
DB_PASSWORD=hbs_password

# JWT Security
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8081
SPRING_PROFILES_ACTIVE=dev

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Logging
LOGGING_LEVEL=INFO
```

## 🚀 Running the Application

### Development Mode

#### Using Maven

```bash
# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Or set environment variable
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

### Production Mode

```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR with prod profile
export SPRING_PROFILES_ACTIVE=prod
java -jar target/hotel-booking-system-1.0.0.jar
```

### Verify Startup

```bash
# Check if backend is running
curl -i http://localhost:8081/api/v1/health

# Should return HTTP/1.1 200 OK
```

### Access Points

| Service      | URL                                   |
| ------------ | ------------------------------------- |
| Health Check | http://localhost:8081/api/v1/health   |
| Swagger UI   | http://localhost:8081/swagger-ui.html |
| API Docs     | http://localhost:8081/v3/api-docs     |

## 📡 API Documentation

### Swagger/OpenAPI

When the application is running, access interactive API documentation:

```
http://localhost:8081/swagger-ui.html
```

### API Base URL

```
GET/POST/PUT/DELETE http://localhost:8081/api/v1/{resource}
```

### Authentication

All protected endpoints require JWT token in header:

```bash
Authorization: Bearer <jwt_token>
```

## 💾 Database Management

### Migrations

Migrations are managed using Liquibase.

**Location:** `src/main/resources/db/migration/`

### View Migration Status

```bash
mvn liquibase:status
```

### Manual Database Operations

```bash
# Connect to PostgreSQL
psql -U hbs_user -d hotel_booking

# List tables
\dt

# View user table
\d "user"

# Query users
SELECT * FROM "user";

# Exit
\q
```

## 🔧 Building & Testing

### Build Project

```bash
# Clean build
mvn clean install

# Skip tests
mvn clean install -DskipTests
```

### Run Tests

```bash
# All tests
mvn test

# Specific test class
mvn test -Dtest=UserServiceTest

# Coverage report
mvn test jacoco:report
```

### Build Artifacts

```bash
# Build JAR
mvn clean package
# Output: target/hotel-booking-system-1.0.0.jar
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd ..
docker build -f backend/Dockerfile -t hotel-booking-backend:latest ./backend

# Or from backend directory
cd backend
docker build -t hotel-booking-backend:latest .
```

### Run Docker Container

```bash
docker run -d \
  --name hotel-booking-backend \
  -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=postgres \
  -e JWT_SECRET=your-secret-key \
  hotel-booking-backend:latest

# View logs
docker logs -f hotel-booking-backend
```

### Using Docker Compose

```bash
# From project root
docker-compose up -d backend

# View logs
docker-compose logs -f backend

# Rebuild and restart
docker-compose up -d --build backend
```

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U hbs_user -d hotel_booking -c "SELECT version();"

# Check credentials in application.yml
```

### Port 8081 Already in Use

```bash
lsof -i :8081
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8082
```

### Maven Build Fails

```bash
mvn clean install
mvn dependency:resolve
java -version  # Should be 17+
```

### JWT Token Invalid

- Verify `JWT_SECRET` environment variable
- Check token format: `Bearer <token>`
- Check token expiration

---

**Last Updated:** April 2026

**For questions:** hoangquyle11@gmail.com
