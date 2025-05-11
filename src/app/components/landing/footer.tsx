"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaPython,
  FaAngular,
  FaVuejs,
  FaDocker,
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
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

// Types definition
interface Technology {
  name: string;
  icon: IconType;
  category?: string;
}

// Animation variants
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
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

// Technologies data
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

export default function FooterLand() {
  const [email, setEmail] = useState("");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log("Email submitted:", email);
    setEmail("");
    // Show success message or animation
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(79,70,229,0.1) 100%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/2 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(67,56,202,0.1) 90%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-8 sm:px-20 relative z-10 ">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12"
        >
          {/* Brand column */}
          <motion.div
            variants={childVariants}
            className="col-span-1 lg:col-span-1"
          >
            <Link href="/" className="flex items-center mb-6">
              <div className="relative w-10 h-10 mr-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-white text-xl font-bold">WebMaster</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              We help you master the art of web development through
              comprehensive courses and expert mentorship.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#4f46e5" }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#4f46e5" }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#4f46e5" }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#4f46e5" }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#4f46e5" }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaYoutube className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links column */}
          <motion.div variants={childVariants} className="col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Courses",
                "About Us",
                "Mentors",
                "Pricing",
                "Career",
                "Contact",
              ].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center"
                  >
                    <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 inline-block"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Course Categories column */}
          <motion.div variants={childVariants} className="col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              {[
                "Web Development",
                "Frontend Design",
                "Backend Engineering",
                "Mobile Apps",
                "Database Design",
                "UI/UX Design",
              ].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center"
                  >
                    <span className="w-1 h-1 bg-indigo-500 rounded-full mr-2 inline-block"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter column */}
          <motion.div variants={childVariants} className="col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and resources.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full py-3 pl-10 pr-16 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm py-1 px-3 rounded-lg flex items-center"
                >
                  Subscribe
                  <ArrowRightIcon className="w-3 h-3 ml-1" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        {/* Technologies Slider Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0 pb-12 w-full relative z-10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 font-semibold text-left mb-6"
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
                    className="flex items-center justify-center h-20"
                    onHoverStart={() => setHoveredTech(`${tech.name}-${index}`)}
                    onHoverEnd={() => setHoveredTech(null)}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex flex-col items-center">
                      <tech.icon
                        className={`text-3xl md:text-4xl transition-all duration-300 ${
                          hoveredTech === `${tech.name}-${index}`
                            ? "text-purple-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-xs mt-1 text-gray-500">
                        {tech.name}
                      </span>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
        <motion.div
          variants={childVariants}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} WebMaster. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service", "Cookies Policy"].map(
              (item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
