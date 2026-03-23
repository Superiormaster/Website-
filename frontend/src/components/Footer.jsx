// src/components/Footer.jsx

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <>
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">Paschal</h2>
          <p className="text-sm mt-3">
            Full-stack developer building scalable web applications with
            React, Flask, and modern technologies. Available for freelance
            projects and long-term contracts.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Web Application Development</li>
            <li>Frontend Development</li>
            <li>Backend APIs (Flask / Django)</li>
            <li>Startup MVP Development</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/projects" className="hover:text-white">Projects</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact / CTA */}
        <div>
          <h3 className="text-white font-semibold mb-3">Hire Me</h3>
          <p className="text-sm mb-3">
            Have a project in mind? Let's work together.
          </p>

          <a
            href="mailto:ejeziepaschal@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Contact Me
          </a>

          <div className="flex gap-4 mt-4 text-lg">
            <a href="https://www.linkedin.com/in/ejezie-mary-johnpaul-439825320/?lipi=urn%3Ali%3Apage%3Ap_mwlite_my_network%3B5%2Fm%2BOiD7QMmMhA5UidXQcA%3D%3D"><FaLinkedin /></a>
            <a href="https://x.com/SMprogra"><FaTwitter /></a>
            <a href="mailto:ejeziepaschal@gmail.com"><FaEnvelope /></a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center text-sm py-4">
        © {new Date().getFullYear()} Paschal. Built with React & Flask.
      </div>
    </footer>
    </>
  );
}