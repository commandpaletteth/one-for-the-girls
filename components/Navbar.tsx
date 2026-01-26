'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Logic: ตรวจจับการเลื่อนหน้าจอ
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    
    // 1. ถ้าเลื่อนลงเกิน 150px และเลื่อนลงเรื่อยๆ -> ซ่อน Navbar
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false) // ถ้าเลื่อนขึ้น -> โชว์ Navbar
    }

    // 2. ถ้าเลื่อนลงมาหน่อยนึงแล้ว (> 50px) -> เปลี่ยนพื้นหลังให้ทึบขึ้น
    if (latest > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} // Animation นุ่มๆ แบบ Apple
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-6'
      }`}
    >
      <div 
        className={`
          flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
          ${scrolled 
            ? 'w-[90%] md:w-[60%] bg-white/85 backdrop-blur-md shadow-lg border border-[#B85C5C]/10' 
            : 'w-[95%] bg-transparent border border-transparent'
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-[#B85C5C] tracking-tight hover:opacity-80 transition-opacity">
          One for the Girls
        </Link>
        
        {/* Menu (Desktop) */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${scrolled ? 'text-[#6B5B5B]' : 'text-[#6B5B5B]'}`}>
          <Link href="#who-we-are" className="hover:text-[#B85C5C] transition-colors relative group">
            Who we are
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B85C5C] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#memories" className="hover:text-[#B85C5C] transition-colors relative group">
            Memories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B85C5C] transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#upcoming" className="hover:text-[#B85C5C] transition-colors relative group">
            Upcoming
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B85C5C] transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* CTA Button */}
        <a 
          href="https://www.instagram.com/oneforthegirls.official/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#B85C5C] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#9E4F4F] hover:shadow-md transition-all"
        >
          <Instagram size={16} />
          <span className="hidden sm:inline">Join Us</span>
        </a>
      </div>
    </motion.nav>
  )
}