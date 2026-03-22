import { useEffect, useState } from "react"
import api from "../services/api"
import AdminLayout from "../portfolio_admin/AdminLayout"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)

  // Load recent projects
  useEffect(() => {
    api.get("/api/dashboard")
      .then(res => setProjects(res.data.recent_projects))
      .catch(err => console.error(err))
  }, [])

  const createProject = async () => {
    if (!title) return alert("Title is required")

    const form = new FormData()
    form.append("title", title)
    form.append("description", description)
    form.append("live_url", liveUrl)
    form.append("github_url", githubUrl)
    if (imageFile) form.append("image", imageFile)

    try {
      const res = await api.post("/api/admin/projects", form)
      setProjects([res.data, ...projects])
      setTitle("")
      setDescription("")
      setLiveUrl("")
      setGithubUrl("")
      setImageFile(null)
      setPreview(null)
    } catch (err) {
      console.error(err)
      alert("Failed to create project")
    }
  }

  return (
    <AdminLayout>
      <div className="bg-gray-900 min-h-screen py-4 px-6 sm:px-12 lg:px-24 space-y-6">
        <h1 className="text-5xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
          Projects
        </h1>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-lg mb-4 border border-gray-700"
          />
        )}

        <input
          className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Project title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-2 py-3 px-4 h-36 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Live URL"
          value={liveUrl}
          onChange={e => setLiveUrl(e.target.value)}
        />
        <input
          className="w-full mb-4 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Github URL"
          value={githubUrl}
          onChange={e => setGithubUrl(e.target.value)}
        />

        {/* Image Upload with Plus Sign */}
        <div className="flex justify-center mb-4">
          <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-4xl font-bold">+</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0]
                setImageFile(file)
                if (file) setPreview(URL.createObjectURL(file))
              }}
            />
          </label>
        </div>

        <button
          className="w-full px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:shadow-xl"
          onClick={createProject}
        >
          Create Project
        </button>
      </div>
    </AdminLayout>
  )
}