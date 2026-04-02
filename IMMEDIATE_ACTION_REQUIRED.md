# IMMEDIATE ACTION REQUIRED

Your add-to-cart system has been fixed, but you need to complete ONE FINAL STEP:

## Step 1: Add Your Printify API Key

1. Go to: https://printify.com/app/account/api
2. Look for "Personal access tokens" section
3. Create a new token (or copy an existing one)
4. Copy the entire token value (it starts with `eyJ` and is ~700 characters)

## Step 2: Update .env File

Open `.env` in your project root and replace:
```
PRINTIFY_API_KEY="PASTE_YOUR_PRINTIFY_API_TOKEN_HERE"
```

With your actual token:
```
PRINTIFY_API_KEY="eyJ0eXAiOiJKV1QiLCJhbGci... [rest of your token]"
```

**Make sure you copy the ENTIRE token - it's very long!**

## Step 3: Restart Dev Server

```bash
killall bun
bun dev
```

## Step 4: Verify It Works

Test the health check:
```bash
curl http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "READY",
  "message": "✅ Printify API key is valid and working!",
  "readyForAddToCart": true
}
```

## If Still Not Working

1. Check you copied the token completely (no truncation)
2. Verify the token hasn't expired
3. Make sure you restarted `bun dev`
4. Run: `env | grep PRINTIFY` to check for conflicting shell exports

## What Was Fixed

Your add-to-cart was failing because:
- An old Printify API key was cached in your shell environment
- It was overriding the `.env` file
- This caused 401 errors from Printify

**Solution**: We cleared the shell cache and improved the code to handle variants properly.

All the code improvements are done. You just need to add your valid API key to `.env`.
