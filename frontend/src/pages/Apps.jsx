import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../portfolio_admin/AdminLayout";

export default function Apps() {
  const [apps, setApps] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Load recent apps
  useEffect(() => {
    api.get("/api/admin/dashboard")
      .then(res => setApps(res.data.recent_apps || []))
      .catch(err => console.error(err));
  }, []);

  const createApp = async () => {
    if (!name) return alert("App name is required");

    const form = new FormData();
    form.append("name", name);
    form.append("description", description);
    form.append("download_url", downloadUrl);
    form.append("web_url", webUrl);
    if (imageFile) form.append("image", imageFile);

    try {
      const res = await api.post("/api/admin/apps", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApps([res.data, ...apps]);
      setName("");
      setDescription("");
      setDownloadUrl("");
      setWebUrl("");
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create app");
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-900 min-h-screen py-3 px-6 sm:px-12 lg:px-24 space-y-6">
        <h1 className="text-5xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
          Apps
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
          placeholder="App name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          className="w-full mb-2 py-3 px-4 h-36 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Download URL"
          value={downloadUrl}
          onChange={e => setDownloadUrl(e.target.value)}
        />
        <input
          className="w-full mb-4 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Web URL"
          value={webUrl}
          onChange={e => setWebUrl(e.target.value)}
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
                const file = e.target.files[0];
                setImageFile(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>

        <button
          className="w-full px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:shadow-xl"
          onClick={createApp}
        >
          Create App
        </button>
      </div>
    </AdminLayout>
  );
}