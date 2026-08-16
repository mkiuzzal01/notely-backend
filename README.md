# Project Name : Notely


# If the project run your locally, follow the steps:
 step_1 : git clone <repository-url>
 Step_2 : cd notely
 Step_3 : npm install
 Step_4 : Create and configure your .env file
 Step_5 : npm run dev

# All API Endpoints:

# Auth:
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/change-password
POST /api/v1/auth/forget-password
POST /api/v1/auth/reset-password/:token

# User:
GET /api/v1/user/all
GET /api/v1/user/interests-group
GET /api/v1/user/:id/posts
GET /api/v1/user/:slug
POST /api/v1/user/create
PATCH /api/v1/user/update/:id
DELETE /api/v1/user/delete/:id

# Note:
POST /api/v1/note/create
GET /api/v1/note/all
GET /api/v1/note/:slug
PATCH /api/v1/note/update/:id
DELETE /api/v1/note/delete/:id

# Post:
POST /api/v1/post/create
GET /api/v1/post/all
GET /api/v1/post/:slug
PATCH /api/v1/post/update/:id
DELETE /api/v1/post/delete/:id