// src/components/Apps.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import RevealOnScroll from "./RevealOnScroll"
import API from "@/api"

export default function Apps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  useEffect(() => {
    API.get("/portfolio/apps")
      .then(res => {
        setApps(res.data.items ?? res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load apps:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="apps" className="py-24 bg-gray-500 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">My Mobile Apps</h2>

        {loading && (
          <p className="text-gray-400 text-center">
            Loading apps...
          </p>
        )}

        {!loading && apps.length === 0 ? (
          <p className="text-gray-600 font-medium text-center">No Apps available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {apps.map((app) => (
              <div
                key={app.id}
                className="bg-gray-700 rounded-2xl shadow hover:shadow-lg transition"
              >
                {/* Image */}
                {app.image ? (
                  <div className="flex justify-center">
                    <img
                      src={`http://127.0.0.1:5000/api/admin/uploads/${app.image}`}
                      alt={app.title}
                      className="w-full h-52 object-cover rounded-t-2xl mb-4"
                    />
                  </div>
                ) : (
                  <div className="w-full h-52 bg-gray-200 rounded-t-2xl" />
                )}

                <div className="p-6">
                  <h3 className="text-center text-2xl font-semibold">{app.name}</h3>
                  <p className="text-center text-gray-500 mt-2">{app.description}</p>

                  <div className="mt-4 space-x-4 flex justify-center">
                    {app.download_url && (
                      <a
                        href={app.download_url}
                        target="_blank"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Download
                      </a>
                    )}

                    {app.web_url && (
                      <a
                        href={app.web_url}
                        target="_blank"
                        className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}