"use client";

import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  RocketLaunchIcon,
  AcademicCapIcon
} from "@heroicons/react/24/solid";

export default function HeroLand() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden lg:py-8 px-7 pt-24 md:pt-28">
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-10 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          <AcademicCapIcon className="w-64 h-64 md:w-96 md:h-96 text-indigo-400" />
        </motion.div>
      </motion.div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10 mt-10 lg:mt-30">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 text-center lg:text-left lg:pr-8 mb-8 lg:mb-0"
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6 lg:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Transformasi Karier Anda dengan Kursus Berkualitas
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-gray-300 mb-6 lg:mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Pelajari keterampilan terkini dari mentor profesional di berbagai
              bidang teknologi dan bisnis dengan platform pembelajaran
              interaktif kami
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center justify-center group w-full sm:w-auto"
              >
                Mulai Belajar
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-gray-950 font-bold bg-white hover:bg-white transition-all flex items-center justify-center w-full sm:w-auto"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Lihat Kursus
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-full lg:w-1/2 justify-center items-center hidden lg:flex"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AcademicCapIcon className="w-64 h-64 text-indigo-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
