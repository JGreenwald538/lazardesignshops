# Add-to-Cart Fix Complete ✅

## What Was Wrong
Your add-to-cart endpoint was failing with "Must select size" errors even when sizes were selected. The root cause was **environment variable shadowing**:

1. An old, expired Printify API key was exported in your shell session
2. This overrode the `.env` file settings
3. Next.js used the expired key, causing 401 Unauthorized from Printify
4. The app then showed misleading validation errors instead of auth errors

## What Was Fixed

### Code Changes
- ✅ Refactored add-to-cart to validate size/color directly (not just variant lookup)
- ✅ Made variant resolution on-demand (at button click, not background)
- ✅ Added proper error handling with try-catch blocks
- ✅ Added User-Agent header to Printify API calls
- ✅ Created `/api/health` endpoint for diagnostics

### Environment Setup
- ✅ Removed expired Printify key from shell environment
- ✅ Cleaned `.next` build cache
- ✅ Added valid Printify API key to `.env` file

## How to Verify It Works

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "READY",
  "message": "✅ Printify API key is valid and working!",
  "shops": 2,
  "readyForAddToCart": true
}
```

Test variant lookup:
```bash
curl -X POST http://localhost:3000/api/printify/find-variant \
  -H 'Content-Type: application/json' \
  -d '{"id":"677459507dfd3d148405eacb","size":"Small","color":"Dark Grey"}'
```

Expected response:
```json
{"variantId": 103525}
```

## Important Notes

⚠️ **API Key Rotation**: The Printify API key in `.env` should be rotated periodically for security. To update it:

1. Go to https://printify.com/app/account/api
2. Generate a new personal access token
3. Update `.env`: `PRINTIFY_API_KEY="your_new_token"`
4. Restart: `bun dev`

⚠️ **Shell Environment**: Make sure you don't have old Printify vars exported in your shell startup files (`.bashrc`, `.zshrc`, etc.). They will override `.env`.

Check with:
```bash
env | grep PRINTIFY
```

Clear if needed:
```bash
set -e PRINTIFY_API_KEY  # fish shell
unset PRINTIFY_API_KEY   # bash/zsh
```

## Testing Checklist

- [x] Health endpoint returns READY status
- [x] Variant lookup returns valid IDs
- [x] Size/color validation works on frontend
- [x] Error messages are clear and actionable
- [x] No shell env vars are conflicting
- [x] Build cache is clean
- [ ] User can add product to cart (manual test needed)
- [ ] Checkout flow completes successfully (manual test needed)

## Files Modified

- `app/product/[id]/page.tsx` - Add-to-cart button logic with proper validation
- `app/api/printify/find-variant/route.ts` - Variant lookup with better error handling
- `app/api/health/route.ts` - NEW diagnostic endpoint
- `.env` - Added valid Printify API key

## Next Steps

1. Test the add-to-cart flow end-to-end
2. Check that products can be added to cart
3. Verify checkout works
4. Monitor for any new 401 errors

If you see 401 errors again:
1. Run `curl http://localhost:3000/api/health` to diagnose
2. Check `env | grep PRINTIFY` for shell conflicts
3. Verify API key hasn't expired
4. Check `/memories/repo/printify-auth-issue.md` for detailed troubleshooting
