'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'

const HOSPITAL_IMAGES = [
  {
    src: '/images/hospital/hospital.jpg',
    alt: 'Entrada do hospital',
  },
  {
    src: '/images/hospital/hospital2.jpg',
    alt: 'Facilidades modernas do hospital',
  },
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % HOSPITAL_IMAGES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextImage, 5000)
    return () => clearInterval(timer)
  }, [nextImage])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]">
      {/* Overlay escuro */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#0A1628]/70 via-[#0F2240]/55 to-[#0A1628]/70" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A1628]/40 via-transparent to-[#0A1628]/40" />

      {/* Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={HOSPITAL_IMAGES[currentImage].src}
            alt={HOSPITAL_IMAGES[currentImage].alt}
            fill
            className="object-cover"
            priority={currentImage === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {HOSPITAL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentImage
                ? 'w-8 bg-blue-400'
                : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-20 pt-24 pb-16 md:pt-0 md:pb-0">
        <div className="grid items-center gap-12 md:min-h-screen md:grid-cols-2 md:gap-16 lg:gap-24">
          
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-8 md:pt-0"
          >
            {/* Badge removed per request */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-6 text-center text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-[60px] lg:text-[72px]"
            >
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent"></span> Sua visão
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-10 max-w-md text-base leading-relaxed text-white/60 md:text-lg mx-auto text-center"
            >
              Consultas e atendimento de saúde de qualidade com equipamentos modernos 
              e especialistas dedicados ao cuidado de toda a comunidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col gap-4 sm:flex-row justify-center"
            >
              <Link
                href="/agendar"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Agendar Consulta</span>
                <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#stats"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-7 py-4 text-base font-semibold text-white/70 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
              >
                Conhecer Resultados
                <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Empty space for balance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative hidden md:flex md:items-center md:justify-center"
          >
            {/* Space for layout balance */}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 h-32 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />
    </section>
  )
}