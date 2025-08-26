# Task Management Application

A full-stack task management application built with React, Node.js, Express, and PostgreSQL.

## Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** or **yarn**

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE tasksdb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Backend Setup

1. Navigate to the backend folder:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm run dev
    ```

## Frontend Setup

1. Navigate to the frontend folder:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend application:
    ```sh
    npm start
    ```
4. Open the application in your browser:
    - [http://localhost:3000](http://localhost:3000)

## Testing

### Frontend Tests
Run frontend tests using Jest and React Testing Library:
```sh
cd frontend && npm test
```
- Main test file: `App.test.tsx`

### Backend Tests
- API endpoints can be tested using **Postman** or similar tools.
- Ensure database connection is properly configured.
- Test authentication using valid JWT tokens.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Tasks
- `GET /tasks` - Get all tasks (requires authentication)
- `POST /tasks` - Create a new task (requires authentication)
- `PUT /tasks/:id` - Update a task (requires authentication)
- `DELETE /tasks/:id` - Delete a task (requires authentication)

## Tech Stack

- **Frontend:** React, TypeScript, Bootstrap
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT

## Short Video Demo
Check [Demo Video](https://youtu.be/SwHZSdhL2-w) for a quick walkthrough.

## Notes

- Ensure **PostgreSQL** is running before starting the backend.
- JWT token is stored in **localStorage**.
- Frontend uses **protected routes** for authenticated users.
- **Bootstrap** is used for styling.
- Error handling is implemented for API calls.

## Salary Expectations

- **Monthly Salary Expectation:** $8,000 - $10,000 USD
