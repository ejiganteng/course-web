"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function CourseLand() {
  const courses = [
    {
      id: 1,
      title: "Frontend Mastery",
      description: "Master HTML, CSS, JavaScript and modern frameworks",
      price: "$299",
      duration: "12 weeks",
      level: "Beginner to Advanced",
    },
    {
      id: 2,
      title: "Backend Development",
      description: "Learn Node.js, Express, databases and API development",
      price: "$349",
      duration: "14 weeks",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Full Stack Bootcamp",
      description: "Comprehensive path to become a full stack developer",
      price: "$599",
      duration: "24 weeks",
      level: "Beginner to Advanced",
    },
  ];

  const CourseCard = ({ course, index }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          delay: index * 0.2,
          duration: 0.6,
          ease: "easeOut",
        }}
        className="group relative h-[400px] md:h-[460px] bg-transparent perspective-1000 w-full max-w-[400px] mx-auto"
      >
        <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(5deg)_rotateX(5deg)]">
          <motion.div className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl">
            <img
              src={`https://source.unsplash.com/random/800x600/?coding,${index}`}
              alt={course.title}
              className="w-full h-40 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
          </motion.div>

          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-bold bg-purple-500/30 backdrop-blur-sm rounded-full border border-purple-300/20">
                ✨ Best Seller
              </span>
              <span className="text-xs font-medium text-purple-300/90">
                🏆 4.9/5.0
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight text-center">
              {course.title}
            </h3>
            <p className="text-sm md:text-base text-gray-300/90 mb-4 font-light line-clamp-3 text-center">
              {course.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 px-2">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-lg opacity-75">⏳</span>
                <span className="text-sm">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-lg opacity-75">📈</span>
                <span className="text-sm">{course.level}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-700/50 pt-4 px-2">
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                  {course.price}
                </span>
                <span className="text-xs text-gray-400">Full Access</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-br from-purple-600 to-pink-500 px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
              >
                Enroll Now <span className="text-lg">→</span>
              </motion.button>
            </div>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/20 shadow-[0_0_40px_0_rgba(168,85,247,0.2)]" />
          </div>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random(),
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="inset-0 bg-gradient-to-tr from-gray-800/90 via-black to-purple-950/60">
      <div className="bg-white mx-4 lg:mx-9 rounded-t-4xl overflow-hidden shadow-2xl flex flex-col sm:min-h-screen sm:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-12 flex flex-col justify-center"
        >
          <div className="mb-8 lg:mb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 mx-auto max-w-2xl"
            >
              Web Development Courses
            </motion.h1>
          </div>

          {/* Swiper for Mobile */}
          <div className="block sm:hidden">
            <Swiper
              loop={true}
              spaceBetween={16}
              slidesPerView={1.1}
              centeredSlides={true}
              className="px-4"
            >
              {courses.map((course, index) => (
                <SwiperSlide key={course.id} className="!h-auto pb-12">
                  <CourseCard course={course} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Grid for Desktop */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
