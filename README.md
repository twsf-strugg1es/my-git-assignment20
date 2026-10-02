# Blog Management System — Backend API

A complete, production-style REST API for a Blog Management System built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

## ✨ Features

- 🔐 JWT authentication with HTTP-only cookies
- 👤 User registration, login, profile, and profile update
- 📝 Full blog CRUD (create, read, update, delete)
- 🖼️ Blog image upload (multipart/form-data with multer)
- 🛡️ Protected blog routes — only logged-in users can access
- 👮 Ownership check — only the blog creator can edit/delete their blog
- 📂 Clean MVC folder structure
- ⚠️ Centralized error handling

## 📁 Folder Structure

```
my-git-assignment20/
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── uploads/                 # uploaded images (auto-created)
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── userController.js
    │   └── blogController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── upload.js
    ├── models/
    │   ├── userModel.js
    │   └── blogModel.js
    ├── routes/
    │   ├── userRoutes.js
    │   └── blogRoutes.js
    └── utils/
        └── token.js
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root (or copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_management
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_IN=7
NODE_ENV=development
```

### 4. Start the server
```bash
# development (auto-restart with nodemon)
npm run dev

# production
npm start
```

Server will run on `http://localhost:5000`.

---

## 📚 API Endpoints

### User Authentication

| Method | Endpoint           | Access  | Description                         |
| ------ | ------------------ | ------- | ----------------------------------- |
| POST   | `/api/users/register` | Public  | Register a new user                 |
| POST   | `/api/users/login`    | Public  | Log in and get JWT + cookie         |
| POST   | `/api/users/logout`   | Private | Log out (clears cookie)             |
| GET    | `/api/users/me`       | Private | Get current logged-in user profile  |
| PATCH  | `/api/users/me`       | Private | Update profile (name, phoneNumber)  |

#### Register — `POST /api/users/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phoneNumber": "+1234567890"
}
```

#### Login — `POST /api/users/login`
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```
Response sets HTTP-only cookie `token` and returns a JWT in body.

For protected routes, send the token as:
- `Authorization: Bearer <token>` header, **or**
- cookie (automatic when using a browser)

---

### Blog Management (all protected)

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/api/blogs`     | Create a new blog (image optional)   |
| GET    | `/api/blogs`     | Get all blogs                        |
| GET    | `/api/blogs/:id` | Get a single blog by ID              |
| PATCH  | `/api/blogs/:id` | Update a blog (only creator)         |
| DELETE | `/api/blogs/:id` | Delete a blog (only creator)         |

#### Create Blog — `POST /api/blogs`
Use `multipart/form-data`:
- `title` (string, required)
- `content` (string, required)
- `authorName` (string, required)
- `tags` (string — comma separated, optional)
- `blogImage` (file — optional)

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer <token>" \
  -F "title=My First Blog" \
  -F "content=Hello world!" \
  -F "authorName=John Doe" \
  -F "tags=node,express,mongodb" \
  -F "blogImage=@/path/to/image.jpg"
```

---

## 🛡️ Security Notes

- Passwords are hashed with **bcryptjs** before storage.
- JWTs are signed with `JWT_SECRET` and verified on every protected request.
- Cookies are `httpOnly` and `secure` in production.
- Ownership is enforced server-side — users cannot edit/delete others' blogs.

## 🧪 Quick Test with cURL

```bash
# 1. Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"alice12345","phoneNumber":"111"}'

# 2. Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"alice12345"}'

# 3. Create blog (use token from step 2)
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer <TOKEN>" \
  -F "title=Hello" -F "content=World" -F "authorName=Alice"

# 4. List blogs
curl http://localhost:5000/api/blogs -H "Authorization: Bearer <TOKEN>"
```

## 📜 License

ISC
