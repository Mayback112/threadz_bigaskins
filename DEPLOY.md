# Quick Deployment Guide

## 🎯 Problem Fixed

**OAuth callback was returning 404 error** - Now fixed with server configuration!

---

## 🚀 Deploy to Production (3 Simple Steps)

### Step 1: Build the Application
```bash
npm run build
```

### Step 2: Upload to Server
Upload the entire `dist/` folder to your web server root at `https://threadzbigaskins.com`

**What gets uploaded:**
- `dist/index.html` - Main app file
- `dist/assets/` - JavaScript, CSS, images
- `dist/.htaccess` - Server configuration (fixes OAuth callback)
- `dist/_redirects` - Backup routing configuration

### Step 3: Test It Works
1. Visit: `https://threadzbigaskins.com`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. ✅ Should redirect back and log you in successfully!

---

## 🔧 Environment Variables

**Using single `.env` file for all environments:**

```env
VITE_API_BASE_URL=https://modix-market-2f56bf35c2c9.herokuapp.com
```

✅ Same file works for development and production
✅ Committed to repository (no secrets here)
✅ No need for separate environment files

---

## ✅ What Was Fixed

**Before:** Server returned 404 for `/oauth2/callback`  
**After:** Server routes all requests to `index.html` (React Router handles routing)

**Key file:** `dist/.htaccess` - tells Apache/LiteSpeed to serve the React app for all routes

---

## 🐛 Troubleshooting

### OAuth Still Shows 404
- Verify `.htaccess` is in the root of your website
- Contact hosting support to enable `mod_rewrite`
- Ensure `.htaccess` files are allowed on server

### Can't See .htaccess File
- It's a hidden file (starts with dot)
- Use FTP/SSH to verify it's uploaded
- Check file permissions (should be 644)

### Backend Connection Issues
Contact backend team to ensure:
- OAuth redirect URI includes: `https://threadzbigaskins.com/oauth2/callback`
- CORS allows: `https://threadzbigaskins.com`

---

## 📋 Build Info

**Current Build:**
- Bundle size: ~528 KB (158 KB gzipped)
- Code splitting: Enabled
- Vendor chunks: React, UI components
- Configuration files: Included automatically

---

## 🎉 That's It!

Three simple steps:
1. `npm run build`
2. Upload `dist/` folder
3. Test OAuth login

**Questions?** Check the browser console for errors or contact support.
