// src/App.jsx
import styles from "./style"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Footer from "./components/Footer"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="bg-black w-full overflow-hidden">
          <div className={`${styles.paddingX} ${styles.flexCenter} bg-gray-50 dark:bg-gray-900 text-white`}>
            <div className={`${styles.boxWidth}`}>
              <Navbar />
            </div>
          </div>
          
          <div className={`${styles.flexStart} text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <Hero />
            </div>
          </div>
          
          <div className={`${styles.paddingX} ${styles.flexStart} text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
               <Footer />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App

