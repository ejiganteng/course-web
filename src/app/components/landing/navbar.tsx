'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/solid'

export default function NavbarLand() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '-100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mx-6 lg:mx-9 mt-5 rounded-3xl py-4 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-gray-200'
      }`}
    >
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <AcademicCapIcon className="w-8 h-8 text-purple-700" />
            <span className="ml-2 text-xl lg:text-2xl font-bold text-gray-800">CoursePlatform</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['Beranda', 'Kursus', 'Tentang', 'Kontak'].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gray-600 font-bold hover:text-purple-700 transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 font-bold bg-gray-950 rounded-lg text-white shadow-lg shadow-gray-500/20 hover:shadow-gray-500/40 transition-all"
            >
              Masuk
            </motion.button>
          </div>
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-purple-700 transition-colors bg-white/50 backdrop-blur-sm"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-md z-50 shadow-xl p-6 flex flex-col space-y-6"
          >
            <div className="pt-2">
              {['Beranda', 'Kursus', 'Tentang', 'Kontak'].map((item, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="block py-3 font-bold px-4 text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                  whileHover={{ x: 10 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gray-950 rounded-lg text-white font-medium shadow-lg shadow-gray-500/20 hover:shadow-gray-500/40 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}