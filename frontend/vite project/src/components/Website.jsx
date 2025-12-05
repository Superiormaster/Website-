// src/components/Website.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import styles from "../style"
import Home from "./section/Home"
import About from "./section/About"
import Projects from "./section/Projects"
import Contact from "./section/Contact"
import Footer from "./Footer"

function Website() {
  return (
    <>
        <div className="bg-black w-full overflow-hidden">
          <div className={`${styles.paddingX} ${styles.flexCenter} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <Home />
            </div>
          </div>
          
          <div className={`${styles.flexStart} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <About />
            </div>
          </div>
         
         <div className={`${styles.flexStart} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <Projects />
            </div>
          </div>
          
          <div className={`${styles.flexStart} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <Contact />
            </div>
          </div>
        </div>
    </>
  )
}

export default Website
  