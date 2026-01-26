# Project Setup Guide

A full-stack application with Laravel backend and React frontend.

## Prerequisites

- **PowerShell** (NOT CMD)
- PHP (7.4 or higher)
- Composer
- Laravel (latest, via Composer)
- Node.js and npm

---

## 🚀 Initial Setup (After Cloning)

### 1. Clone the Repository

Open a PowerShell terminal and run:

```powershell
git clone https://github.com/regineregine/Bridal-Shop.git; cd Bridal-Shop
```

### ⚠️ **Important:** Before running any of the commands below, make sure you are inside the project folder (e.g., `Bridal-Shop`)

### 2. Setup Backend

Inside the same PowerShell terminal, run:

```powershell
cd backend; composer install; cp .env.example .env; 
```

## ⚠️ Database Password Setup

Before running the backend, make sure to update the `DB_PASSWORD` value in `backend/.env` to match your local MySQL or Workbench password. For example:
**DB_PASSWORD=your_mysql_password_here**

If the `DB_PASSWORD` now does match your MySQL password, you can proceed to run the following command:

```powershell
php artisan migrate:fresh --seed; php artisan storage:link; php artisan serve
```

This will:

- Install PHP dependencies
- Create environment configuration file
- Run database migrations and seeders
- Link storage directory
- Start the Laravel development server

### 3. Setup Frontend

Open **another PowerShell terminal** and run:

```powershell
cd frontend; npm ci; npm run dev
```

This will:

- Install Node.js dependencies
- Start the Vite development server

### 4. Access the Application

Open your browser and go to:

**<http://localhost:5173/>**

---

## 🔄 Running the App Again (After Initial Setup)

### Terminal 1 - Backend

```powershell
cd backend
php artisan serve
```

### Terminal 2 - Frontend

```powershell
cd frontend
npm run dev
```

Then visit: **<http://localhost:5173/>**

---

## 🌐 Public Access with Zrok (Optional)

To share your site publicly without exposing your local machine:

1. **Install zrok** and authenticate if you haven't already
2. **Start zrok tunnels** (after your local servers are running):
   ```powershell
   # Terminal 3 - Start zrok tunnels
   start-zrok-frontend.bat
   start-zrok-backend.bat
   ```
3. **Access publicly** at: **https://promiseph.share.zrok.io**

Your site works locally by default. Only start zrok tunnels when you need public access.

---

## 📦 Production Preview

To see the optimized production version:

```powershell
cd frontend
npm run build
npm run preview
```

Then visit: **<http://localhost:4173/>**

⚠️ **Note:** In preview mode, code changes won't reflect in real-time. To see changes, use development mode (`npm run dev`).

---

## 🔧 Development vs Production

| Mode               | Command                            | URL                      | Hot Reload |
| ------------------ | ---------------------------------- | ------------------------ | ---------- |
| Development        | `npm run dev`                      | <http://localhost:5173/> | ✅ Yes      |
| Production Preview | `npm run build && npm run preview` | <http://localhost:4173/> | ❌ No       |

---

## 📝 Important Notes

- Keep both backend and frontend terminals running simultaneously
- Backend runs on port 8000 (Laravel)
- Frontend runs on port 5173 (Vite dev) or 4173 (Vite preview)
- Ensure database credentials in `backend/.env` are correct
