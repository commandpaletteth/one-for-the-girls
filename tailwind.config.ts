import type { Config } from "tailwindcss";

const config: Config = {
  // ✅ ส่วน Content เหมือนเดิม ถูกต้องแล้ว
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ✅ 1. ตั้งค่า Font ให้ตรงกับ layout.tsx (Inter + Playfair)
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      
      // ✅ 2. ใส่สี Rosegold Theme ลงไปตรงๆ (ไม่ต้องพึ่ง globals.css)
      // แบบนี้รับรองสีมาแน่นอน ไม่เพี้ยน
      colors: {
        background: "#FAF7F5", // สีครีมพื้นหลัง
        foreground: "#4A4A4A", // สีตัวหนังสือหลัก (เทาเข้ม)
        primary: {
          DEFAULT: "#B85C5C", // Rosegold หลัก
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D4A373", // สีทองตุ่นๆ รอง
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#556B2F", // สีเขียวใบไม้
          foreground: "#FFFFFF",
        },
        muted: "#6B5B5B", // สีเทาอ่อนสำหรับตัวหนังสือรอง
        border: "#E8C4C4", // สีขอบชมพูอ่อน
      },

      // ✅ 3. เพิ่ม Animation ที่ผมเขียนไว้ในโค้ดหน้าเว็บ (กัน error)
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite", // อันนี้เอามาจาก C&P ให้ด้วย
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  // ❌ ลบ plugin ออกก่อน เพราะเรายังไม่ได้ลง tailwindcss-animate เดี๋ยว error
  plugins: [], 
};
export default config;