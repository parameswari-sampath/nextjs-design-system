# API Documentation

This directory contains clean, user-specific API documentation for the Django Test Platform.

## Available API Documentation

### 📚 **Teacher API** (`teacher-api.yaml`)
- **Audience**: Teachers and content creators
- **Features**: Question management, assessment creation, publishing, analytics
- **Test Account**: teacher01@gmail.com / S@iram@123

### 🎓 **Student API** (`student-api.yaml`)  
- **Audience**: Students taking assessments
- **Features**: Assessment discovery, taking tests, viewing results
- **Test Account**: student01@gmail.com / S@iram@123

## How to Use

### Option 1: Swagger UI
1. Copy the YAML content
2. Paste into [Swagger Editor](https://editor.swagger.io/)
3. Test endpoints directly

### Option 2: Postman/Insomnia
1. Import the YAML files
2. Set up environment variables for base URL and token
3. Test the API endpoints

### Option 3: curl Examples
Each API file contains example requests you can copy and use with curl.

## Authentication

All endpoints (except login) require JWT authentication:
```
Authorization: Bearer <your-jwt-token>
```

Get your token by calling the `/auth/login/` endpoint first.
