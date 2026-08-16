# Notely

Notely is a note and post management application with authentication, user management, notes, and posts.

## Getting Started

Follow the steps below to run the project locally.

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project directory

```bash
cd notely
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory and add the required environment variables.

```env
# Add your environment variables here
```

> Make sure all required environment variables are properly configured before starting the application.

### 5. Start the development server

```bash
npm run dev
```

The application should now be running in development mode.

---

## API Endpoints

All API endpoints are prefixed with:

```text
/api/v1
```

### Authentication

| Method | Endpoint                             | Description                        |
| ------ | ------------------------------------ | ---------------------------------- |
| `POST` | `/api/v1/auth/register`              | Register a new user                |
| `POST` | `/api/v1/auth/login`                 | Log in a user                      |
| `POST` | `/api/v1/auth/refresh-token`         | Refresh an access token            |
| `POST` | `/api/v1/auth/change-password`       | Change the current user's password |
| `POST` | `/api/v1/auth/forget-password`       | Request a password reset           |
| `POST` | `/api/v1/auth/reset-password/:token` | Reset password using a reset token |

### User

| Method   | Endpoint                       | Description                          |
| -------- | ------------------------------ | ------------------------------------ |
| `GET`    | `/api/v1/user/all`             | Get all users                        |
| `GET`    | `/api/v1/user/interests-group` | Get users grouped by interests       |
| `GET`    | `/api/v1/user/:id/posts`       | Get posts created by a specific user |
| `GET`    | `/api/v1/user/:slug`           | Get a user by slug                   |
| `POST`   | `/api/v1/user/create`          | Create a user                        |
| `PATCH`  | `/api/v1/user/update/:id`      | Update a user                        |
| `DELETE` | `/api/v1/user/delete/:id`      | Delete a user                        |

### Note

| Method   | Endpoint                  | Description        |
| -------- | ------------------------- | ------------------ |
| `POST`   | `/api/v1/note/create`     | Create a note      |
| `GET`    | `/api/v1/note/all`        | Get all notes      |
| `GET`    | `/api/v1/note/:slug`      | Get a note by slug |
| `PATCH`  | `/api/v1/note/update/:id` | Update a note      |
| `DELETE` | `/api/v1/note/delete/:id` | Delete a note      |

### Post

| Method   | Endpoint                  | Description        |
| -------- | ------------------------- | ------------------ |
| `POST`   | `/api/v1/post/create`     | Create a post      |
| `GET`    | `/api/v1/post/all`        | Get all posts      |
| `GET`    | `/api/v1/post/:slug`      | Get a post by slug |
| `PATCH`  | `/api/v1/post/update/:id` | Update a post      |
| `DELETE` | `/api/v1/post/delete/:id` | Delete a post      |
