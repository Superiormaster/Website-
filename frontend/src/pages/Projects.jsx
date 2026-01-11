import { useEffect, useState } from "react"
import api from "../services/api"
import AdminLayout from "../portfolio_admin/AdminLayout"

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Load recent projects from dashboard
  useEffect(() => {
    api.get("/dashboard").then(res => {
      setProjects(res.data.recent_projects);
    }).catch(err => console.error(err));
  }, []);

  const createProject = async () => {
    if (!title) return alert("Title is required");

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("live_url", liveUrl);
    form.append("github_url", githubUrl);
    if (imageFile) form.append("image", imageFile);

    try {
      const res = await api.post("/admin/projects", form);
      setProjects([res.data, ...projects]);
      setTitle("");
      setDescription("");
      setLiveUrl("");
      setGithubUrl("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };
  
  const [preview, setPreview] = useState(null);

  return (
    <AdminLayout>
      <div className="bg-gray-900 overflow-hidden space-y-6 border border-rose-100 max-w-4xl mx-auto px-6 py-4 text-center">
        <h1 className="text-4xl font-bold font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Projects</h1>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-lg mb-4 border border-gray-700"
          />
        )}
        <input className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Project title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea className="w-full mb-2 py-3 px-4 h-34 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Live URL"
          value={liveUrl}
          onChange={e => setLiveUrl(e.target.value)}
        />
        <input className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Github URL"
          value={githubUrl}
          onChange={e => setGithubUrl(e.target.value)}
        />
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            className="mb-4 block p-3 rounded border border-gray-600 text-white"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition w-full relative font-medium overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(50,130,246,0.4)]" onClick={createProject}>Create</button>
  
      <ul>
          {projects.map(p => (
            <li key={p.id}>
              <strong className="text-center">{p.title}</strong>
              {p.description && <p>{p.description}</p>}
              {p.live_url && <a href={p.live_url} target="_blank">Live</a>}
              {p.github_url && <a href={p.github_url} target="_blank">GitHub</a>}
              <button onClick={() => deleteProject(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}