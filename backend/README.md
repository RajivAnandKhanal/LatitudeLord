# Backend

Backend service for the Latitude Lord project.

## Technologies
- Node.js
- Express.js

## Features
- Authentication
- API routes
- Database connection

## Project Structure
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
├── server.js
└── package.json


The project follows a modular architecture where routes handle incoming requests, controllers implement business logic, models define the database schema, and middleware manages request processing.

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

## Environment Variables

Create a `.env` file.

Example:

```env
PORT=5000
DATABASE_URL=<database-url>
JWT_SECRET=<secret-key>
```

Store sensitive information in environment variables instead of hardcoding them.