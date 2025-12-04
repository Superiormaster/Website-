// src/sections/Contact.jsx
export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
        <p className="text-gray-600 text-lg mb-8">
          For collaborations, freelance work, or project inquiries — reach out anytime.
        </p>

        <a
          href="mailto:ejeziepaschal@gmail.com"
          className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          Send Email
        </a>
      </div>
    </section>
  );
}