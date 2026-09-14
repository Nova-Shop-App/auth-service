# auth-service

Authentication microservice for the **Nova-Shop-App** e-commerce platform. Built with Node.js, Express, and Sequelize, it handles user registration, login, JWT-based verification, and role-protected user management.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [API reference](#api-reference)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running tests](#running-tests)
- [Docker](#docker)
- [CI/CD](#cicd)

---

## Features

- User registration with hashed passwords
- JWT-based login and token verification
- Role-based access control (`USER` / `ADMIN`)
- Full user CRUD (admin-protected)
- Sequelize ORM with MySQL or PostgreSQL support
- Dockerized for container deployments
- Jest + Supertest integration tests with JUnit reporting
- SonarQube code quality analysis

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 (ES modules) |
| Framework | Express 5 |
| ORM | Sequelize 6 |
| Database | MySQL 2 / PostgreSQL (pg) |
| Auth | jsonwebtoken, crypto-js |
| Testing | Jest 30, Supertest, Babel |
| DevOps | Docker, Jenkins, SonarQube |

---

## Project structure

```
auth-service/
├── index.js                  # App entry point
├── Controllers/
│   ├── auth.controllers.js   # Register, login, verify
│   └── user.controllers.js   # User CRUD
├── routes/
│   ├── auth.route.js         # Public auth endpoints
│   └── user.route.js         # Protected user endpoints
├── middlewares/
│   ├── authentication.js     # JWT validation
│   └── authorization.js      # Role enforcement
├── models/
│   └── users.model.js        # Sequelize User model
├── config/
│   └── database.js           # Sequelize instance
├── utils/
│   ├── handlePassword.js     # Hash / verify password
│   ├── handleToken.js        # Generate / verify JWT
│   └── constant.js           # Shared response shapes
├── test/                     # Jest test suites
├── Dockerfile
├── Jenkinsfile
├── babel.config.json
├── jest.config.js
└── sonar-project.properties
```

---

## API reference

### Auth (public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create a new user account |
| `POST` | `/login` | Authenticate and receive a JWT |
| `GET` | `/verify` | Verify a JWT (`x-auth-token` header) |

#### POST /register

**Request body**

```json
{
  "username": "jdoe",
  "full_name": "John Doe",
  "email": "jdoe@example.com",
  "phone_number": "+1234567890",
  "password": "secret"
}
```

**Response `201`**

```json
{
  "user": { "id": 1, "username": "jdoe", ... },
  "token": "<jwt>"
}
```

#### POST /login

**Request body**

```json
{
  "email": "jdoe@example.com",
  "password": "secret"
}
```

**Response `201`**

```json
{
  "user": { "id": 1, "username": "jdoe", "role": "USER" },
  "token": "<jwt>"
}
```

#### GET /verify

**Headers**

```
x-auth-token: <jwt>
```

**Response `200`**

```json
{
  "id": 1,
  "username": "jdoe",
  "email": "jdoe@example.com",
  "role": "USER"
}
```

---

### Users (protected — requires valid JWT + ADMIN role)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List all users |
| `GET` | `/:id` | Get a single user |
| `POST` | `/` | Create a user |
| `PUT` | `/:id` | Update a user |
| `DELETE` | `/:id` | Delete a user |

All requests must include:

```
x-auth-token: <jwt>
```

---

## Getting started

### Prerequisites

- Node.js 22+
- MySQL or PostgreSQL instance

### Installation

```bash
git clone https://github.com/Nova-Shop-App/auth-service.git
cd auth-service
npm install
```

### Development

```bash
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon
```

---

## Environment variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=yourpassword

JWT_SECRET=your_jwt_secret
```

---

## Running tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Test results are written in JUnit XML format for CI consumption.

---

## Docker

### Build the image

```bash
docker build -t auth-service .
```

### Run the container

```bash
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=auth_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=yourpassword \
  -e JWT_SECRET=your_jwt_secret \
  auth-service
```

The image is based on `node:22-alpine` and exposes port `3000`.

---

## CI/CD

The `Jenkinsfile` defines the pipeline:

1. **Install** — `npm ci`
2. **Lint** — `npm run lint`
3. **Test** — `npm test` (JUnit report published)
4. **Code quality** — SonarQube analysis via `sonar-project.properties`
5. **Build image** — Docker build
6. **Deploy** — push and deploy to target environment

---

## Author

**Abdelkader Bouchouicha**

## License

ISC
