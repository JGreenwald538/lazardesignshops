#!/usr/bin/env fish
# Diagnostic script to test Printify API key

echo "=== Printify API Key Diagnostic ==="
echo ""

# Check .env file
echo "1. Checking .env file..."
set ENV_FILE "/Users/jackgreenwald/Desktop/Coding/lazardesignshops/.env"
set ENV_KEY (grep "^PRINTIFY_API_KEY=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"')
if test -z "$ENV_KEY"; or test "$ENV_KEY" = "ADD_YOUR_PRINTIFY_API_KEY_HERE"
    echo "   ❌ PRINTIFY_API_KEY not set in .env file"
else
    echo "   ✅ PRINTIFY_API_KEY found in .env"
    set ENV_KEY_PREVIEW (string sub -s 1 -l 30 -- "$ENV_KEY")
    echo "   First 30 chars: $ENV_KEY_PREVIEW..."
end

echo ""

# Check shell environment
echo "2. Checking shell environment..."
if not set -q PRINTIFY_API_KEY
    echo "   ℹ️  PRINTIFY_API_KEY not set in shell (this is OK)"
else
    echo "   ⚠️  PRINTIFY_API_KEY is set in shell"
    set SHELL_KEY_PREVIEW (string sub -s 1 -l 30 -- "$PRINTIFY_API_KEY")
    echo "   First 30 chars: $SHELL_KEY_PREVIEW..."
end

echo ""

# Test with .env key
if test -n "$ENV_KEY"; and test "$ENV_KEY" != "ADD_YOUR_PRINTIFY_API_KEY_HERE"
    echo "3. Testing .env API key with Printify..."
    set RESPONSE_LINES (curl -s -w "\n%{http_code}" https://api.printify.com/v1/shops.json \
        -H "Authorization: Bearer $ENV_KEY" \
        -H "User-Agent: lazardesignshops-server")
    set STATUS $RESPONSE_LINES[-1]
    set BODY (string join "\n" $RESPONSE_LINES[1..-2])
    
    if test "$STATUS" = "200"
        echo "   ✅ Authentication successful (HTTP 200)"
        echo "   Response: $BODY" | head -c 100
    else
        echo "   ❌ Authentication failed (HTTP $STATUS)"
        echo "   Response: $BODY"
    end
else
    echo "3. Skipping API test—no valid key in .env"
end

echo ""
echo "=== End Diagnostic ==="
