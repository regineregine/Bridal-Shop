# Quick Setup Instructions

## ✅ Completed Steps
1. ✅ Created `.env` file in `backend/` directory
2. ✅ Installed backend dependencies (`composer install`)
3. ✅ Generated Laravel application key

## 🔧 Next Steps (Manual)

### Step 1: Create Database in MySQL/XAMPP

1. Open **phpMyAdmin** (usually at `http://localhost/phpmyadmin`)
2. Click on **"New"** or **"Databases"** tab
3. Create a new database named: `bridal_shop`
4. Set collation to: `utf8mb4_unicode_ci` (or leave default)
5. Click **"Create"**

### Step 2: Update Database Password in `.env`

1. Open `backend/.env` file in a text editor
2. Find the line: `DB_PASSWORD=`
3. Add your MySQL password. For example:
   - If your MySQL password is `mypassword123`, change it to: `DB_PASSWORD=mypassword123`
   - If you have no password (default XAMPP), leave it as: `DB_PASSWORD=`
4. Save the file

### Step 3: Run Database Migrations

After updating the password, run these commands in PowerShell:

```powershell
cd F:\XAMPP\htdocs\Bridal-Shop\backend
php artisan migrate:fresh --seed
php artisan storage:link
```

### Step 4: Install Frontend Dependencies

Open a **new PowerShell terminal** and run:

```powershell
cd F:\XAMPP\htdocs\Bridal-Shop\frontend
npm install
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```powershell
cd F:\XAMPP\htdocs\Bridal-Shop\backend
php artisan serve
```

**Terminal 2 - Frontend:**
```powershell
cd F:\XAMPP\htdocs\Bridal-Shop\frontend
npm run dev
```

### Step 6: Access the Application

Open your browser and go to: **http://localhost:5173/**

---

## 📝 Notes

- Backend runs on: `http://localhost:8000`
- Frontend runs on: `http://localhost:5173`
- Keep both terminals running simultaneously
- If you encounter database connection errors, double-check your `DB_PASSWORD` in `backend/.env`

