// src/components/Apps.jsx
export default function Apps({ apps }) {
  return (
    <section id="apps" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">My Mobile Apps</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition">
              <img src={`http://127.0.0.1:5000/static/uploads/${app.image}`} alt={app.name} className="w-full h-52 object-cover rounded-t-2xl" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold">{app.name}</h3>
                <p className="text-gray-600 mt-2">{app.description}</p>
                <a href={app.download_url} className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Download App</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
