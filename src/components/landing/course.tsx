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
        className="group relative h-[400px] md:h-[460px] bg-white perspective-1000 w-full max-w-[400px] mx-auto shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(2deg)_rotateX(2deg)]">
          <motion.div className="absolute inset-0 overflow-hidden rounded-2xl">
            <img
              src={`https://source.unsplash.com/random/800x600/?coding,${index}`}
              alt={course.title}
              className="w-full h-40 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/30 to-transparent" />
          </motion.div>

          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded-full">
                ✨ Best Seller
              </span>
              <span className="text-xs font-medium text-purple-600">
                🏆 4.9/5.0
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight text-center text-gray-900">
              {course.title}
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 font-medium line-clamp-3 text-center">
              {course.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 px-2">
              <div className="flex items-center gap-2 justify-center bg-gray-50 p-2 rounded-lg">
                <span className="text-lg text-purple-600">⏳</span>
                <span className="text-sm text-gray-700">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-gray-50 p-2 rounded-lg">
                <span className="text-lg text-purple-600">📈</span>
                <span className="text-sm text-gray-700">{course.level}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-4 px-2">
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-purple-700">
                  {course.price}
                </span>
                <span className="text-xs text-gray-500">Full Access</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-sm font-semibold text-white shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all"
              >
                Enroll Now <span className="text-lg">→</span>
              </motion.button>
            </div>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-2xl border-2 border-purple-200 shadow-[0_0_40px_0_rgba(168,85,247,0.1)]" />
          </div>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-200 rounded-full"
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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Master Web Development
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive courses taught by industry experts
          </p>
        </motion.div>

        {/* Mobile Swiper */}
        <div className="block sm:hidden">
          <Swiper
            loop={true}
            spaceBetween={24}
            slidesPerView={1.1}
            centeredSlides={true}
            className="pb-12"
          >
            {courses.map((course, index) => (
              <SwiperSlide key={course.id} className="!h-auto">
                <CourseCard course={course} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}