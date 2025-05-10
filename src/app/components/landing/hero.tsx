"use client";

import Image from "next/image";
import Heroimage from "@/app/public/home-main-pic.png"
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaPython,
  FaAngular,
  FaVuejs,
  FaDocker,
  FaGithub,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiFigma,
  SiMongodb,
  SiLaravel,
  SiPhp,
  SiMysql,
  SiTypescript,
  SiFlutter,
  SiKubernetes,
  SiGraphql,
  SiFirebase,
  SiSpring,
  SiRedux,
  SiGooglecloud,
  SiJavascript,
  SiCss3,
  SiHtml5,
} from "react-icons/si";
import { IconType } from "react-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode, Autoplay } from "swiper/modules";

interface Technology {
  name: string;
  icon: IconType;
  category?: string;
}

const technologies: Technology[] = [
  { name: "React", icon: FaReact, category: "frontend" },
  { name: "Angular", icon: FaAngular, category: "frontend" },
  { name: "Vue.js", icon: FaVuejs, category: "frontend" },
  { name: "Next.js", icon: SiNextdotjs, category: "frontend" },
  { name: "TypeScript", icon: SiTypescript, category: "frontend" },
  { name: "JavaScript", icon: SiJavascript, category: "frontend" },
  { name: "HTML5", icon: SiHtml5, category: "frontend" },
  { name: "CSS3", icon: SiCss3, category: "frontend" },
  { name: "Redux", icon: SiRedux, category: "frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, category: "frontend" },
  { name: "Node.js", icon: FaNodeJs, category: "backend" },
  { name: "Java", icon: FaJava, category: "backend" },
  { name: "Spring", icon: SiSpring, category: "backend" },
  { name: "Python", icon: FaPython, category: "backend" },
  { name: "PHP", icon: SiPhp, category: "backend" },
  { name: "Laravel", icon: SiLaravel, category: "backend" },
  { name: "GraphQL", icon: SiGraphql, category: "backend" },
  { name: "MongoDB", icon: SiMongodb, category: "database" },
  { name: "MySQL", icon: SiMysql, category: "database" },
  { name: "Firebase", icon: SiFirebase, category: "database" },
  { name: "Docker", icon: FaDocker, category: "devops" },
  { name: "Kubernetes", icon: SiKubernetes, category: "devops" },
  { name: "Google Cloud", icon: SiGooglecloud, category: "cloud" },
  { name: "GitHub", icon: FaGithub, category: "tools" },
  { name: "Figma", icon: SiFigma, category: "design" },
  { name: "Flutter", icon: SiFlutter, category: "mobile" },
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

const childVariants = {
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

const techItemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function HeroLand() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section className="relative h-screen flex flex-col overflow-hidden pt-20 lg:pt-24">
      {/* Background Gradients with Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-black to-purple-950 z-0">
        {/* Animated Gradients */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.1) 70%)",
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
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(67,56,202,0.1) 70%)",
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
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(43,89,219,0.1) 70%)",
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

        {/* Mobile Background Image */}
        <motion.div
          className="lg:hidden absolute inset-0 flex items-center justify-center opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={Heroimage}
            alt="Learning illustration"
            className="w-[200px] h-[200px] transform -translate-y-20 object-contain"
            placeholder="blur"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center relative z-10">
        <div className="container mx-auto px-8 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full lg:w-1/2 text-center lg:text-left lg:pr-8 mb-8 lg:mb-0 relative z-20"
            >
              <motion.h1
                variants={childVariants}
                className="text-5xl lg:text-7xl font-bold mb-6 lg:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-300"
              >
                Master web developing from scratch
              </motion.h1>

              <motion.p
                variants={childVariants}
                className="text-base sm:text-lg text-gray-300 mb-6 lg:mb-8 leading-relaxed"
              >
                Learn the latest skills from professional mentors in various
                fields of technology and business with our interactive learning
                platform.
              </motion.p>

              <motion.div
                variants={childVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center justify-center group w-full sm:w-auto"
                >
                  Start Learning
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-gray-950 font-bold bg-white hover:bg-white/90 transition-all flex items-center justify-center w-full sm:w-auto"
                >
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  View Courses
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Desktop Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="w-full lg:w-1/2 justify-center items-center hidden lg:flex relative z-10"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={Heroimage}
                  alt="Learning illustration"
                  className="w-130 h-130 object-contain "
                  placeholder="blur"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-shrink-0 py-8 lg:py-12 w-full relative bg-gradient-to-t from-black/60 to-transparent"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 font-semibold text-left"
          >
            POWERED BY
          </motion.h2>

          <Swiper
            modules={[FreeMode, Autoplay]}
            spaceBetween={10}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 4, spaceBetween: 15 },
              768: { slidesPerView: 5, spaceBetween: 20 },
              1024: { slidesPerView: 6, spaceBetween: 20 },
              1280: { slidesPerView: 8, spaceBetween: 20 },
            }}
            freeMode={true}
            grabCursor={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
            }}
            loop={true}
            className="w-full"
          >
            {technologies.map((tech, index) => (
              <SwiperSlide key={`tech-${index}`}>
                <motion.div
                  variants={techItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center justify-center h-22"
                  onHoverStart={() => setHoveredTech(`${tech.name}-${index}`)}
                  onHoverEnd={() => setHoveredTech(null)}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tech.icon
                    className={`text-4xl md:text-5xl transition-all duration-300 ${
                      hoveredTech === `${tech.name}-${index}`
                        ? "text-purple-300"
                        : "text-white"
                    }`}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </section>
  );
}