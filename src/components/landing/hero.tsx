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

export default function ImprovedHeroLand() {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col overflow-hidden pt-25 lg:pt-16"
      viewport={{ margin: "-100px", once: false }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-purple-950/90 z-0">
        {/* Mobile Hero Image */}
        <motion.div
          className="lg:hidden absolute inset-0 flex items-center justify-center opacity-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          viewport={{ margin: "-100px" }}
        >
          <Image
            src={Heroimage}
            alt="Learning illustration"
            className="w-[250px] h-[250px] object-contain"
            placeholder="blur"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center relative z-10">
        <div className="container mx-auto px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: "-100px" }}
              className="w-full lg:w-1/2 text-left lg:pr-12 mb-12 lg:mb-0 relative z-20"
            >
              <motion.div variants={childVariants} className="relative">
                <motion.span
                  className="inline-flex items-center gap-2 px-2 py-2 bg-white/10 backdrop-blur-md rounded-full text-gray-300 mb-4 text-sm font-bold shadow-lg ring-1 ring-white/20 transition duration-300"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-purple-700 rounded-full shadow-md">
                    New
                  </span>
                  Courses Available!
                </motion.span>

                <h1 className="text-5xl lg:text-8xl font-extrabold mb-4 lg:mb-6 leading-tight">
                  <span className="bg-gradient-to-r text-white">
                    Build web from scratch
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={childVariants}
                className="text-lg lg:text-xl font-base text-gray-300 mb-8 leading-relaxed max-w-lg"
              >
                Build professional-grade applications with React, Next.js,
                Node.js and modern tools. Join 10,000+ students who accelerated
                their careers with us.
              </motion.p>

              <motion.div
                variants={childVariants}
                className="flex flex-col sm:flex-row gap-4 lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-auto py-3 px-4 bg-purple-900 hover:bg-purple-800 rounded-lg text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                >
                  Join course
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-auto py-3 px-4 bg-white rounded-lg font-bold shadow-lg shadow-gray-500/20 hover:shadow-gray-500/40 transition-all"
                >
                  See course
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Desktop Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.4,
                },
              }}
              animate={{
                y: [-5, 5, -5],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              viewport={{ margin: "-100px" }}
              className="w-full lg:w-1/2 justify-center items-center hidden lg:flex relative z-10"
            >
              <div className="relative">
                <Image
                  src={Heroimage}
                  alt="Learning illustration"
                  className="w-full h-auto object-contain max-w-xl drop-shadow-2xl"
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
