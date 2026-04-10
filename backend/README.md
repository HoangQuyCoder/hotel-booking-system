# Hotel Booking System - Backend

[![Java Version](https://img.shields.io/badge/Java-17%2B-brightgreen)](https://www.oracle.com/java/)
[![Spring Boot Version](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)](https://spring.io/)
[![Maven Version](https://img.shields.io/badge/Maven-3.x-blue)](https://maven.apache.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust and scalable REST API for the Hotel Booking System. Built with **Spring Boot 3.5.6**, **Java 17**, and **PostgreSQL**, this service handles authentication, booking logic, and comprehensive data management.

---

## 🚀 Overview

The backend service is designed with a clean architecture, focusing on performance, security, and maintainability.

### Core Features

- 🔐 **Robust Security**: Authentication and Authorization powered by Spring Security and JWT.
- 🏨 **Business Logic**: Complete workflows for hotels, rooms, bookings, and promotions.
- 📧 **Email Integration**: Automated transactional emails (bookings, password resets).
- 🔍 **Advanced Filtering**: Flexible data querying using JPA Specifications.
- ⚡ **Optimized Data Mapping**: High-performance object mapping with MapStruct.
- 🛠 **System Health**: Real-time monitoring via Spring Boot Actuator.
- 📝 **Input Validation**: Strict data integrity using Jakarta Validation.

---

## 🛠 Tech Stack

| Component         | Technology               |
| ----------------- | ------------------------ |
| **Framework**     | Spring Boot 3.5.6        |
| **Language**      | Java 17                  |
| **Build Tool**    | Maven                    |
| **Database**      | PostgreSQL               |
| **Security**      | Spring Security + JWT    |
| **Mapping**       | MapStruct + Lombok       |
| **Email**         | Spring Boot Starter Mail |
| **Configuration** | Dotenv (spring-dotenv)   |
| **Monitoring**    | Spring Boot Actuator     |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java JDK 17** or higher
- **Maven 3.x**
- **PostgreSQL 14+**
- **Git**

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HoangQuyCoder/hotel-booking-system.git
cd hotel-booking-system/backend
```

### 2. Database Setup

Create a PostgreSQL database for the project:

```sql
CREATE DATABASE hotel_booking;
```

### 3. Environment Configuration

Create a `.env` file in the root of the backend directory:

```bash
cp .env.example .env
```

Configure your local environment variables in `.env`:

```env
SPRING_PROFILES_ACTIVE=dev

DB_URL_LOCAL=jdbc:postgresql://localhost:5432/hotel_booking
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@gmail.com
```

---

## 💻 Development & Production

### Building the Project

```bash
# Using Maven wrapper
./mvnw clean install

# Skipping tests
./mvnw clean install -DskipTests
```

### Running the Application

```bash
# Run with the 'dev' profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Application will be available at http://localhost:8080
```

### Production Build

```bash
# Generate executable JAR
./mvnw clean package -DskipTests

# Run the JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/backend/
│   │   │   ├── common/         # Shared constants and base classes
│   │   │   ├── config/         # App & Security configurations
│   │   │   ├── controller/     # REST Controllers
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── exception/      # Global Exception Handling
│   │   │   ├── mapper/         # MapStruct interfaces
│   │   │   ├── model/          # JPA Entities
│   │   │   ├── repository/     # Data Access Layer
│   │   │   ├── security/       # JWT and Auth logic
│   │   │   ├── service/        # Business Logic layer
│   │   │   ├── specification/  # JPA Criteria Specifications
│   │   │   └── utils/          # Utility classes
│   │   └── resources/
│   │       ├── templates/      # Email templates
│   │       └── application.yml # Core configuration
├── .env.example                # Environment template
├── pom.xml                     # Maven dependencies
└── Dockerfile                  # Container definition
```

---

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run a specific test
./mvnw test -Dtest=ClassName
```

---

## 🐳 Docker (Optional)

If you prefer to run with Docker:

```bash
# Build the image
docker build -t hotel-booking-backend .

# Run the container
docker-compose up -d
```

---

## 🛡️ Best Practices

- **Security**: Password hashing with BCrypt and stateless JWT authentication.
- **Reliability**: Centralized error handling for consistent API responses.
- **Code Quality**: Using MapStruct for clean entity-DTO conversions and Lombok to reduce boilerplate.
- **Scalability**: Specification-based filtering for complex data searches.

---

## ✉️ Contact

**Hoang Quy** - [hoangquyle11@gmail.com](mailto:hoangquyle11@gmail.com)

Project Link: [https://github.com/HoangQuyCoder/hotel-booking-system](https://github.com/HoangQuyCoder/hotel-booking-system)
