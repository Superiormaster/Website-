import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Portfolio from "./components/Portfolio"
import Website from "./components/Website"
import Apps from "./components/Apps"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Website />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Hero />
            <Apps />
            <Contact />
            <Footer />
        </div>
      </BrowserRouter>
    </>
}

export default App
