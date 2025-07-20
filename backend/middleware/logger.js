const { pool } = require("../config/database")

// Log API requests and responses
const apiLogger = async (req, res, next) => {
  const startTime = Date.now()

  // Store original send function
  const originalSend = res.send
  let responseBody = ""

  // Override send function to capture response
  res.send = function (body) {
    responseBody = body
    originalSend.call(this, body)
  }

  // Log after response is sent
  res.on("finish", async () => {
    const endTime = Date.now()
    const responseTime = endTime - startTime

    try {
      await pool.execute(
        "INSERT INTO api_requests (method, endpoint, request_body, response_body, status_code, response_time) VALUES (?, ?, ?, ?, ?, ?)",
        [req.method, req.originalUrl, JSON.stringify(req.body || {}), responseBody, res.statusCode, responseTime],
      )
    } catch (error) {
      console.error("Error logging API request:", error)
    }
  })

  next()
}

// Log activity
const logActivity = async (action, tableName, recordId, details) => {
  try {
    await pool.execute("INSERT INTO activity_logs (action, table_name, record_id, details) VALUES (?, ?, ?, ?)", [
      action,
      tableName,
      recordId,
      details,
    ])
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

module.exports = { apiLogger, logActivity }
