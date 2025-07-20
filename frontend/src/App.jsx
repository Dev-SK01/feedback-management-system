import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import AddFeedbackPage from "./pages/AddFeedbackPage"
import EditFeedbackPage from "./pages/EditFeedbackPage"
import LogsPage from "./pages/LogsPage"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddFeedbackPage />} />
          <Route path="/edit/:id" element={<EditFeedbackPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      />
    </Router>
  )
}

export default App
