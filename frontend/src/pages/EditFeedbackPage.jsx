"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { feedbackAPI } from "../services/api"
import FeedbackForm from "../components/FeedbackForm"

const EditFeedbackPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [id])

  const fetchFeedback = async () => {
    try {
      setIsLoadingData(true)
      const response = await feedbackAPI.getFeedbackById(id)
      setFeedback(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch feedback details")
      navigate("/")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      await feedbackAPI.updateFeedback(id, data)
      toast.success("Feedback updated successfully!")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update feedback")
      console.error("Error updating feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return <FeedbackForm title="Edit Feedback" initialData={feedback} onSubmit={handleSubmit} isLoading={isLoading} />
}

export default EditFeedbackPage
