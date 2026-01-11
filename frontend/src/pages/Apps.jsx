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

  // Load recent apps from dashboard
  useEffect(() => {
    api.get("/admin/dashboard")
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
      const res = await api.post("/admin/apps", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApps([res.data, ...apps]);
      setName("");
      setDescription("");
      setDownloadUrl("");
      setWebUrl("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create app");
    }
  };

  const deleteApp = async (id) => {
    try {
      await api.delete(`/admin/apps/${id}`);
      setApps(apps.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete app");
    }
  };
  
  const [preview, setPreview] = useState(null);

  return (
    <AdminLayout>
      <div className="bg-gray-900 overflow-hidden space-y-6 border border-rose-100 max-w-4xl mx-auto px-6 py-4 text-center">
        <h1 className="text-4xl text-center font-bold font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Apps</h1>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-lg mb-4 border border-gray-700"
          />
        )}
        <input className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="App name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border h-34 rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Download URL"
          value={downloadUrl}
          onChange={e => setDownloadUrl(e.target.value)}
        />
        <input className="w-full mb-2 py-3 px-4 border-white/10 bg-white/10 border rounded text-white transition focus:outline-none focus:bg-blue-500/5 focus:border-blue-500"
          placeholder="Web URL"
          value={webUrl}
          onChange={e => setWebUrl(e.target.value)}
        />
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            className="mb-4 px-6 block py-3 rounded border border-gray-600 text-white"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition w-full relative font-medium overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(50,130,246,0.4)]" onClick={createApp}>Create App</button>
      </div>
    </AdminLayout>
  );
}