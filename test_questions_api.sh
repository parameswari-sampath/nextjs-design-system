#!/bin/bash

echo "Testing Questions API..."
echo "========================"

# Step 1: Login to get access token
echo "1. Logging in to get access token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher01@gmail.com",
    "password": "S@iram@123"
  }')

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to get access token. Login response:"
    echo $LOGIN_RESPONSE
    exit 1
fi

echo "✅ Access token obtained successfully"
echo ""

# Step 2: Test GET /api/questions/ (default - first page)
echo "2. Testing GET /api/questions/ (default pagination)..."
echo "------------------------------------------------------"
curl -s -X GET http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo ""

# Step 3: Test GET /api/questions/ with page parameter
echo "3. Testing GET /api/questions/?page=1 (first page explicitly)..."
echo "----------------------------------------------------------------"
curl -s -X GET "http://localhost:8000/api/questions/?page=1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo ""

# Step 4: Test GET /api/questions/ with different page sizes
echo "4. Testing GET /api/questions/?page_size=5 (5 items per page)..."
echo "----------------------------------------------------------------"
curl -s -X GET "http://localhost:8000/api/questions/?page_size=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo ""

# Step 5: Test GET /api/questions/ with page 2
echo "5. Testing GET /api/questions/?page=2 (second page)..."
echo "-----------------------------------------------------"
curl -s -X GET "http://localhost:8000/api/questions/?page=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo ""

# Step 6: Test GET /api/questions/ with custom page size and page
echo "6. Testing GET /api/questions/?page=1&page_size=10 (10 items, page 1)..."
echo "------------------------------------------------------------------------"
curl -s -X GET "http://localhost:8000/api/questions/?page=1&page_size=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo ""

# Step 7: Test edge cases
echo "7. Testing edge cases..."
echo "------------------------"

echo "7a. Testing page=999 (non-existent page):"
curl -s -X GET "http://localhost:8000/api/questions/?page=999" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""

echo "7b. Testing page_size=100 (large page size):"
curl -s -X GET "http://localhost:8000/api/questions/?page_size=100" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo "API testing completed!"