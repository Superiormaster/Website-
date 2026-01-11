// src/components/Hero.jsx
import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { MyImage } from '../assets'
import { Link } from "react-router-dom"
import Contact from "./section/Contact"

export default function Hero() {
  const controls = useAnimation()
  
  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    })
  }, [controls])
  
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white py-8 px-2 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 text-center md:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Welcome To {" "}
            <span className="text-cyan-300">Superior Master</span> Int'l
          </h1>
          
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto mt-6 text-lg text-indigo-100">
          We build fast, scalable web and mobile applications with clean UI and real-world impact.
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto mt-6 text-lg text-indigo-100">
            Our goal is to deliver exceptional performance and a delightful user experience.
        </motion.p>
        
         <div className="mt-10 flex flex-wrap gap-4 justify-center mb-[20px]">
            <a href="./Portfolio" className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">View Portfolio</a>
            <li className="px-6 py-3 border border-white/40 rounded-xl hover:bg-white/10 transition list-none">
              <Link to="/contact">Contact Me</Link>
              </li>
          </div>
          
        <motion.div className="flex justify-center items-center" animate={controls}>
          <img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={ MyImage }
          alt="Developer"
          className="w-full rounded-3xl max-w-md shadow-2xl"
        />
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
