'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Instagram, Menu, X } from 'lucide-react' // เพิ่ม icon Menu และ X

export default function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State สำหรับเปิด/ปิดเมนูมือถือ

  // Logic: ตรวจจับการเลื่อนหน้าจอ
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
      setIsMobileMenuOpen(false) // ถ้าเลื่อนลง ให้ปิดเมนูมือถือด้วย
    } else {
      setHidden(false)
    }

    if (latest > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  // เมนูที่เราใช้ร่วมกัน
  const menuItems = [
    { name: "Who we are", href: "#who-we-are" },
    { name: "Memories", href: "#memories" },
    { name: "Upcoming", href: "#upcoming" },
  ]

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-6'
        }`}
      >
        <div 
          className={`
            flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
            ${scrolled || isMobileMenuOpen // ถ้าเปิดเมนูมือถือ ก็ให้พื้นหลังทึบด้วย
              ? 'w-[95%] md:w-[60%] bg-white/90 backdrop-blur-md shadow-lg border border-[#B85C5C]/10' 
              : 'w-[95%] bg-transparent border border-transparent'
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-[#B85C5C] tracking-tight hover:opacity-80 transition-opacity">
            One for the Girls
          </Link>
          
          {/* --- Desktop Menu (ซ่อนในมือถือ) --- */}
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${scrolled ? 'text-[#6B5B5B]' : 'text-[#6B5B5B]'}`}>
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-[#B85C5C] transition-colors relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B85C5C] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop Only) */}
          <a 
            href="https://www.instagram.com/oneforthegirls.official/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#B85C5C] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#9E4F4F] hover:shadow-md transition-all"
          >
            <Instagram size={16} />
            <span className="inline">Join Us</span>
          </a>

          {/* --- Mobile Hamburger Button (แสดงเฉพาะมือถือ) --- */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#4A4A4A] p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* --- Mobile Menu Overlay (ส่วนที่เพิ่มมา) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#FAF7F5] pt-32 px-6 md:hidden flex flex-col items-center gap-8"
          >
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // กดแล้วปิดเมนู
                className="text-2xl font-serif text-[#4A4A4A] hover:text-[#B85C5C] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            <a 
              href="https://www.instagram.com/oneforthegirls.official/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 bg-[#B85C5C] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#9E4F4F] transition-all shadow-lg"
            >
              <Instagram size={20} />
              Join Community
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}