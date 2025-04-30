🧠 Task Management Backend
A Node.js + Express + MongoDB backend for managing tasks, including support for recurring tasks, user roles, and authentication.

📁 Project Structure


    app/
        ├── index.ts               # Entry point
        ├── configuration/         # Environment & DB config
        ├── controllers/           # Route handlers
        ├── middleware/            # Authentication, role checks, error handling
        ├── models/                # Mongoose schemas
        ├── routes/                # Express routes
        ├── service/               # Business logic
        ├── utils/                 # Utility functions (e.g., file uploads)
        ├── validator/             # Request validation
        .env.example               # Environment variable template

Edit the file to match your environment



🚀 Getting Started
1. Install dependencies

        pnpm install
        # or
        npm install

2. Run the server

        pnpm dev
        # or
        npm run dev

    The server will start on the port defined in .env (PORT=3500 by default).

🔐 Authentication
        Users authenticate using JWT.

        Middleware checks user roles (admin, user) via checkRolesMiddleware.


🧠 Core Features
        🔒 JWT Authentication & Role-based Access

        ✅ Task CRUD (Create, Read, Update)

        🔁 Support for Recurring Tasks (daily, weekly, monthly)

        📅 Pagination for task lists

        🔍 Filter by status or due date

        📊 Admin Dashboard Stats



🧪 Sample Endpoints


| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| POST   | `/api/task/`           | Create new task                       |
| PUT    | `/api/task/`           | Update a task                         |
| GET    | `/api/task/?id=...`    | Get task by ID                        |
| POST   | `/api/task/search`     | Get paginated tasks                   |
| GET    | `/api/task/recurring`  | Get recurring tasks (with optional `?upcoming=true`) |
| GET    | `/api/task/dashboard`  | Get dashboard stats (admin only)      |

🌱 Seeding the Database
        This project includes a seed script that helps populate your MongoDB database with initial test data. It creates:

        👤 3 users (including 1 admin)

        ✅ 10 sample tasks (some recurring)

🧪 Seed Users

        | Name        | Email             | Role   | Password           |
        |-------------|------------------|--------|--------------------|
        | Admin User  | admin@example.com | admin  | `securepassword123` |
        | John Doe    | john@example.com  | user   | `securepassword123` |
        | Jane Smith  | jane@example.com  | user   | `securepassword123` | 

Run the seed script
  
        pnpm seed
        # or
        npm run seed


🛠 Tech Stack
        Node.js

        Express.js

        MongoDB & Mongoose

        TypeScript

        JWT Authentication

