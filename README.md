# 🚀 Myraid Internship Assignment

A full-stack task management application built using the MERN stack. Users can register, log in, and manage tasks with authentication and a clean dashboard UI.

---

## 📌 Features

* 🔐 User Authentication (JWT + HTTP-only Cookies)
* ✅ Create, Update, Delete Tasks
* 📊 Task Statistics Dashboard
* 🔍 Search & Filter Tasks
* 🍪 Secure Cookie-Based Authentication
* 🌐 Fully Deployed (Frontend + Backend)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cookie Parser

---

## 🌍 Live Demo

* 🔗 **Frontend:** https://myraid-internship-assignment.vercel.app
* 🔗 **Backend:** https://myraid-internship-assignment.onrender.com

---

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── env
│   └── index.js
│
├── frontend/
│   ├── src/
│   └── api/
│   └── components/
│   └── pages/
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in backend:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/Harsh266/Myraid_Internship_Assignment.git
cd Myraid_Internship_Assignment
```

---

### 2️⃣ Install dependencies

#### Backend

```
cd backend
npm install
```

#### Frontend

```
cd frontend
npm install
```

---

### 3️⃣ Run the project

#### Start backend

```
npm run dev
```

#### Start frontend

```
npm run dev
```

---

## 🔐 Authentication Flow

1. User logs in
2. JWT token is generated
3. Token stored in HTTP-only cookies
4. Protected routes verify token via middleware

---

## 🧪 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/me`

### Tasks

* GET `/api/tasks`
* POST `/api/tasks`
* PUT `/api/tasks/:id`
* DELETE `/api/tasks/:id`
* GET `/api/tasks/stats`

---
## 👨‍💻 Author

**Harsh Vekriya**

