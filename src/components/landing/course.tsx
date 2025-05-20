"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";
import { CheckIcon, StarIcon } from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import "swiper/css";
import "swiper/css/pagination";

const courses = [
  {
    id: 1,
    title: "Frontend Mastery",
    description: "Master HTML, CSS, JavaScript and modern frameworks",
    price: "$299",
    duration: "12 weeks",
    level: "Beginner to Advanced",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Backend Development",
    description: "Learn Node.js, Express, databases and API development",
    price: "$349",
    duration: "14 weeks",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Full Stack Bootcamp",
    description: "Comprehensive path to become a full stack developer",
    price: "$599",
    duration: "24 weeks",
    level: "Beginner to Advanced",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Mobile Development",
    description: "Build iOS & Android apps with React Native",
    price: "$399",
    duration: "16 weeks",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const CourseCard = ({ course, index }: { course: any; index: number }) => {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: false, margin: "-25% 0px" });

  const cardAnimation = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        delay: index * 0.15,
      },
    },
  };

  const staggerAnimation = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.1 + 0.3 },
    }),
  };

  return (
    <motion.div
      ref={ref}
      variants={cardAnimation}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative h-[500px] lg:h-[520px] bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden group"
    >
      {/* Image Section */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="h-[40%] relative rounded-t-2xl overflow-hidden"
      >
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 p-6 space-y-2"
        >
          <h3 className="text-2xl font-bold text-white">{course.title}</h3>
          <p className="text-gray-200 line-clamp-2">{course.description}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: "spring", delay: 0.7 }}
          className="absolute top-4 right-4 w-12 h-12 border-2 border-white/20 rounded-xl flex items-center justify-center"
        >
          <AcademicCapIcon className="w-6 h-6 text-white/80" />
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price & Duration */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          className="flex justify-between items-center mb-5"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-purple-600 font-bold text-2xl">
              {course.price}
            </span>
            <span className="text-gray-400 text-sm line-through">$599</span>
          </div>
          <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {course.duration}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="flex flex-wrap gap-2 mb-6"
        >
          <motion.div
            custom={0}
            variants={staggerAnimation}
            className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <CheckIcon className="w-4 h-4" />
            {course.level}
          </motion.div>
          <motion.div
            custom={1}
            variants={staggerAnimation}
            className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <StarIcon className="w-4 h-4 text-amber-500" />
            4.9/5
          </motion.div>
        </motion.div>

        {/* Features List */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="space-y-4"
        >
          {[
            "50+ Coding Challenges",
            "Real-world Projects",
            "Certificate of Completion",
            "Lifetime Access",
            "Community Support",
          ].map((feature, i) => (
            <motion.li
              key={i}
              custom={i}
              variants={staggerAnimation}
              className="flex items-center gap-3 text-gray-600 p-2 rounded-lg"
            >
              <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium">{feature}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Enroll Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="absolute bottom-6 left-6 right-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <ComputerDesktopIcon className="w-5 h-5" />
            Enroll Now
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function CourseLand() {
  const router = useRouter();

  return (
    <div className="bg-white w-full px-4 sm:px-8">
      <div className="mx-8 sm:mx-10 px-4 lg:px-8 py-14 lg:py-24 bg-gradient-to-b from-black via-violet-700 to-purple-950/90 rounded-[2.5rem]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-center mb-12 lg:mb-16 gap-6"
        >
          <div className="text-center lg:text-left max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-100">
              Master Modern Web Development
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/courses")}
            className="px-8 py-3.5 text-purple-100 bg-white/10 border border-white/30 rounded-xl backdrop-blur-sm flex items-center gap-2"
          >
            <BookOpenIcon className="w-5 h-5" />
            Explore All Courses →
          </motion.button>
        </motion.div>

        {/* Slider */}
        <Swiper
          modules={[Pagination]}
          loop
          spaceBetween={30}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3.5 },
          }}
          className="course-slider"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={course.id}>
              <CourseCard course={course} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}