"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Custom hook untuk counter animation
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / duration * 10;

    const timer = setInterval(() => {
      start += increment;
      setCount(Math.min(Math.ceil(start), end));
      if (start >= end) clearInterval(timer);
    }, 10);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}

export default function AnimatedCounter() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { id: 1, value: useCounter(3556), label: "Member", suffix: "+" },
    { id: 2, value: useCounter(13), label: "Kelas", suffix: "+" },
    { id: 3, value: useCounter(29), label: "Durasi (jam)", suffix: "+" },
    { id: 4, value: useCounter(720), label: "Materi", suffix: "+" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="h-fit bg-white flex items-center justify-center p-4">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-4xl w-full"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <p className="text-lg font-semibold text-purple-600 mb-4">
            We are going to the top together
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrading Creative
            <br />
            Skills Platform
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {stat.value}
                  <span className="text-3xl">{stat.suffix}</span>
                </div>
                <div className="text-lg text-gray-600 font-medium">
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