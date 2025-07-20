const express = require("express")
const router = express.Router()
const { pool } = require("../config/database")

/**
 * @swagger
 * /logs/activities:
 *   get:
 *     summary: Get activity logs
 *     description: Retrieve the latest 100 activity logs ordered by creation date (newest first)
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Successfully retrieved activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 *             examples:
 *               activity_logs:
 *                 summary: Activity Logs Response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       action: "CREATE"
 *                       table_name: "feedbacks"
 *                       record_id: 1
 *                       details: "Created feedback: Login Issue"
 *                       created_at: "2024-01-15T10:30:00Z"
 *                     - id: 2
 *                       action: "UPDATE"
 *                       table_name: "feedbacks"
 *                       record_id: 1
 *                       details: "Updated feedback: Login Issue"
 *                       created_at: "2024-01-15T10:35:00Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /logs/api-requests:
 *   get:
 *     summary: Get API request logs
 *     description: Retrieve the latest 100 API request logs with performance metrics ordered by creation date (newest first)
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Successfully retrieved API request logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApiRequest'
 *             examples:
 *               api_request_logs:
 *                 summary: API Request Logs Response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       method: "POST"
 *                       endpoint: "/api/feedbacks"
 *                       request_body: '{"title":"Login Issue","platform":"Web","module":"Authentication","description":"Users cannot login"}'
 *                       response_body: '{"success":true,"message":"Feedback created successfully","data":{"id":1}}'
 *                       status_code: 201
 *                       response_time: 150
 *                       created_at: "2024-01-15T10:30:00Z"
 *                     - id: 2
 *                       method: "GET"
 *                       endpoint: "/api/feedbacks"
 *                       request_body: "{}"
 *                       response_body: '{"success":true,"data":[...],"count":10}'
 *                       status_code: 200
 *                       response_time: 75
 *                       created_at: "2024-01-15T10:32:00Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

// GET /logs/activities - Get activity logs
router.get("/activities", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100")

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// GET /logs/api-requests - Get API request logs
router.get("/api-requests", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM api_requests ORDER BY created_at DESC LIMIT 100")

    res.json({
      success: true,
      data: rows,
    })
  } catch (error) {
    console.error("Error fetching API request logs:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

module.exports = router
