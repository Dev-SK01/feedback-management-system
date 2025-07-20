const express = require("express")
const router = express.Router()
const { pool } = require("../config/database")
const { validateFeedback } = require("../middleware/validation")
const { logActivity } = require("../middleware/logger")

/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Get all feedbacks
 *     description: Retrieve a list of all feedback entries ordered by creation date (newest first)
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: Successfully retrieved feedbacks
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
 *                     $ref: '#/components/schemas/Feedback'
 *                 count:
 *                   type: integer
 *                   description: Total number of feedbacks
 *                   example: 10
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   post:
 *     summary: Create new feedback
 *     description: Create a new feedback entry with validation
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedbackInput'
 *           examples:
 *             bug_report:
 *               summary: Bug Report Example
 *               value:
 *                 title: "Login button not working"
 *                 platform: "Web"
 *                 module: "Authentication"
 *                 description: "The login button becomes unresponsive after clicking"
 *                 attachments: "screenshot.png, console_log.txt"
 *                 tags: "bug, critical, ui"
 *             feature_request:
 *               summary: Feature Request Example
 *               value:
 *                 title: "Add dark mode support"
 *                 platform: "Mobile"
 *                 module: "Settings"
 *                 description: "Users would like a dark mode option in the settings"
 *                 attachments: ""
 *                 tags: "enhancement, ui, settings"
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Feedback created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /feedbacks/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     description: Retrieve a specific feedback entry by its ID
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the feedback
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   put:
 *     summary: Update feedback
 *     description: Update an existing feedback entry with validation
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the feedback to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedbackInput'
 *           example:
 *             title: "Updated: Login button not working"
 *             platform: "Web"
 *             module: "Authentication"
 *             description: "The login button becomes unresponsive after clicking. Issue persists in Chrome browser."
 *             attachments: "screenshot.png, console_log.txt, network_tab.png"
 *             tags: "bug, critical, ui, chrome"
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Feedback updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   delete:
 *     summary: Delete feedback
 *     description: Delete a specific feedback entry by its ID
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the feedback to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Feedback deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// GET /feedbacks - Fetch all feedback
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM feedbacks ORDER BY created_at DESC")

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    })
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// GET /feedbacks/:id - Get specific feedback
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.execute("SELECT * FROM feedbacks WHERE id = ?", [id])

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    res.json({
      success: true,
      data: rows[0],
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// POST /feedbacks - Add new feedback
router.post("/", validateFeedback, async (req, res) => {
  try {
    const { title, platform, module, description, attachments, tags } = req.body

    const [result] = await pool.execute(
      "INSERT INTO feedbacks (title, platform, module, description, attachments, tags) VALUES (?, ?, ?, ?, ?, ?)",
      [title, platform, module, description, attachments || "", tags || ""],
    )

    // Log activity
    await logActivity("CREATE", "feedbacks", result.insertId, `Created feedback: ${title}`)

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: {
        id: result.insertId,
        title,
        platform,
        module,
        description,
        attachments,
        tags,
      },
    })
  } catch (error) {
    console.error("Error creating feedback:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// PUT /feedbacks/:id - Update feedback
router.put("/:id", validateFeedback, async (req, res) => {
  try {
    const { id } = req.params
    const { title, platform, module, description, attachments, tags } = req.body

    // Check if feedback exists
    const [existing] = await pool.execute("SELECT * FROM feedbacks WHERE id = ?", [id])
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    await pool.execute(
      "UPDATE feedbacks SET title = ?, platform = ?, module = ?, description = ?, attachments = ?, tags = ? WHERE id = ?",
      [title, platform, module, description, attachments || "", tags || "", id],
    )

    // Log activity
    await logActivity("UPDATE", "feedbacks", id, `Updated feedback: ${title}`)

    res.json({
      success: true,
      message: "Feedback updated successfully",
      data: {
        id: Number.parseInt(id),
        title,
        platform,
        module,
        description,
        attachments,
        tags,
      },
    })
  } catch (error) {
    console.error("Error updating feedback:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// DELETE /feedbacks/:id - Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Check if feedback exists
    const [existing] = await pool.execute("SELECT * FROM feedbacks WHERE id = ?", [id])
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    await pool.execute("DELETE FROM feedbacks WHERE id = ?", [id])

    // Log activity
    await logActivity("DELETE", "feedbacks", id, `Deleted feedback: ${existing[0].title}`)

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting feedback:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

module.exports = router
