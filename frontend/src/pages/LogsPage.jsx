"use client"

import { useState, useEffect } from "react"
import { Activity, Database, Clock } from "lucide-react"
import toast from "react-hot-toast"
import { logsAPI } from "../services/api"

const LogsPage = () => {
  const [activeTab, setActiveTab] = useState("activities")
  const [activityLogs, setActivityLogs] = useState([])
  const [apiLogs, setApiLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const [activityResponse, apiResponse] = await Promise.all([
        logsAPI.getActivityLogs(),
        logsAPI.getApiRequestLogs(),
      ])
      setActivityLogs(activityResponse.data.data)
      setApiLogs(apiResponse.data.data)
    } catch (error) {
      toast.error("Failed to fetch logs")
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "text-green-600 bg-green-100"
    if (statusCode >= 400 && statusCode < 500) return "text-yellow-600 bg-yellow-100"
    if (statusCode >= 500) return "text-red-600 bg-red-100"
    return "text-gray-600 bg-gray-100"
  }

  const getActionColor = (action) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "text-green-600 bg-green-100"
      case "UPDATE":
        return "text-blue-600 bg-blue-100"
      case "DELETE":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <p className="mt-2 text-sm text-gray-700">Monitor system activities and API requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("activities")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "activities"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Activity Logs ({activityLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "api"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            API Requests ({apiLogs.length})
          </button>
        </nav>
      </div>

      {/* Activity Logs Tab */}
      {activeTab === "activities" && (
        <div className="space-y-4">
          {activityLogs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs</h3>
              <p className="text-gray-500">Activity logs will appear here as actions are performed.</p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.table_name} #{log.record_id}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(log.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* API Logs Tab */}
      {activeTab === "api" && (
        <div className="space-y-4">
          {apiLogs.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API logs</h3>
              <p className="text-gray-500">API request logs will appear here as requests are made.</p>
            </div>
          ) : (
            apiLogs.map((log) => (
              <div key={log.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-mono rounded">{log.method}</span>
                    <span className="text-sm font-medium text-gray-900">{log.endpoint}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status_code)}`}>
                      {log.status_code}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{log.response_time}ms</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(log.created_at)}
                    </div>
                  </div>
                </div>

                {log.request_body && log.request_body !== "{}" && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Request:</p>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(JSON.parse(log.request_body), null, 2)}
                    </pre>
                  </div>
                )}

                {log.response_body && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Response:</p>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                      {typeof log.response_body === "string"
                        ? log.response_body.length > 500
                          ? log.response_body.substring(0, 500) + "..."
                          : log.response_body
                        : JSON.stringify(log.response_body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default LogsPage
