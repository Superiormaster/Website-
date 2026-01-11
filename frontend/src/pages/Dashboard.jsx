import { useEffect, useState } from "react"
import api from "@/services/api"
import StatCard from "@/dashboard-files/StatCard"
import Skeleton from "@/dashboard-files/Skeleton"
import DateFilter from "@/dashboard-files/DateFilter"
import AdminLayout from "../portfolio_admin/AdminLayout"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("7"); // default 7 days
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [activity, setActivity] = useState([]); 
  const [apps, setApps] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch dashboard counts and recent items
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard data.");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch chart data whenever range changes
  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoadingChart(true);
        const res = await api.get(`/admin/analytics/messages?days=${range}`);
        setChartData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChart(false);
      }
    };
    fetchChart();
  }, [range]);
  
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [appsRes, projectsRes] = await Promise.all([
          api.get("/admin/apps"),
          api.get("/admin/projects"),
        ]);
  
        console.log("APPS RAW RESPONSE:", appsRes.data);
        console.log("PROJECTS RAW RESPONSE:", projectsRes.data);

        setApps(Array.isArray(appsRes.data.apps) ? appsRes.data.apps : []);
        setProjects(Array.isArray(projectsRes.data.projects) ? projectsRes.data.projects : []);
      } catch (err) {
        console.error("Failed to load apps/projects", err)
        alert("Failed to load apps or projects")
      }
    };
  
    fetchLists();
  }, []);
  
  const deleteApp = async (id) => {
    if (!confirm("Delete this app?")) return;
    await api.delete(`/admin/apps/${id}`);
    setApps(prev => prev.filter(a => a.id !== id));
  };
  
  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/admin/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Export CSV safely
  const handleExportCSV = async () => {
    try {
      const res = await api.get("/admin/export/messages/csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", "messages.csv");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV.");
    }
  };

  if (loadingStats || !stats?.counts) {
    return (
      <AdminLayout>
        <Skeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-[#0b0f14] text-gray-200 md:p-6 space-y-8 max-w-6xl mx-auto px-6 py-4 overflow-hidden border border-rose-100">

        {/* Header */}
        <div className="flex gap-2 flex-col text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 mb-8 text-center">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Overview of system activity and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 justify-center lg:grid-cols-4 gap-6">
          <StatCard title="Projects" value={stats.counts.projects} />
          <StatCard title="Apps" value={stats.counts.apps} />
          <StatCard title="Messages" value={stats.counts.messages} />
          <StatCard title="Active Users" value={stats.counts.users ?? "—"} />
        </div>

        {/* Recent Projects */}
        <Section title="Recent Projects">
          <ul className="space-y-2">
            {stats.recent_projects.map(p => (
              <li key={p.id} className="text-gray-300">{p.title}</li>
            ))}
          </ul>
        </Section>

        {/* Recent Apps */}
        <Section title="Recent Apps">
          <ul className="space-y-2">
            {stats.recent_apps.map(a => (
              <li key={a.id} className="text-gray-300">
                <span className="font-medium text-white">{a.name}</span>{" "} — {a.description?.slice(0, 50)}...
              </li>
            ))}
          </ul>
        </Section>

        {/* Recent Messages */}
        <Section title="Recent Messages">
          <ul className="space-y-2">
            {stats.recent_messages.map(m => (
              <li key={m.id} className="text-gray-300">
                <span className="font-medium text-white">{m.email}</span>{" "} — {m.message.slice(0, 50)}...
              </li>
            ))}
          </ul>
        </Section>

        <Section title="All Apps">
          <ul className="space-y-4">
            {apps.map(a => (
              <li key={a.id} className="bg-gray-900 p-4 rounded border border-white/10">
                <strong className="text-white">{a.name}</strong>
                {a.description && <p className="text-gray-400 text-sm">{a.description}</p>}
        
                <div className="flex gap-3 mt-2 text-sm">
                  {a.download_url && <a href={a.download_url} target="_blank" className="text-blue-400">Download</a>}
                  {a.web_url && <a href={a.web_url} target="_blank" className="text-cyan-400">Web</a>}
                </div>
        
                <button
                  onClick={() => deleteApp(a.id)}
                  className="mt-2 text-red-400 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </Section>
        <p className="text-red-400">Apps count: {apps.length}</p>
<p className="text-red-400">Projects count: {projects.length}</p>
        <Section title="All Projects">
          <ul className="space-y-4">
            {projects.map(p => (
              <li key={p.id} className="bg-gray-900 p-4 rounded border border-white/10">
                <strong className="text-white">{p.title}</strong>
                {p.description && <p className="text-gray-400 text-sm">{p.description}</p>}
        
                <div className="flex gap-3 mt-2 text-sm">
                  {p.live_url && <a href={p.live_url} target="_blank" className="text-emerald-400">Live</a>}
                  {p.github_url && <a href={p.github_url} target="_blank" className="text-purple-400">GitHub</a>}
                </div>
        
                <button
                  onClick={() => deleteProject(p.id)}
                  className="mt-2 text-red-400 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {/* Messages Analytics */}
        <Section title="Messages Analytics">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-300">Showing last {range} days</p>
            <DateFilter value={range} onChange={setRange} />
          </div>
          <div className="w-full h-[320px]">
            {loadingChart ? (
              <Skeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis allowDecimals={false} stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", color: "#fff", border: "1px solid #1f2933" }} />
                  <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Section>
        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-500"
        >
          Export Messages CSV
        </button>
      </div>
    </AdminLayout>
  );
}

// Simple card component
function Card({ title, value }) { 
  return (
    <div className="bg-gray-900 p-6 text-center border border-white/10 rounded-xl shadow-lg">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

// Reusable Section component
function Section({ title, children }) {
  return (
    <div className="bg-[#111827] p-6 mb-6 rounded-xl border border-white/10 xl:col-span-2">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}