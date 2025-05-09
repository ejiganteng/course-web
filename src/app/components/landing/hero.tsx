// HeroLand.jsx
'use client'

import { motion } from 'framer-motion'
import { SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/solid'

export default function HeroLand() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background hitam dominan */}
      <div className="absolute inset-0 bg-black">
        {/* Pola grid transparan */}
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:40px_40px]"></div>

        {/* Efek cahaya redup untuk kedalaman */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 w-full h-full bg-purple-600/3 blur-[80px] rounded-full -translate-x-1/2"></div>
          <div className="absolute top-3/4 left-1/4 w-full h-full bg-indigo-600/2 blur-[80px] rounded-full -translate-x-1/2"></div>
        </div>
      </div>

      {/* Blob animasi (lebih transparan) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: [0.8, 1.05, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-700 rounded-full filter blur-3xl"
      ></motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: [1.05, 0.8, 1.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl"
      ></motion.div>

      {/* Konten utama */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge dengan efek glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-black/40 border border-purple-800/20 backdrop-blur-sm shadow-lg shadow-purple-500/5"
          >
            <SparklesIcon className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
            <span className="text-purple-300 font-medium">Platform Belajar Terbaik</span>
          </motion.div>

          {/* Judul utama dengan efek gradasi */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transformasi Karier Anda dengan Kursus Berkualitas
          </motion.h1>

          {/* Deskripsi */}
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Pelajari keterampilan terkini dari mentor profesional di berbagai bidang teknologi dan bisnis dengan platform pembelajaran interaktif kami
          </motion.p>

          {/* Tombol aksi */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center justify-center group"
            >
              Mulai Belajar
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg text-gray-950 font-medium bg-white hover:bg-white transition-all flex items-center justify-center"
            >
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Lihat Kursus
            </motion.button>
          </motion.div>

          {/* Statistik pengguna */}
          <motion.p 
            className="mt-12 text-sm text-gray-500 flex items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
            Bergabung dengan 15.000+ siswa yang telah meningkatkan karier mereka
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}