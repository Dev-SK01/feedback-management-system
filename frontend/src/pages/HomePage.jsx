"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { feedbackAPI } from "../services/api"
import FeedbackCard from "../components/FeedbackCard"

const HomePage = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlatform, setFilterPlatform] = useState("")
  const [filterModule, setFilterModule] = useState("")

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const response = await feedbackAPI.getAllFeedbacks()
      setFeedbacks(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch feedbacks")
      console.error("Error fetching feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await feedbackAPI.deleteFeedback(id)
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id))
      toast.success("Feedback deleted successfully")
    } catch (error) {
      toast.error("Failed to delete feedback")
      console.error("Error deleting feedback:", error)
    }
  }

  // Filter feedbacks based on search and filters
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.tags.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = !filterPlatform || feedback.platform === filterPlatform
    const matchesModule = !filterModule || feedback.module === filterModule

    return matchesSearch && matchesPlatform && matchesModule
  })

  const platforms = [...new Set(feedbacks.map((f) => f.platform))]
  const modules = [...new Set(feedbacks.map((f) => f.module))]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
          <p className="mt-2 text-sm text-gray-700">Manage and track all feedback submissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/add" className="btn btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Feedback
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="form-input">
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)} className="form-input">
            <option value="">All Modules</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center">
                <Filter className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Feedbacks</p>
              <p className="text-2xl font-semibold text-gray-900">{feedbacks.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <Filter className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Filtered Results</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredFeedbacks.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <Filter className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Platforms</p>
              <p className="text-2xl font-semibold text-gray-900">{platforms.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {feedbacks.length === 0 ? "No feedbacks yet" : "No feedbacks found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {feedbacks.length === 0
              ? "Get started by adding your first feedback."
              : "Try adjusting your search or filter criteria."}
          </p>
          {feedbacks.length === 0 && (
            <Link to="/add" className="btn btn-primary">
              Add First Feedback
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
