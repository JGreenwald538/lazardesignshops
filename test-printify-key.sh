#!/bin/env bash
# Diagnostic script to test Printify API key

echo "=== Printify API Key Diagnostic ==="
echo ""

# Check .env file
echo "1. Checking .env file..."
ENV_KEY=$(grep "^PRINTIFY_API_KEY=" /Users/jackgreenwald/Desktop/Coding/lazardesignshops/.env 2>/dev/null | cut -d= -f2 | tr -d '"')
if [ -z "$ENV_KEY" ] || [ "$ENV_KEY" = "ADD_YOUR_PRINTIFY_API_KEY_HERE" ]; then
    echo "   ❌ PRINTIFY_API_KEY not set in .env file"
else
    echo "   ✅ PRINTIFY_API_KEY found in .env"
    echo "   First 30 chars: ${ENV_KEY:0:30}..."
fi

echo ""

# Check shell environment
echo "2. Checking shell environment..."
if [ -z "$PRINTIFY_API_KEY" ]; then
    echo "   ℹ️  PRINTIFY_API_KEY not set in shell (this is OK)"
else
    echo "   ⚠️  PRINTIFY_API_KEY is set in shell"
    echo "   First 30 chars: ${PRINTIFY_API_KEY:0:30}..."
fi

echo ""

# Test with .env key
if [ -n "$ENV_KEY" ] && [ "$ENV_KEY" != "ADD_YOUR_PRINTIFY_API_KEY_HERE" ]; then
    echo "3. Testing .env API key with Printify..."
    RESPONSE=$(curl -s -w "\n%{http_code}" https://api.printify.com/v1/shops.json \
        -H "Authorization: Bearer $ENV_KEY" \
        -H "User-Agent: lazardesignshops-server")
    STATUS=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ Authentication successful (HTTP 200)"
        echo "   Response: $BODY" | head -c 100
    else
        echo "   ❌ Authentication failed (HTTP $STATUS)"
        echo "   Response: $BODY"
    fi
else
    echo "3. Skipping API test—no valid key in .env"
fi

echo ""
echo "=== End Diagnostic ==="
