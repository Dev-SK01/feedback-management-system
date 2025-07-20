# Feedback Management System - API Documentation

## Base URL

- **Development**: `http://localhost:5000/api`

## Interactive Documentation

Access the interactive Swagger UI documentation at:
- **Development**: `http://localhost:5000/api-docs`

## Response Format

All API responses follow a consistent format:

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional, for validation errors
}
\`\`\`

## HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server error

## Endpoints

### 1. Feedbacks

#### GET /feedbacks
Retrieve all feedback entries.

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Login Issue",
      "platform": "Web",
      "module": "Authentication",
      "description": "Users are unable to login with correct credentials",
      "attachments": "screenshot1.png",
      "tags": "bug,critical,login",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
\`\`\`

#### POST /feedbacks
Create a new feedback entry.

**Request Body:**
\`\`\`json
{
  "title": "Login Issue",
  "platform": "Web",
  "module": "Authentication", 
  "description": "Users are unable to login with correct credentials",
  "attachments": "screenshot1.png",
  "tags": "bug,critical,login"
}
\`\`\`

**Validation Rules:**
- `title`: Required, max 255 characters
- `platform`: Required, must be one of: Web, Mobile, Desktop, API
- `module`: Required, must be one of: Authentication, Dashboard, Reports, Settings, Notifications, User Management
- `description`: Required, cannot be empty
- `attachments`: Optional, max 500 characters
- `tags`: Optional, max 300 characters

#### GET /feedbacks/{id}
Retrieve a specific feedback by ID.

**Parameters:**
- `id` (path): Integer, required - Feedback ID

#### PUT /feedbacks/{id}
Update an existing feedback entry.

**Parameters:**
- `id` (path): Integer, required - Feedback ID

**Request Body:** Same as POST /feedbacks

#### DELETE /feedbacks/{id}
Delete a feedback entry.

**Parameters:**
- `id` (path): Integer, required - Feedback ID

### 2. Logs

#### GET /logs/activities
Retrieve activity logs (latest 100 entries).

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "table_name": "feedbacks",
      "record_id": 1,
      "details": "Created feedback: Login Issue",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

#### GET /logs/api-requests
Retrieve API request logs with performance metrics (latest 100 entries).

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "method": "POST",
      "endpoint": "/api/feedbacks",
      "request_body": "{\"title\":\"Login Issue\"}",
      "response_body": "{\"success\":true}",
      "status_code": 201,
      "response_time": 150,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

### 3. Health Check

#### GET /health
Check API health status.

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Feedback Management API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

## Data Models

### Feedback
\`\`\`typescript
interface Feedback {
  id: number;
  title: string;           // max 255 chars
  platform: string;       // Web|Mobile|Desktop|API
  module: string;          // Authentication|Dashboard|Reports|Settings|Notifications|User Management
  description: string;
  attachments?: string;    // max 500 chars
  tags?: string;          // max 300 chars
  created_at: string;     // ISO 8601 datetime
  updated_at: string;     // ISO 8601 datetime
}
\`\`\`

### Activity Log
\`\`\`typescript
interface ActivityLog {
  id: number;
  action: string;         // CREATE|UPDATE|DELETE
  table_name: string;
  record_id: number;
  details: string;
  created_at: string;     // ISO 8601 datetime
}
\`\`\`

### API Request Log
\`\`\`typescript
interface ApiRequest {
  id: number;
  method: string;         // GET|POST|PUT|DELETE
  endpoint: string;
  request_body: string;   // JSON string
  response_body: string;  // JSON string
  status_code: number;
  response_time: number;  // milliseconds
  created_at: string;     // ISO 8601 datetime
}
\`\`\`

## Error Handling

### Validation Errors (400)
\`\`\`json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Title is required",
    "Platform must be one of: Web, Mobile, Desktop, API"
  ]
}
\`\`\`

### Not Found (404)
\`\`\`json
{
  "success": false,
  "message": "Feedback not found"
}
\`\`\`

### Internal Server Error (500)
\`\`\`json
{
  "success": false,
  "message": "Internal server error"
}
\`\`\`

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Logging

All API requests are automatically logged to the database with:
- Request method and endpoint
- Request and response bodies
- Status codes
- Response times
- Timestamps

All CRUD operations on feedback are logged to activity logs with:
- Action type (CREATE, UPDATE, DELETE)
- Affected table and record ID
- Action details
- Timestamps

## Examples

### Create Feedback
\`\`\`bash
curl -X POST http://localhost:5000/api/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dashboard Loading Issue",
    "platform": "Web",
    "module": "Dashboard",
    "description": "Dashboard takes too long to load user data",
    "attachments": "performance_log.txt",
    "tags": "performance,slow,dashboard"
  }'
\`\`\`

### Get All Feedbacks
\`\`\`bash
curl http://localhost:5000/api/feedbacks
\`\`\`

### Update Feedback
\`\`\`bash
curl -X PUT http://localhost:5000/api/feedbacks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dashboard Loading Issue - RESOLVED",
    "platform": "Web",
    "module": "Dashboard",
    "description": "Dashboard loading issue has been fixed with caching improvements",
    "attachments": "performance_log.txt, fix_details.md",
    "tags": "performance,resolved,dashboard"
  }'
\`\`\`

### Delete Feedback
\`\`\`bash
curl -X DELETE http://localhost:5000/api/feedbacks/1
\`\`\`