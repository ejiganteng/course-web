"use client";
import HeroLand from "./components/landing/hero";
import NavbarLand from "./components/landing/navbar";

import { motion, useScroll } from "framer-motion";
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
import { useState } from "react";

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

export default function ScrollLinked() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          originX: 0,
          height: 10,
        }}
        className="fixed top-0 left-0 right-0 bg-purple-500 z-50"
      />

      <LandingPage />
    </>
  );
}

function LandingPage() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <div className="min-h-screen text-black">
      <NavbarLand />
      <HeroLand />
      <div className="bg-white h-[30vh]"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-shrink-0 py-8 lg:py-12 w-full relative"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-900 font-semibold text-left"
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
    </div>
  );
}
