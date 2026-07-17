# Insurance Policy Management System

A full-stack Insurance Policy Management System built using the MERN stack. The application provides secure role-based access for Admins and Agents to manage customers, insurance policies, and agent accounts while enforcing business rules and protecting sensitive customer information through PII masking.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Cookie Parser

### Testing
- Jest

---

## Features

### Authentication
- Cookie-based authentication
- 15-minute session expiry
- Secure logout
- Role-based authorization

### Admin
- Login
- Create Agent
- View paginated Agents
- Filter Active / Inactive Agents
- Activate / Deactivate Agents
- View Agent summary

### Agent
- Login
- Search Customers
- Create Customer
- Edit Customer
- Issue Policy
- View Policies
- Dashboard Statistics

### Business Rules
- Customer age between 18–65 years
- PAN mandatory when premium exceeds ₹50,000
- Nominee cannot be the same as the policyholder
- Aadhaar and PAN uniqueness validation
- Policy start date validation
- Premium validation
- Policy term validation
- Premium frequency validation
- Agent ownership isolation
- PII masking for Aadhaar, PAN and Mobile Number

---

# Installation

## Prerequisites

- Node.js 18+
- MongoDB Atlas or Local MongoDB

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with:

- MONGODB_URI
- JWT_SECRET

Seed the Admin account:

```bash
npm run seed
```

Start Backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Set

```
VITE_API_URL=http://localhost:5000/api
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Running Tests

```bash
cd backend
npm test
```

Coverage

```bash
npm run test:coverage
```

---

# Environment Variables

### Backend

```
MONGODB_URI=
JWT_SECRET=
NODE_ENV=
FRONTEND_URL=
```

### Frontend

```
VITE_API_URL=
```

---

# Deployment

## Backend (Render)

Configure:

- MONGODB_URI
- JWT_SECRET
- FRONTEND_URL
- NODE_ENV=production

---

## Frontend (Vercel)

Configure:

```
VITE_API_URL=https://<backend-url>/api
```

---

# Default Admin Credentials

After running the seed script:

```
Email:
admin@insurance.com

Password:
Admin@123
```
# Dummy Agent Credentials

```
Email:
john@gmail.com

Password:
John123
```
---

# Project Structure

```
backend/
frontend/
```

---

# Author

Anushka Sawant
