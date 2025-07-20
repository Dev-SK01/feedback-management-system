const Joi = require("joi")

const feedbackSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  platform: Joi.string().required().min(1).max(100),
  module: Joi.string().required().min(1).max(100),
  description: Joi.string().required().min(1),
  attachments: Joi.string().allow("").max(500),
  tags: Joi.string().allow("").max(300),
})

const validateFeedback = (req, res, next) => {
  const { error } = feedbackSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    })
  }

  next()
}

module.exports = { validateFeedback }
