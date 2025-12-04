// src/components/Hero.jsx
import { motion } from "framer-motion"
import { MyImage } from '../assets'
import Contact from "./section/Contact"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white py-28 px-20">
      <div className="">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Hi — I build{" "} 
            <span className="text-cyan-300">Scalable</span> &{" "} <span className="text-cyan-300">Beautiful</span> Website, Webapp and Mobile Apps.
          </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto mt-6 text-lg text-indigo-100">
            I'm a focused developer. I create high-performance web apps and mobile apps with HTML, CSS, JS, React.js, reactnative, Tailwindcss, Flask, Django and Python.
            My Work focuses on speed, responsiveness, clean UI and real world functionality. Below are a few projects and apps I've shipped.
        </motion.p>
         <div className="mt-10 flex flex-wrap gap-4">
            <a href="./Portfolio" className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">View Portfolio</a>
            <a href={ Contact } className="px-6 py-3 border border-white/40 rounded-xl hover:bg-white/10 transition">Contact Me</a>
          </div>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={ MyImage }
          alt="Developer"
          className="w-full rounded-3xl max-w-md shadow-2xl"
        />
        </motion.div>
      </div>
    </section>
  );
}
