"use client";

import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
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
  // Frontend
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

  // Backend
  { name: "Node.js", icon: FaNodeJs, category: "backend" },
  { name: "Java", icon: FaJava, category: "backend" },
  { name: "Spring", icon: SiSpring, category: "backend" },
  { name: "Python", icon: FaPython, category: "backend" },
  { name: "PHP", icon: SiPhp, category: "backend" },
  { name: "Laravel", icon: SiLaravel, category: "backend" },
  { name: "GraphQL", icon: SiGraphql, category: "backend" },

  // Database
  { name: "MongoDB", icon: SiMongodb, category: "database" },
  { name: "MySQL", icon: SiMysql, category: "database" },
  { name: "Firebase", icon: SiFirebase, category: "database" },

  // DevOps & Cloud
  { name: "Docker", icon: FaDocker, category: "devops" },
  { name: "Kubernetes", icon: SiKubernetes, category: "devops" },
  { name: "Google Cloud", icon: SiGooglecloud, category: "cloud" },

  // Others
  { name: "GitHub", icon: FaGithub, category: "tools" },
  { name: "Figma", icon: SiFigma, category: "design" },
  { name: "Flutter", icon: SiFlutter, category: "mobile" },
];

export default function HeroLand() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <>
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden lg:py-8 px-4 sm:px-6 pt-24 md:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-black to-purple-950 z-0">
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
        </div>

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
                Pelajari keterampilan terkini dari mentor profesional di
                berbagai bidang teknologi dan bisnis dengan platform
                pembelajaran interaktif kami
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
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AcademicCapIcon className="w-64 h-64 text-indigo-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="py-6 overflow-hidden w-full relative">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-xl text-white">
              We use these <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-400 to-purple-300">Technologies</span>
            </h2>

            <div className="relative mt-4">
              <div className="w-full">
                <Swiper
                  modules={[FreeMode, Autoplay]}
                  spaceBetween={10}
                  slidesPerView={3}
                  breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 15 },
                    768: { slidesPerView: 4, spaceBetween: 20 },
                    1024: { slidesPerView: 5, spaceBetween: 20 },
                    1280: { slidesPerView: 7, spaceBetween: 20 },
                  }}
                  freeMode={true}
                  grabCursor={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: true,
                  }}
                  loop={true}
                  className="w-full -mx-2"
                >
                  {technologies.map((tech, index) => (
                    <SwiperSlide 
                      key={`tech-${index}`}
                      className="px-2"
                    >
                      <div
                        className="flex items-center justify-center h-22 overflow-hidden"
                        onMouseEnter={() =>
                          setHoveredTech(`${tech.name}-${index}`)
                        }
                        onMouseLeave={() => setHoveredTech(null)}
                        onTouchStart={() =>
                          setHoveredTech(`${tech.name}-${index}`)
                        }
                        onTouchEnd={() => setHoveredTech(null)}
                      >
                        <div className="relative flex flex-col items-center justify-center transition-transform duration-300">
                          <tech.icon
                            className={`text-5xl md:text-6xl transition-all duration-300 ${
                              hoveredTech === `${tech.name}-${index}`
                                ? "text-purple-300"
                                : "text-white"
                            }`}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}