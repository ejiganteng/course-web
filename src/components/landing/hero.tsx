"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Heroimage from "@/app/public/home-main-pic.png";
import { motion, Variants } from "framer-motion";
import {
  ArrowRightIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";

// Define types for variants
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

function useCounter(end: number, duration: number = 2000): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number): void => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(percentage * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export default function ImprovedHeroLand() {
  const statsData = [
    {
      id: 'students',
      count: useCounter(12500),
      label: 'Students',
    },
    {
      id: 'courses',
      count: useCounter(150),
      label: 'Courses',
    },
    {
      id: 'hours',
      count: useCounter(1800),
      label: 'Hours Content',
    },
    {
      id: 'certificates',
      count: useCounter(8700),
      label: 'Certificates',
    }
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-black to-purple-950/60 z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.1) 100%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(67,56,202,0.1) 90%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(43,89,219,0.1) 90%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Mobile hero image with improved positioning */}
        <motion.div
          className="lg:hidden absolute inset-0 flex items-center justify-center opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={Heroimage}
            alt="Learning illustration"
            className="w-[250px] h-[250px] object-contain"
            placeholder="blur"
            style={{
              filter: "drop-shadow(0 0 15px rgba(167, 139, 250, 0.25))",
            }}
          />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center relative z-10">
        <div className="container mx-auto px-8 lg:px-20">
          <div className="flex flex-col lg:flex-row">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full lg:w-1/2 text-left lg:pr-12 mb-12 lg:mb-0 relative z-20"
            >
              {/* Main heading with enhanced gradient */}
              <motion.div variants={childVariants} className="relative">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 lg:mb-6 text-white leading-tight">
                  Master Web Development
                  <span className="block mt-2">
                    from scratch
                  </span>
                </h1>
              </motion.div>

              {/* Improved subheading */}
              <motion.p
                variants={childVariants}
                className="text-base lg:text-base font-semibold text-gray-300 mb-8 leading-relaxed max-w-lg"
              >
                Learn the latest skills from professional mentors
                in various fields of technology and business with 
                our interactive learning platform.
              </motion.p>

              {/* Enhanced buttons with better mobile layout */}
              <motion.div
                variants={childVariants}
                className="flex flex-col sm:flex-row gap-4 lg:justify-start"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold transition-all flex items-center justify-center group w-full sm:w-auto"
                >
                  Mulai Belajar
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="inline-block ml-2"
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg font-bold bg-white backdrop-blur-sm transition-all flex items-center justify-center w-full sm:w-auto"
                >
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  View Courses
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Hero image with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="w-full lg:w-1/2 justify-center items-center hidden lg:flex relative z-10"
            >
              <div className="relative">
                  <Image
                    src={Heroimage}
                    alt="Learning illustration"
                    className="w-full h-auto object-contain max-w-md"
                    placeholder="blur"
                    style={{
                      filter: "drop-shadow(0 0 20px rgba(167, 139, 250, 0.3))",
                    }}
                  />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={statsVariants}
        className="relative z-20 mb-8"
      >
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full">
              <div className="grid grid-cols-2 lg:flex lg:justify-between gap-6 lg:gap-0">
                {statsData.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-0">
                      {stat.count.toLocaleString()}+
                    </h3>
                    <p className="text-gray-400 text-lg lg:text-xl">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}