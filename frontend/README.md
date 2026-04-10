# Hotel Booking System - Frontend

[![Node.js Version](https://img.shields.io/badge/Node.js-20%2B-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)
[![Vite Version](https://img.shields.io/badge/Vite-7.x-646CFF)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, high-performance web interface for the Hotel Booking System. Built with **React 19**, **TypeScript**, and **Vite**, featuring a responsive design powered by **Tailwind CSS**.

---

## 🚀 Overview

The frontend serves as the primary gateway for users and administrators, offering a seamless booking experience and a robust management dashboard.

### Core Features

- 🏨 **Hotel Management**: Browse, search, and filter hotels with ease.
- 📅 **Real-time Booking**: Integrated booking system with date range selection.
- 👤 **User Dashboard**: Manage profiles, view booking history, and track status.
- 🛡️ **Admin Portal**: Comprehensive dashboard for managing hotels, rooms, and transactions.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- ⚡ **Optimized Performance**: Lightning-fast builds and runtime using Vite 7.
- 🔒 **Secure Auth**: JWT-based authentication with protected route handling.

---

## 🛠 Tech Stack

| Category             | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | React 19                 |
| **Build Tool**       | Vite 7                   |
| **Language**         | TypeScript 5             |
| **Styling**          | Tailwind CSS + Shadcn/UI |
| **State Management** | Zustand + React Context  |
| **Data Fetching**    | TanStack Query (v5)      |
| **HTTP Client**      | Axios                    |
| **Routing**          | React Router 7           |
| **Form Handling**    | React Hook Form + Yup    |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: `v20.0.0` or higher (Recommended: LTS)
- **npm**: `v10.0.0` or higher
- **Git**: `v2.40+`

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HoangQuyCoder/hotel-booking-system.git
cd hotel-booking-system/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root of the frontend directory:

```bash
cp .env.example .env
```

Target the following variables in your `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT=30000
```

---

## 💻 Development & Production

### Available Scripts

| Script            | Description                                            |
| :---------------- | :----------------------------------------------------- |
| `npm run dev`     | Starts the development server with HMR.                |
| `npm run build`   | Compiles and optimizes the application for production. |
| `npm run lint`    | Runs ESLint to find and fix code style issues.         |
| `npm run preview` | Previews the production build locally.                 |

### Development workflow

```bash
# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### Production Build

```bash
# Generate optimized assets
npm run build

# The output will be in the /dist folder
```

---

## 📂 Project Structure

```text
frontend/
├── public/              # Static assets (fonts, icons, etc.)
├── src/
│   ├── api/             # API client configurations
│   ├── assets/          # Images and global styles
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Main application pages
│   ├── router/          # Routing configuration
│   ├── services/        # Business logic & API services
│   ├── types/           # TypeScript definitions
│   └── utils/           # Helper functions
├── .env.example         # Environment template
├── index.html           # Main entry point
└── tailwind.config.js   # Style configuration
```

---

## 🌐 Deployment

This project is configured for easy deployment on **Vercel** or **Netlify**.

### Deploying to Vercel

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add **Environment Variables** from your `.env` file.
5. Click **Deploy**.

---

## 🛡️ Best Practices

- **Component Design**: Modular, reusable components following atomic design principles.
- **Type Safety**: Strictly typed components and API responses.
- **Performance**: Image optimization, code splitting, and efficient re-renders.
- **Accessibility**: Semantic HTML and ARIA labels where necessary.

---

## ✉️ Contact

**Hoang Quy** - [hoangquyle11@gmail.com](mailto:hoangquyle11@gmail.com)

Project Link: [https://github.com/HoangQuyCoder/hotel-booking-system](https://github.com/HoangQuyCoder/hotel-booking-system)
