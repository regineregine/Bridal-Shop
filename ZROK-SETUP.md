# Zrok Integration Setup for Bridal Shop Ecommerce

This guide will help you set up zrok tunneling for your Laravel + React ecommerce website.

## Prerequisites

- zrok installed and authenticated (run `zrok enable` if not done) - **Only needed for public access**
- Your Laravel backend and React frontend running locally

## Local Development vs Public Access

Your site works **locally by default**. You only need zrok when you want to share your site publicly.

- **Local Development**: Works without zrok (uses localhost:8000 for API)
- **Public Access**: Start zrok tunnels when you want others to access your site

## Domain Configuration

Your zrok domains:
- **Frontend**: https://promiseph.share.zrok.io
- **Backend**: https://promisephbackend.share.zrok.io

## Manual .env Update Required

**Important:** You need to manually update your backend `.env` file:

1. Open `backend/.env`
2. Change `APP_URL=http://localhost:8000` to:
   ```
   APP_URL=https://promisephbackend.share.zrok.io
   ```

## Setup Steps

### 1. Create Zrok Reservations (One-time setup)

Run the setup script to create your reservations:

```batch
setup-zrok.bat
```

This will create two reservations:
- `promisephbackend` for Laravel API (proxies to localhost:8000)
- `promiseph` for React app (proxies to localhost:5173)

### 2. Start Your Local Services

**Terminal 1 - Backend:**
```batch
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```batch
cd frontend
npm run dev
```

### 3. Start Zrok Tunnels

**Important:** Start these tunnels ONLY after your local servers are running!

**Terminal 3 - Backend Tunnel:**
```batch
start-zrok-backend.bat
```

**Terminal 4 - Frontend Tunnel:**
```batch
start-zrok-frontend.bat
```

## Access Your Website

Once all tunnels are running, access your ecommerce site at:

**https://promiseph.share.zrok.io**

## How It Works

### Local Development Mode (Default)
- **Frontend (React)**: Runs on localhost:5173
- **Backend (Laravel)**: Runs on localhost:8000
- **Proxy Configuration**: Frontend proxies `/api` and `/storage` requests to localhost:8000
- **Access**: Visit http://localhost:5173

### Public Access Mode (With Zrok)
- **Frontend (React)**: Served through zrok tunnel on port 5173
- **Backend (Laravel)**: API served through zrok tunnel on port 8000
- **Proxy Configuration**: When zrok tunnels are running, frontend automatically proxies to zrok backend URL
- **Access**: Visit https://promiseph.share.zrok.io

## Troubleshooting

### If tunnels fail to start:
1. Make sure your local services are running (backend on port 8000, frontend on port 5173)
2. Check that zrok reservations exist: `zrok overview`
3. Try recreating reservations: `setup-zrok.bat`

### If API calls fail:
1. Verify backend `.env` has correct `APP_URL`
2. Check that backend tunnel is running
3. Ensure frontend proxy is configured correctly (already done in `vite.config.js`)

### If images/storage don't load:
1. Check that storage link is created: `php artisan storage:link`
2. Verify backend tunnel includes storage routes

### If you see a folder listing instead of the website:
1. Make sure your local servers are running before starting tunnels
2. The reservations are configured to proxy directly to localhost ports
3. Frontend reservation → localhost:5173 (Vite dev server)
4. Backend reservation → localhost:8000 (Laravel server)
5. If issues persist, try recreating reservations with `setup-zrok.bat`

## File Changes Made

- ✅ Updated `frontend/vite.config.js` - Configured for local development (localhost:8000) with zrok support
- ✅ Recreated zrok reservations with correct localhost targets (proxy mode instead of web mode)
- ✅ Renamed frontend reservation from 'promisephfrontend' to 'promiseph' as requested
- ✅ Updated batch scripts and documentation to reflect new naming
- ❌ Manual update required: `backend/.env` APP_URL setting

## Security Notes

- zrok reservations are public by default
- Consider using private shares for production
- Add authentication if needed for admin access