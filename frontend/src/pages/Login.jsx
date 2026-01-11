import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { UserContext } from "@/portfolio_admin/UserContext"
import { jwtDecode } from "jwt-decode"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const res = await api.post("api/admin/login", { username, password },   { headers: { "Content-Type": "application/json" } });
      const token = res.data.token

      localStorage.setItem("token", token)

      const decoded = jwtDecode(res.data.token);
      setUser(decoded);

      navigate("api/admin");
    } catch (err) {
      console.error(err);
      alert("Invalid username or password");
    } finally {
      setLoading(false)
    }
  };

  return (
    <section className="py-24 bg-gray-900 overflow-hidden min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <form onSubmit={submit} className="p-4 space-y-6 border border-rose-100">
          <h2 className="text-4xl font-bold font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Login</h2>
          <input placeholder="Username" className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500" onChange={e => setUsername(e.target.value)} />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} placeholder="Password" className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500" onChange={e => setPassword(e.target.value)} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
              >
                {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition w-full relative font-medium overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(50,130,246,0.4)]">{loading ? "Logging in..." : "Login"}</button>
        </form>
      </div>
    </section>
  );
}