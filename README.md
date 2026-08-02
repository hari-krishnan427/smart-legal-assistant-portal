# ⚖️ Smart Legal Assistant Portal

A modern, production-ready full-stack application built with **Spring Boot 3**, **React (Vite)**, **MySQL**, and **JWT Authentication**.

---

## 📁 Architecture Overview

```
smart-legal-assistant-portal/
├── backend/                        # Spring Boot 3 + REST API + Security + JPA
│   ├── src/main/java/com/smartlegal/portal/
│   │   ├── config/                 # SecurityConfig, CorsConfig, ApplicationConfig
│   │   ├── security/               # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   ├── common/                 # GlobalExceptionHandler, ApiResponse wrapper
│   │   ├── controller/             # AuthController, HealthController (Skeletons)
│   │   ├── dto/                    # Auth DTOs (LoginRequest, RegisterRequest, AuthResponse)
│   │   ├── entity/                 # User & Role JPA entities
│   │   ├── repository/             # UserRepository Spring Data JPA interface
│   │   └── service/                # AuthService & AuthServiceImpl
│   └── src/main/resources/
│       └── application.properties  # Configured with environment variable placeholders
├── frontend/                       # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── assets/                 # CSS Design System & glassmorphism theme
│   │   ├── components/             # Layouts, Header, ProtectedRoute
│   │   ├── context/                # AuthContext & AuthProvider
│   │   ├── hooks/                  # Custom hooks (useAuth, useApi)
│   │   ├── pages/                  # Login, Register, Dashboard, NotFound
│   │   ├── routes/                 # React Router routing system
│   │   ├── services/               # Axios client with JWT interceptor
│   │   ├── types/                  # TypeScript interfaces (User, Auth)
│   │   └── utils/                  # Token storage & constants
│   └── vite.config.ts              # Vite server & proxy configuration
└── README.md
```

---

## 🛠️ Prerequisites & Setup

### 1. MySQL Database Setup
Create the MySQL database before running the backend:

```sql
CREATE DATABASE IF NOT EXISTS smart_legal_db;
```

### 2. Environment Variables Configuration

Copy `.env.example` to `.env` inside `backend/` or configure environment variables:

- `DB_URL` (default: `jdbc:mysql://localhost:3306/smart_legal_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`)
- `DB_USERNAME` (default: `root`)
- `DB_PASSWORD` (default: `root`)
- `JWT_SECRET` (256-bit secret key)
- `JWT_EXPIRATION` (default: `86400000` ms / 24 hours)
- `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)

---

## 🚀 Running the Project

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```
Backend will start at: `http://localhost:8080`
Health check endpoint: `http://localhost:8080/api/v1/health`

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:5173`

---

## 🔒 Security Architecture
- **Stateless JWT Authentication**: Tokens passed via HTTP header `Authorization: Bearer <token>`.
- **CORS Configured**: Spring Security CORS configured for cross-origin requests from the React Vite dev server.
- **Axios Interceptors**: Frontend automatically attaches valid JWT tokens to outbound API calls and handles 401 unauthorized responses cleanly.
