import { useEffect, useState } from "react";
import api from "../services/api"; // your axios instance
import AdminLayout from "../portfolio_admin/AdminLayout";

export default function DeletedItems() {
  const [projects, setProjects] = useState([]);
  const [apps, setApps] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [tab, setTab] = useState("projects"); // "projects" or "apps"

  // Fetch deleted projects
  const fetchDeletedProjects = async () => {
    try {
      const res = await api.get("/projects/deleted");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch deleted apps
  const fetchDeletedApps = async () => {
    try {
      const res = await api.get("/apps/deleted");
      setApps(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchDeletedProjects();
    fetchDeletedApps();
  }, []);

  // Restore item
  const handleRestore = async (type, id) => {
    try {
      await api.post(`/${type}/${id}/restore`);
      if (type === "projects") {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        setApps(apps.filter(a => a.id !== id));
      }
      alert(`${type === "projects" ? "Project" : "App"} restored successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to restore ${type === "projects" ? "project" : "app"}.`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Deleted Items</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("projects")}
            className={`px-4 py-2 rounded ${tab === "projects" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Deleted Projects
          </button>
          <button
            onClick={() => setTab("apps")}
            className={`px-4 py-2 rounded ${tab === "apps" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Deleted Apps
          </button>
        </div>

        {/* Content */}
        {tab === "projects" && (
          <>
            {loadingProjects ? (
              <p>Loading deleted projects...</p>
            ) : projects.length === 0 ? (
              <p>No deleted projects found.</p>
            ) : (
              <ul className="space-y-4">
                {projects.map((p) => (
                  <li key={p.id} className="p-4 border rounded flex justify-between items-center">
                    <div>
                      <strong>{p.title}</strong>
                      <p className="text-gray-500">{p.description}</p>
                    </div>
                    <button
                      onClick={() => handleRestore("projects", p.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "apps" && (
          <>
            {loadingApps ? (
              <p>Loading deleted apps...</p>
            ) : apps.length === 0 ? (
              <p>No deleted apps found.</p>
            ) : (
              <ul className="space-y-4">
                {apps.map((a) => (
                  <li key={a.id} className="p-4 border rounded flex justify-between items-center">
                    <div>
                      <strong>{a.name}</strong>
                      <p className="text-gray-500">{a.description}</p>
                    </div>
                    <button
                      onClick={() => handleRestore("apps", a.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}