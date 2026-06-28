# TaskFlow — Backend API

REST API for the TaskFlow task management system, built with Express, TypeScript, MongoDB, and JWT authentication.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| MongoDB | 6+ (local or Atlas) |

---

## Installation

```bash
cd backend
npm install
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/taskflow

# JWT
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

# CORS — must match your frontend origin
CORS_ORIGIN=http://localhost:5173

# Seeded admin account (created automatically on first run)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123
SEED_ADMIN_NAME=Administrator
```

> All variables have sensible defaults for local development, but `JWT_SECRET` **must** be changed in production.

---

## Running

### Development (hot reload)

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

---

## Default Admin Credentials

On first startup the server seeds an admin account automatically:

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@123` |

---

## API Reference

Base URL: `http://localhost:5000/api`

Interactive Swagger docs: `http://localhost:5000/api/docs`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register a new user |
| `POST` | `/auth/login` | — | Log in, receive JWT |
| `GET` | `/auth/me` | Bearer | Get current user |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/tasks` | Bearer | List tasks (filterable, sortable) |
| `POST` | `/tasks` | Bearer | Create a task |
| `GET` | `/tasks/:id` | Bearer | Get task by ID |
| `PUT` | `/tasks/:id` | Bearer | Update a task |
| `DELETE` | `/tasks/:id` | Bearer | Delete a task |

**List query parameters:**

| Param | Values | Description |
|---|---|---|
| `status` | `Open`, `In Progress`, `Testing`, `Done` | Filter by status |
| `priority` | `Low`, `Medium`, `High` | Filter by priority |
| `q` | any string | Case-insensitive title search |
| `assignedTo` | user ID | Filter by assignee |
| `sortBy` | `createdAt`, `dueDate`, `priority`, `title` | Sort field |
| `sortDir` | `asc`, `desc` | Sort direction |

### Users (admin only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users` | Bearer (admin) | List all users |

---

## Role-Based Access

| Action | `user` | `admin` |
|---|---|---|
| View own tasks | ✅ | ✅ |
| View all tasks | ❌ | ✅ |
| Create task | ✅ | ✅ |
| Assign to others | ❌ | ✅ |
| Delete own task | ✅ | ✅ |
| Delete any task | ❌ | ✅ |
| List all users | ❌ | ✅ |

---

## Tech Stack

| Package | Purpose |
|---|---|
| Express | HTTP server |
| TypeScript | Type safety |
| Mongoose | MongoDB ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| Zod | Request validation |
| helmet | Security headers |
| express-rate-limit | Auth route rate limiting (10 req / 15 min) |
| swagger-ui-express | Interactive API docs |
| cors | Cross-origin resource sharing |

---

## Project Structure

```
src/
├── config/         # DB connection and env config
├── controllers/    # Route handlers
├── dtos/           # Zod validation schemas
├── middleware/     # auth, validate, errorHandler
├── models/         # Mongoose schemas
├── repositories/   # Database access layer
├── routes/         # Express routers
├── services/       # Business logic
├── utils/          # Helpers (asyncHandler, HttpError, seedAdmin)
└── server.ts       # App bootstrap
```
