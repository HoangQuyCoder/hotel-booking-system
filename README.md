# 🏨 Hotel Booking System

A full-stack web application that allows users to **search, book, and manage hotel rooms**, built with **Spring Boot (Java)** for the backend and **React + TypeScript (Vite)** for the frontend.

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Installation & Setup](#-installation--setup)
6. [Future Improvements](#-future-improvements)
7. [Author](#-author)

---

## 🧠 Overview

This project demonstrates a **complete hotel booking workflow**, including:

- User registration and authentication (JWT)
- Hotel and room management (Admin)
- Booking creation, update, and cancellation (User)
- Integration between **Spring Boot REST API** and **React frontend**

---

## ✨ Features

### 👥 User

- Register and login
- Browse available hotels and rooms
- Book and cancel rooms

### 🛠 Admin

- Manage hotels and rooms
- View all bookings and users

### 🔒 Security

- JWT-based authentication
- Role-based authorization (USER / ADMIN)

---

## ⚙️ Tech Stack

| Layer           | Technology                                             |
| --------------- | ------------------------------------------------------ |
| **Frontend**    | React + TypeScript + Vite + Axios + React Router       |
| **Backend**     | Spring Boot 3.x, Spring Data JPA, Spring Security, JWT |
| **Database**    | MySQL (H2 for development)                             |
| **Build Tools** | Maven (backend), npm (frontend)                        |
| **Language**    | Java 17, TypeScript                                    |
| **Tools**       | IntelliJ IDEA, VS Code, Postman                        |

---

## 📂 Project Structure

```
hotel-booking-system/
│
├── backend/
│   ├── src/main/java/com/example/hotelbooking/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   └── exception/
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🛠 Installation & Setup

### 🔹 1. Clone the repository

```bash
git clone https://github.com/HoangQuyCoder/hotel-booking-system.git
cd hotel-booking-system
```

---

### 🔹 2. Backend setup (Spring Boot)

```bash
cd backend
```

#### Update configuration in `src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=your-secret-key
app.jwt.expiration=3600000

# CORS
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
```

#### Run backend

```bash
mvn spring-boot:run
```

Backend runs on **http://localhost:8081**

---

### 🔹 3. Frontend setup (React + Vite + TypeScript)

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

### 🔹 4. Test connection

When backend and frontend are both running:

- Register or log in via frontend
- Open Developer Tools → Network tab to confirm API calls to `http://localhost:8081/api/v1/...`

---

## 🚀 Future Improvements

- Add search and filter options (price, rating, location)
- Payment gateway integration
- Admin dashboard with statistics
- Unit & integration tests
- Docker setup for easy deployment

---

## 👨‍💻 Author

**Lê Hoàng Quý**  
🎯 Aspiring Java Backend Developer | Focused on Spring Boot, Microservices & REST APIs  
📧 hoangquyle11@gmail.com  
🌐 [LinkedIn](www.linkedin.com/in/lê-hoàng-quý-762ba3389)

---

## 🏁 Run Summary

| Service                     | Port   | Command               |
| --------------------------- | ------ | --------------------- |
| **Backend (Spring Boot)**   | `8081` | `mvn spring-boot:run` |
| **Frontend (React + Vite)** | `5173` | `npm run dev`         |

---
