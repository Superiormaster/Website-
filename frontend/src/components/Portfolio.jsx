// src/components/Portfolio.jsx
import styles from "../style"
import About from "./section/About"
import Home from "./section/Home"

function Portfolio() {
  return (
    <>
        <div className="bg-black w-full overflow-hidden transition-opacity text-gray-500 duration-700 min-h-screen">
          <div className={`${styles.flexStart} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <Home />
            </div>
          </div>
          
          <div className={`${styles.flexStart} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <div className={`${styles.boxWidth}`}>
              <About />
            </div>
          </div>
        </div>
    </>
  )
}

export default Portfolio