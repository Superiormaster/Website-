import api from "@/services/api"
import AdminLayout from "../portfolio_admin/AdminLayout"
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/portfolio_admin/UserContext"

export default function Settings() {
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [twoFA, setTwoFA] = useState(user?.two_factor_enabled)

  useEffect(() => {
    if (user) {
      setTwoFA(!!user.two_factor_enabled)
    }
  }, [user])

  // ⛔ Guard: wait until user exists
  if (!user) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-400 mt-10">Loading settings…</p>
      </AdminLayout>
    )
  }

  const updatePassword = async () => {
    if (!password) return alert("Password required")

    setLoading(true)
    try {
      await api.post("/admin/settings/password", { password })
      alert("Password updated successfully")
      setPassword("")
    } catch {
      alert("Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  const toggle2FA = async () => {
    setLoading(true)
    try {
      await api.post("/admin/settings/2fa/toggle")
      setTwoFA(!twoFA)
      alert("2FA updated")
    } catch {
      alert("Failed to update 2FA")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 p-6 text-gray-200">

        <h1 className="text-3xl font-bold">Settings</h1>

        {/* Profile */}
        <section className="bg-gray-900 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </section>

        {/* Security */}
        <section className="bg-gray-900 p-6 rounded-xl border border-white/10 space-y-4">
          <h2 className="text-xl font-semibold">Security</h2>

          <div>
            <label className="block mb-2">Change Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />
            <button
              onClick={updatePassword}
              disabled={loading}
              className="mt-3 px-4 py-2 bg-blue-600 rounded"
            >
              Update Password
            </button>
          </div>

        {/*  <div className="flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <button
              onClick={toggle2FA}
              className={`px-4 py-2 rounded ${twoFA ? "bg-red-600" : "bg-green-600"}`}
            >
              {twoFA ? "Disable" : "Enable"}
            </button>
          </div>*/}
        </section>

        {/* Data */}
        <section className="bg-gray-900 p-6 rounded-xl border border-white/10 space-y-4">
          <h2 className="text-xl font-semibold">Data & Maintenance</h2>

          <button
            onClick={() => window.open("/admin/export/messages/csv")}
            className="px-4 py-2 bg-emerald-600 rounded"
          >
            Export Messages (CSV)
          </button>

          <button
            onClick={() => window.open("/admin/export/messages/pdf")}
            className="px-4 py-2 bg-indigo-600 rounded"
          >
            Export Messages (PDF)
          </button>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-900/30 p-6 rounded-xl border border-red-500 space-y-4">
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>

          <button
            onClick={() => {
              if (confirm("Logout all sessions?")) {
                api.post("/admin/logout-all")
              }
            }}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Logout All Sessions
          </button>
        </section>

      </div>
    </AdminLayout>
  )
}