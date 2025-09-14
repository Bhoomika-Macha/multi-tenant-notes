# 📝 Multi-Tenant SaaS Notes Application

## 🚀 Overview
A multi-tenant SaaS Notes Application built with **Node.js, Express, PostgreSQL, and React**.  
Each tenant (company) can securely manage its users and notes with strict data isolation, role-based access control, and subscription plans (Free vs Pro).  

---

## ✨ Features
- 🔑 **JWT Authentication** (Admin & Member roles)
- 🏢 **Multi-Tenant Isolation** (Acme & Globex supported by default)
- 📒 **Notes CRUD** (Create, Read, Update, Delete notes per tenant)
- 📊 **Subscription Plans**
  - Free: max 3 notes per tenant
  - Pro: unlimited notes
- ⚡ **Admin Actions**
  - Upgrade tenant subscription
  - Invite/manage users
- 🌐 **Frontend**
  - Login with test accounts
  - Manage notes
  - “Upgrade to Pro” UI after Free plan limit
- ✅ Health Check: `GET /health → { "status": "ok" }`

---

## 🧪 Test Accounts
All accounts use **password: `password`**

- `admin@acme.test` → Admin (Tenant: Acme)
- `user@acme.test` → Member (Tenant: Acme)
- `admin@globex.test` → Admin (Tenant: Globex)
- `user@globex.test` → Member (Tenant: Globex)

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React, Axios
- **Auth:** JWT, bcrypt
- **Deployment:** Vercel

---

## ⚡ API Endpoints
### Auth
- `POST /auth/login` → Login

### Notes
- `POST /notes` → Create note
- `GET /notes` → Get all notes for tenant
- `GET /notes/:id` → Get single note
- `PUT /notes/:id` → Update note
- `DELETE /notes/:id` → Delete note

### Tenants
- `POST /tenants/:slug/upgrade` → Upgrade to Pro (Admin only)

### Health
- `GET /health` → `{ "status": "ok" }`

---

## 🚀 Deployment
- **Frontend:** Vercel  
- **Backend:** Vercel (with PostgreSQL)  
- Enable **CORS** for cross-origin API calls.

---

## 📌 How to Run Locally
1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd multi-tenant-notes

2. Start backend:
    ```bash
    cd backend
    npm install
    npm run dev


3. Start frontend:
    ```bash
    cd frontend
    npm install
    npm start

🏆 Evaluation Coverage

**Health endpoint working**

**Multi-tenant isolation**

**Role-based restrictions**

**Free plan limit (3 notes) & Pro upgrade**

**CRUD endpoints tested**

**Frontend integrated**
