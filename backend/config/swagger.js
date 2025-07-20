const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Feedback Management System API",
      version: "1.0.0",
      description: "A comprehensive API for managing feedback submissions with activity logging and request tracking",
      contact: {
        name: "API Support",
        email: "support@feedbacksystem.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
      {
        url: "https://api.feedbacksystem.com/api",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        Feedback: {
          type: "object",
          required: ["title", "platform", "module", "description"],
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the feedback",
              example: 1,
            },
            title: {
              type: "string",
              maxLength: 255,
              description: "Title of the feedback",
              example: "Login Issue",
            },
            platform: {
              type: "string",
              maxLength: 100,
              description: "Platform where the issue occurred",
              enum: ["Web", "Mobile", "Desktop", "API"],
              example: "Web",
            },
            module: {
              type: "string",
              maxLength: 100,
              description: "Module or feature related to the feedback",
              enum: ["Authentication", "Dashboard", "Reports", "Settings", "Notifications", "User Management"],
              example: "Authentication",
            },
            description: {
              type: "string",
              description: "Detailed description of the feedback",
              example: "Users are unable to login with correct credentials",
            },
            attachments: {
              type: "string",
              maxLength: 500,
              description: "Comma-separated list of attachment file names",
              example: "screenshot1.png, error_log.txt",
            },
            tags: {
              type: "string",
              maxLength: 300,
              description: "Comma-separated list of tags",
              example: "bug, critical, login",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the feedback was created",
              example: "2024-01-15T10:30:00Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the feedback was last updated",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        FeedbackInput: {
          type: "object",
          required: ["title", "platform", "module", "description"],
          properties: {
            title: {
              type: "string",
              maxLength: 255,
              description: "Title of the feedback",
              example: "Login Issue",
            },
            platform: {
              type: "string",
              maxLength: 100,
              description: "Platform where the issue occurred",
              enum: ["Web", "Mobile", "Desktop", "API"],
              example: "Web",
            },
            module: {
              type: "string",
              maxLength: 100,
              description: "Module or feature related to the feedback",
              enum: ["Authentication", "Dashboard", "Reports", "Settings", "Notifications", "User Management"],
              example: "Authentication",
            },
            description: {
              type: "string",
              description: "Detailed description of the feedback",
              example: "Users are unable to login with correct credentials",
            },
            attachments: {
              type: "string",
              maxLength: 500,
              description: "Comma-separated list of attachment file names",
              example: "screenshot1.png, error_log.txt",
            },
            tags: {
              type: "string",
              maxLength: 300,
              description: "Comma-separated list of tags",
              example: "bug, critical, login",
            },
          },
        },
        ActivityLog: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the activity log",
              example: 1,
            },
            action: {
              type: "string",
              maxLength: 50,
              description: "Type of action performed",
              enum: ["CREATE", "UPDATE", "DELETE"],
              example: "CREATE",
            },
            table_name: {
              type: "string",
              maxLength: 50,
              description: "Name of the table affected",
              example: "feedbacks",
            },
            record_id: {
              type: "integer",
              description: "ID of the affected record",
              example: 1,
            },
            details: {
              type: "string",
              description: "Additional details about the action",
              example: "Created feedback: Login Issue",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the activity was logged",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        ApiRequest: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the API request log",
              example: 1,
            },
            method: {
              type: "string",
              maxLength: 10,
              description: "HTTP method used",
              enum: ["GET", "POST", "PUT", "DELETE"],
              example: "POST",
            },
            endpoint: {
              type: "string",
              maxLength: 255,
              description: "API endpoint that was called",
              example: "/api/feedbacks",
            },
            request_body: {
              type: "string",
              description: "JSON string of the request body",
              example: '{"title":"Login Issue","platform":"Web"}',
            },
            response_body: {
              type: "string",
              description: "JSON string of the response body",
              example: '{"success":true,"message":"Feedback created successfully"}',
            },
            status_code: {
              type: "integer",
              description: "HTTP status code of the response",
              example: 201,
            },
            response_time: {
              type: "integer",
              description: "Response time in milliseconds",
              example: 150,
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the request was made",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              description: "Response data (varies by endpoint)",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of error messages (for validation errors)",
              example: ["Title is required", "Platform is required"],
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation error",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Title is required", "Platform must be one of: Web, Mobile, Desktop, API"],
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Feedback not found",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Internal server error",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Feedbacks",
        description: "Feedback management operations",
      },
      {
        name: "Logs",
        description: "System logging and monitoring",
      },
      {
        name: "Health",
        description: "API health check",
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"], // Path to the API files
}

const specs = swaggerJsdoc(options)

module.exports = {
  specs,
  swaggerUi,
}
