"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Save, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const FeedbackForm = ({ initialData, onSubmit, isLoading, title }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {
      title: "",
      platform: "",
      module: "",
      description: "",
      attachments: "",
      tags: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const platformOptions = ["Web", "Mobile", "Desktop", "API"]
  const moduleOptions = ["Authentication", "Dashboard", "Reports", "Settings", "Notifications", "User Management"]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 1, message: "Title cannot be empty" },
              maxLength: { value: 255, message: "Title must be less than 255 characters" },
            })}
            className={`form-input ${errors.title ? "border-red-500" : ""}`}
            placeholder="Enter feedback title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
            Platform *
          </label>
          <select
            id="platform"
            {...register("platform", { required: "Platform is required" })}
            className={`form-input ${errors.platform ? "border-red-500" : ""}`}
          >
            <option value="">Select platform</option>
            {platformOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.platform && <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>}
        </div>

        {/* Module */}
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
            Module *
          </label>
          <select
            id="module"
            {...register("module", { required: "Module is required" })}
            className={`form-input ${errors.module ? "border-red-500" : ""}`}
          >
            <option value="">Select module</option>
            {moduleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.module && <p className="mt-1 text-sm text-red-600">{errors.module.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description", {
              required: "Description is required",
              minLength: { value: 1, message: "Description cannot be empty" },
            })}
            className={`form-textarea ${errors.description ? "border-red-500" : ""}`}
            placeholder="Describe the feedback in detail"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Attachments */}
        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <input
            type="text"
            id="attachments"
            {...register("attachments", {
              maxLength: { value: 500, message: "Attachments must be less than 500 characters" },
            })}
            className={`form-input ${errors.attachments ? "border-red-500" : ""}`}
            placeholder="Enter attachment file names (comma separated)"
          />
          {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments.message}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Enter file names separated by commas (e.g., screenshot.png, document.pdf)
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            {...register("tags", {
              maxLength: { value: 300, message: "Tags must be less than 300 characters" },
            })}
            className={`form-input ${errors.tags ? "border-red-500" : ""}`}
            placeholder="Enter tags (comma separated)"
          />
          {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>}
          <p className="mt-1 text-sm text-gray-500">Enter tags separated by commas (e.g., bug, critical, ui)</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="btn btn-primary flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Feedback"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackForm
