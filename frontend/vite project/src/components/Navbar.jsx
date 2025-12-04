// src/components/Navbar.jsx
import { useState } from "react"
import { close, logo, head, menu } from '../assets'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { navLinks } from "../constants"

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar top-0 w-full z-30 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <img src={ head } alt="Superior" className="w-[124px]" />
         <h1 className="text-2xl font-bold tracking-tight">SM Int'l</h1>
      </div>
      
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>
      
      <ul className="list-none sm:flex hidden justify-end items-center flex-1 md:flex gap-8 text-white font-medium">
          <li><a href="#hero">Home</a></li>
          <li><a href="./Portfolio">Portfolio</a></li>
          <li><a href="./Apps">Apps</a></li>
          <li><a href="./Website">Website</a></li>
        </ul>

        {open && (
          <ul className="absolute top-16 right-10 w-[100px] bg-white p-6 text-black flex flex-col gap-4 border-t">
            <li><a href="#hero">Home</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="./Apps">Apps</a></li>
            <li><a href="./Website">Website</a></li>
          </ul>
        )}
    </nav>
  );
}