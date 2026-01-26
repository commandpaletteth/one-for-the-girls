import Link from 'next/link'
import { ArrowRight, Heart, Calendar, Sparkles, Instagram, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar' // เรียก Navbar จากโฟลเดอร์ components หน้าบ้าน

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F5] font-sans selection:bg-[#B85C5C]/20 selection:text-[#B85C5C]">
      
      {/* Navbar */}
      <Navbar />

      {/* === Hero Section === */}
      <section className="relative pt-32 pb-20 px-4 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8C4C4] shadow-sm mb-6 animate-fade-in">
                <Sparkles className="w-3 h-3 text-[#B85C5C]" />
                <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#B85C5C] uppercase">
                  Bangkok's Community for Women
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif text-[#4A4A4A] leading-[1.1] mb-6 tracking-tight">
                Connect. <span className="text-[#B85C5C] italic">Inspire.</span> <br />
                Grow Together.
              </h1>
              
              <p className="text-lg text-[#6B5B5B] font-light leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                A sophisticated space for Expats and Thai women to find friendship and joy through curated activities.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a 
                  href="https://www.instagram.com/oneforthegirls.official/"
                  target="_blank"
                  className="h-12 px-8 rounded-full bg-[#B85C5C] text-white flex items-center justify-center gap-2 hover:bg-[#9E4F4F] transition-all shadow-lg hover:shadow-[#B85C5C]/20 font-medium"
                >
                  Join Community <ArrowRight size={16} />
                </a>
                <button className="h-12 px-8 rounded-full border border-[#D4A373]/30 bg-white/50 text-[#8C6B4A] hover:bg-white transition-colors font-medium">
                  View Events
                </button>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative z-10 mt-8 lg:mt-0">
              <div className="relative aspect-[4/5] md:aspect-square w-full max-w-md mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=1969&auto=format&fit=crop" 
                  alt="Women Gathering" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === Memories Section === */}

     <section id="memories" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#4A4A4A] mb-4">Beautiful Memories</h2>
            <p className="text-[#6B5B5B] font-light">Snapshots from our past gatherings.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Picnic in the Park", 
                date: "Jan 2026", 
                // รูปใหม่: กลุ่มเพื่อนผู้หญิงนั่งคุยกันในสวน (รูปเดียวกับ Hero ที่พี่ชอบ แต่ crop คนละมุม)
                img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop" 
              },
              { 
                title: "Padel Tennis", 
                date: "Dec 2025", 
                // รูปใหม่: ผู้หญิงถือไม้แร็กเก็ตในสนาม (เห็นหน้า เห็นไม้ ชัดเจน)
                img: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop" 
              },
              { 
                title: "Dream Board Workshop", 
                date: "Nov 2025", 
                // รูปใหม่: ผู้หญิงยืนแปะ Post-it/รูปภาพ บนผนัง (ฟีล Vision Board Workshop จริงๆ)
                img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop" 
              }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                {/* Card Image Container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-md">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                  
                  <img 
                    src={item.img} 
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-20">
                    <Calendar className="w-3 h-3 text-[#B85C5C]" />
                    <span className="text-[10px] font-bold text-[#6B5B5B] uppercase">{item.date}</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif text-[#4A4A4A] group-hover:text-[#B85C5C] transition-colors">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="bg-[#FAF7F5] border-t border-[#E8C4C4]/20 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-[#B85C5C] mb-6">One for the Girls</h2>
          <div className="flex justify-center gap-4 mb-8">
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A4A4A] hover:bg-[#B85C5C] hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
            </a>
          </div>
          <p className="text-[#6B5B5B] text-sm mb-2 font-light">Bangkok, Thailand</p>
          <div className="text-[10px] text-[#6B5B5B]/40 uppercase tracking-widest">
            Crafted by Command & Palette
          </div>
        </div>
      </footer>
    </div>
  )
}