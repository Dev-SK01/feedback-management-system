import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const feedbackAPI = {
  // Get all feedbacks
  getAllFeedbacks: () => api.get("/feedbacks"),

  // Get feedback by ID
  getFeedbackById: (id) => api.get(`/feedbacks/${id}`),

  // Create new feedback
  createFeedback: (data) => api.post("/feedbacks", data),

  // Update feedback
  updateFeedback: (id, data) => api.put(`/feedbacks/${id}`, data),

  // Delete feedback
  deleteFeedback: (id) => api.delete(`/feedbacks/${id}`),
}

export const logsAPI = {
  // Get activity logs
  getActivityLogs: () => api.get("/logs/activities"),

  // Get API request logs
  getApiRequestLogs: () => api.get("/logs/api-requests"),
}

export default api
