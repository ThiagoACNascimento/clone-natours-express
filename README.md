# Natours API

A RESTful API for a tour booking application, built while following Jonas Schmedtmann's **Node.js, Express, MongoDB & More** course on Udemy.

This project covers the backend layer of a modern Node.js application — data modeling, REST architecture, authentication, authorization, and security.

---

## About the Project

Natours is a fictional travel company that sells nature tours. This repository contains the API layer only (with some frontend views implemented), covering up to section 12 of the course. The remaining sections were followed without implementation due to breaking changes in older dependencies.

---

## Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Runtime        | Node.js               |
| Framework      | Express.js            |
| Database       | MongoDB with Mongoose |
| Authentication | JWT (JSON Web Tokens) |

---

## Features

### Tours

- List all tours with filtering, sorting, field limiting, and pagination
- Get a single tour with full details and reviews
- Geospatial queries — find tours within a radius or calculate distances
- Aggregation pipeline for stats (average ratings, price, difficulty)

### Users & Authentication

- Sign up and log in with email and password
- JWT-based authentication with HTTP-only cookies
- Password reset
- Role-based access control: `user`, `guide`, `lead-guide`, `admin`

### Reviews

- Users can post, update, and delete reviews on tours
- Average rating auto-calculated on the tour using Mongoose middleware

### Security

- Data sanitization against NoSQL injection and XSS
- Rate limiting on auth routes
- HTTP headers with Helmet
- Parameter pollution prevention

---

## Getting Started

```bash
git clone https://github.com/ThiagoACNascimento/natours.git
cd natours
npm install
npm run dev
```

### Importing sample data

> ⚠️ Before running the import, temporarily comment out the password hashing middleware in `userModel.js` — otherwise bcrypt will hash the already-hashed passwords in the seed file.

```bash
npm run services:data:import
```

Remember to uncomment the middleware afterwards.

## License

Educational use only. Original project concept by Jonas Schmedtmann.
