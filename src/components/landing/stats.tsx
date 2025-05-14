"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Custom hook untuk counter animation dengan reset
function useCounter(
  end: number,
  duration: number = 2000,
  startCounting: boolean
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    setCount(0); // Reset counter setiap kali mulai menghitung
    let start = 0;
    const increment = end / (duration / 10);

    const timer = setInterval(() => {
      start += increment;
      const currentCount = Math.min(Math.ceil(start), end);
      setCount(currentCount);
      if (currentCount >= end) clearInterval(timer);
    }, 10);

    return () => clearInterval(timer);
  }, [end, duration, startCounting]);

  return count;
}

export default function AnimatedCounter() {
  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  const stats = [
    { id: 1, value: useCounter(3556, 2000, inView), label: "Member", suffix: "+" },
    { id: 2, value: useCounter(13, 2000, inView), label: "Class", suffix: "+" },
    { id: 3, value: useCounter(29, 2000, inView), label: "Duration (Hour)", suffix: "+" },
    { id: 4, value: useCounter(720, 2000, inView), label: "Content", suffix: "+" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6 
      },
    },
  };

  return (
    <div className="h-fit bg-white flex items-center justify-center p-8">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-6xl w-full px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center my-12 lg:my-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Upgrading Creative
            <br className="hidden sm:block" />
            Skills Platform
          </motion.h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 gap-y-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="flex-1 basis-[45%] sm:basis-[30%] lg:basis-auto min-w-[200px]"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center flex flex-col items-center p-4 sm:p-6 lg:p-8">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-500 mb-2">
                  {stat.value}
                  <span className="text-2xl sm:text-3xl lg:text-4xl">{stat.suffix}</span>
                </div>
                <div className="text-base sm:text-lg lg:text-xl text-gray-500 font-semibold">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}