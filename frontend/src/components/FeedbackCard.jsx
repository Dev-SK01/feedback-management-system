"use client"

import { Edit, Trash2, Tag, Monitor, Package } from "lucide-react"
import { Link } from "react-router-dom"

const FeedbackCard = ({ feedback, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      onDelete(feedback.id)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{feedback.title}</h3>
        <div className="flex space-x-2 ml-4">
          <Link
            to={`/edit/${feedback.id}`}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit feedback"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete feedback"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Monitor className="w-4 h-4 mr-1" />
            <span className="font-medium">Platform:</span>
            <span className="ml-1">{feedback.platform}</span>
          </div>
          <div className="flex items-center">
            <Package className="w-4 h-4 mr-1" />
            <span className="font-medium">Module:</span>
            <span className="ml-1">{feedback.module}</span>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-3">{feedback.description}</p>

        {feedback.attachments && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Attachments:</span>
            <span className="ml-1">{feedback.attachments}</span>
          </div>
        )}

        {feedback.tags && (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {feedback.tags.split(",").map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 border-t pt-3">
        Created: {formatDate(feedback.created_at)}
        {feedback.updated_at !== feedback.created_at && (
          <span className="ml-4">Updated: {formatDate(feedback.updated_at)}</span>
        )}
      </div>
    </div>
  )
}

export default FeedbackCard
