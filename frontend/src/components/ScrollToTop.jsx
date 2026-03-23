// src/components/ScrollToTop.jsx

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { FaArrowUp, FaWhatsapp } from "react-icons/fa"

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  // Show button when scrolling
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll button click
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <>
            {/* WhatsApp Button */}
      <a
        href="https://wa.me/message/HMRDIQNTEU6JK1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white p-4 z-50 rounded-full shadow-lg transition"
      >
        <FaWhatsapp size={20} />
      </a>

      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 z-50 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  )
}