"use client";

import Image from "next/image";
import Heroimage from "@/app/public/home-five-img.png";
import { motion, Variants } from "framer-motion";
import { ArrowRightIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const statsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
export default function ImprovedHeroLand() {

  return (
    <motion.section 
      className="relative min-h-screen flex flex-col overflow-hidden pt-25 lg:pt-20 xl:pt-24"
      viewport={{ margin: "-100px", once: false }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900/80 z-0">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')]" />
        
        <motion.div
          className="absolute -top-20 -left-40 w-[800px] h-[800px] rounded-full opacity-30 blur-[100px]"
          style={{ background: "linear-gradient(45deg, #4f46e5, #9333ea)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Mobile Image */}
        <motion.div
          className="lg:hidden absolute inset-0 flex items-center justify-center opacity-30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={Heroimage}
            alt="Learning illustration"
            className="w-[320px] h-[320px] object-contain"
            placeholder="blur"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center relative z-10">
        <div className="container mx-auto px-5 lg:px-20 xl:px-24">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
            {/* Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: "-100px" }}
              className="w-full lg:w-1/2 text-left lg:pr-12 relative z-20"
            >
              <motion.div variants={childVariants} className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-5 lg:mb-7 text-white leading-[1.15]">
                  <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                    Master Web Development
                  </span>
                  <span className="block mt-3 lg:mt-5 text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-300">
                    From Zero to Professional
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={childVariants}
                className="text-lg lg:text-xl font-medium text-gray-300/90 mb-10 lg:mb-12 leading-relaxed max-w-xl"
              >
                Dive into comprehensive learning with industry experts, real-world projects, and career-focused curriculum designed for the modern developer.
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={childVariants}
                className="flex flex-col sm:flex-row gap-4 lg:gap-5"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold transition-all flex items-center justify-center group w-full sm:w-auto shadow-lg hover:shadow-purple-500/30"
                >
                  <span className="tracking-wide">Start Learning</span>
                  <motion.span className="inline-block ml-3" whileHover={{ x: 5 }}>
                    <ArrowRightIcon className="w-6 h-6 transition-transform" />
                  </motion.span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold bg-white/5 backdrop-blur-lg border border-white/10 transition-all flex items-center justify-center w-full sm:w-auto hover:bg-white/10 hover:border-white/20"
                >
                  <RocketLaunchIcon className="w-6 h-6 mr-2 text-purple-300" />
                  <span className="bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Explore Courses
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Desktop Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="w-full lg:w-1/2 hidden lg:flex items-center justify-end relative z-10"
            >
              <div className="relative w-full max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl rounded-full" />
                <Image
                  src={Heroimage}
                  alt="Learning illustration"
                  className="relative w-full h-auto object-contain"
                  placeholder="blur"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}