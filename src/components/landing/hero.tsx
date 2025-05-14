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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-black to-purple-950/60 z-0">
        {/* Animated Background Circles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.1) 100%)",
          }}
          initial={false}
          whileInView={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          viewport={{ margin: "-100px" }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(67,56,202,0.1) 90%)",
          }}
          initial={false}
          whileInView={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          viewport={{ margin: "-100px" }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(43,89,219,0.1) 90%)",
          }}
          initial={false}
          whileInView={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          viewport={{ margin: "-100px" }}
        />

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
        <div className="container mx-auto px-8 lg:px-20">
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
                  className="inline-block px-4 py-2 bg-purple-600/20 backdrop-blur-sm rounded-full text-purple-300 text-sm font-semibold mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  New Courses Available!
                </motion.span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 lg:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                    Transform Your Career
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
                    in 2024
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={childVariants}
                className="text-lg lg:text-xl font-medium text-gray-300 mb-8 leading-relaxed max-w-lg"
              >
                Build professional-grade applications with{" "}
                <span className="text-purple-300 font-semibold">
                  React, Next.js, Node.js
                </span>{" "}
                and modern tools. Join{" "}
                <span className="text-indigo-300">10,000+ students</span> who{" "}
                accelerated their careers with us.
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
