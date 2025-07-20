"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { feedbackAPI } from "../services/api"
import FeedbackForm from "../components/FeedbackForm"

const AddFeedbackPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      await feedbackAPI.createFeedback(data)
      toast.success("Feedback created successfully!")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create feedback")
      console.error("Error creating feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return <FeedbackForm title="Add New Feedback" onSubmit={handleSubmit} isLoading={isLoading} />
}

export default AddFeedbackPage
