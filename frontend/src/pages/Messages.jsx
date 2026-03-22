import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { io } from "socket.io-client"
import AdminLayout from "../portfolio_admin/AdminLayout"

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/api/admin/messages")
      .then(res => {
        setMessages(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}/admin`, {
      transports: ["websocket"]
    })

    socket.on("connect", () => console.log("Connected to admin socket"))
    socket.on("new_message", (msg) => setMessages(prev => [msg, ...prev]))

    return () => socket.disconnect()
  }, [])

  return (
    <AdminLayout>
      <div className="bg-gray-900 min-h-screen py-10 px-6 sm:px-12 lg:px-24">
        <h1 className="text-5xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
          Messages
        </h1>

        {loading ? (
          <p className="text-gray-400 text-center text-lg">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-300 text-center text-lg">No messages yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map(m => (
              <div
                key={m.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-white">{m.name}</h3>
                  <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <p className="text-cyan-400 font-medium mb-2">{m.email}</p>
                <p className="text-gray-200">{m.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
          >
            ← Back
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}