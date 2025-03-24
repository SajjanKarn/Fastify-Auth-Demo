# Fastify Auth Demo

A demonstration project showcasing JWT authentication implementation with the Fastify framework. This project provides a complete authentication flow with user registration, login, and protected routes.

![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## Features

- 🔑 JWT-based authentication
- 📝 User registration and login
- 🔒 Protected route implementation
- 📚 API documentation with Swagger
- 🗄️ MongoDB integration
- 🔄 TypeScript for type safety
- 🛡️ Security with `@fastify/helmet`
- ⚡ Response compression with `@fastify/compress`
- ❌ Rate Limit using `@fastify/rate-limit`

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16 or higher)
- MongoDB (local instance or Atlas)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/SajjanKarn/Fastify-Auth-Demo.git
cd Fastify-Auth-Demo
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fastify-auth
JWT_SECRET=your_very_secure_jwt_secret
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with hot-reloading using `nodemon`.

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/documentation
```

## API Endpoints

### Protected Routes

- **GET /api/auth/protected** - Example protected route (requires authentication)
  - Header: `Authorization: Bearer <your_jwt_token>`

## Project Structure

```
.
├── src/
│   ├── config/
│   ├── db/
│   ├── models/
│   │   ├── Post.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── auth/
│   │   │   ├── _schema/
│   │   │   │   └── auth.ts
│   │   │   └── auth.ts
│   │   ├── post/
│   │   │   ├── _schema/
│   │   │   │   └── postSchema.ts
│   │   │   └── post.ts
│   │   └── index.ts
├── .env
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
├── README.md
└── yarn.lock
```

## Technologies Used

- **Fastify**: High-performance web framework
- **TypeScript**: For type safety and better developer experience
- **MongoDB**: NoSQL database for storing user data
- **@fastify/jwt**: JWT authentication plugin for Fastify
- **@fastify/mongodb**: MongoDB plugin for Fastify
- **@fastify/swagger**: API documentation generation
- **@fastify/helmet**: Security headers
- **@fastify/compress**: Response compression
- **bcrypt**: Password hashing
- **@fastify/rate-limit**: Rate limiting for requests

## Contact

Sajjan Karn - [@SajjanKarn](https://github.com/SajjanKarn)

Project Link: [https://github.com/SajjanKarn/Fastify-Auth-Demo](https://github.com/SajjanKarn/Fastify-Auth-Demo)
