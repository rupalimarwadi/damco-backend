This project implements a secure REST API for user management along with a log analyzer to detect suspicious login activity.

## It covers:

Secure user registration and authentication
JWT-based authentication
Logging system for login attempts
Detection of suspicious IPs based on failed login attempts

---

## Tech Stack

Node.js
Express.js
MongoDB
Mongoose
JWT (Authentication)
bcrypt (Password hashing)

---

## Project Structure

project/
│── controllers/
│── routes/
│── models/
│── middleware/
│── validators/
│── utils/
│── logs/
│── tests/
│── server.js

---

## Features

## User APIs

`POST /api/users` → Create user
`GET /api/users/:id` → Get user details
`POST /api/login` → Login user

## Security

Password hashing using bcrypt
JWT-based authentication
Input validation using express-validator
Unique email enforcement

## Logging System

Logs login attempts (SUCCESS / FAILED)
Stores logs in date-wise files

## Log Analyzer

Detects IPs with more than 5 failed attempts within 10 minutes

## Alerts API

`GET /api/alerts` → Returns suspicious IPs

---

## Setup Instructions

## 1. Install dependencies

```
npm install
```

### 2. Create `.env`

```
PORT=3000 
JWT_SECRET=your_secret
MONGO_URI=your_mongodb_connection
```

### 3. Run server

```
npm run dev
```

---

## API Endpoints

## Create User

```
POST /api/users
```

### Login

```
POST /api/login
```

### Get User

```
GET /api/users/:id
```

### Alerts

```
GET /api/alerts
```

---

## Log Analyzer Logic

Uses sliding window technique
Tracks failed login attempts per IP
Flags IP if attempts > 5 within 10 minutes

---

## Security Best Practices Implemented

Passwords stored using salted hashing (bcrypt)
JWT authentication for protected routes
Input validation to prevent malformed data
Unique constraints to prevent duplicate users
Logging and monitoring of failed login attempts
Protection against common attacks like brute force

---

## Testing

Jest + Supertest used for API testing
MongoDB Memory Server for isolated testing

---

## Future Improvements

Rate limiting to block suspicious IPs
Centralized logging system (Winston)

---

## Author
Rupali Marwadi
