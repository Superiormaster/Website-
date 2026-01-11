// src/components/section/Projects.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import RevealOnScroll from "../RevealOnScroll"
import API from "@/api"

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/portfolio/")
      .then(res => {
        setProjects(res.data.items ?? res.data); // supports pagination
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load projects:", err);
        setLoading(false);
      });
  }, []);
  
  return (
    <section id="projects" className="py-20 min-h-screen bg-gray-900 space-x-4 overflow-hidden">
      <RevealOnScroll>
        <div className="max-w-5xl px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">My Works</h2>
        </div>
         {loading && (
          <p className="text-gray-400 text-center">Loading projects...</p>
        )}
        {!loading && projects.length === 0 ? (
            <p className="text-gray-600 font-medium text-center">No project available yet.</p>
          ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 min-h-screen">
          {projects.map(p => (
            <div key={p.id} className=" rounded-xl shadow hover:shadow-lg transition border border-white/10 p-6 rounded-xl hover:border-blue-500/30 hover:-transparent-y-1 hover:shadow[0_2px_8px_rgba(59, 136, 246, 0.2)] transition">
              <div className="flex justify-center">
                <img
                  src={`http://127.0.0.1:5000/api/admin/uploads/${p.image}`}
                  alt={p.title}
                  className="w-full h-20 object-cover rounded-t-2xl mb-4"
                />
              </div>
              <h3 className="text-xl text-center font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-600 text-center mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {[].map((tech, key) => (
                  <span key={key} className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 hover:shadow[0_2px_8px_rgba(59, 136, 246, 0.1)] transition-all">
                      {tech}
                    </span>
                ))}
              </div>
              <div className="flex space-x-3 justify-between items-center">
                <a href={p.live_url} target="_blank" rel="noreferrer"
                   className="text-sm bg-blue-600 text-white px-4 py-2 rounded transition-colors hover:bg-blue-700">View Live</a>
                <a href={p.github_url} target="_blank" rel="noreferrer"
                   className="text-sm border border-blue-600 text-blue-600 px-4 py-2 transition-colors rounded hover:bg-blue-50">GitHub</a>
              </div>
            </div>
          ))}
        </div>
        )}
        <div className="flex justify-center items-center mt-10">
          <li className="py-3 border border-blue-500/50 list-none px-6 rounded text-medium transition-all duration-200 overflow-hidden relative text-blue-300 hover:-translate-y-0 hover:shadow[0_0_15px_rgba(59,139,246,0.2)] hover:bg-blue-500/10">
            <Link to="/apps">View My Apps</Link>
          </li>
        </div>
      </RevealOnScroll>
    </section>
  )
}