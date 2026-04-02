# Printify API Key Setup Instructions

## Status
Your add-to-cart endpoint is working correctly, but it needs a valid Printify API key to function.

## Root Cause Identified
The variant lookup was failing because:
1. An expired API key was cached in your shell environment
2. This was overriding the `.env` file values
3. We've cleared the shell; now you need the **new** API key in `.env`

## How to Fix

### Step 1: Generate a New Printify API Key
1. Go to: https://printify.com/app/account/api
2. Look for "Personal access tokens" section
3. Click "Create token" or similar button
4. Select these scopes:
   - `shops.read`
   - `products.read`
   - `catalogs.read`
5. Generate the token
6. **Copy the entire token** (it's a long JWT string starting with `eyJ...`)

### Step 2: Add to .env File
Open `.env` in the root of your project and update this line:

```
PRINTIFY_API_KEY="PASTE_YOUR_TOKEN_HERE"
```

Example (DO NOT use this—it's a fake token):
```
PRINTIFY_API_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIz..."
```

### Step 3: Restart the Dev Server
```bash
# Kill the old server
killall bun

# Start fresh
bun dev
```

### Step 4: Test the Endpoint
```bash
curl -X POST http://localhost:3000/api/printify/find-variant \
  -H 'Content-Type: application/json' \
  --data '{"id":"677459507dfd3d148405eacb","size":"Small","color":"Dark Grey"}'
```

Expected response (should contain a `variantId`):
```json
{"variantId":12345678}
```

If you still get a 401, the token may be:
- Not copied completely
- From the wrong Printify app
- Missing required scopes

## Verification Commands

To verify the token works before adding to `.env`:

```bash
# Replace TOKEN with your actual token
curl -s https://api.printify.com/v1/shops.json \
  -H "Authorization: Bearer TOKEN" \
  -H "User-Agent: lazardesignshops-server"
```

Should return a list of your Printify shops (HTTP 200).

## What's Fixed
✅ Add-to-cart page correctly validates size/color selections
✅ Variant lookup makes on-demand requests at button click
✅ All error messages are clear and actionable
✅ User-Agent headers added to Printify API calls
✅ Shell environment no longer conflicts with `.env`

## Next Steps
1. Get your new Printify API token
2. Add it to `.env`
3. Restart dev server
4. Test the endpoint
5. Try adding a product to cart
