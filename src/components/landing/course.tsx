"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";
import { FaCheck, FaStar } from "react-icons/fa";
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
  {
    id: 4,
    title: "Mobile Development",
    description: "Build iOS & Android apps with React Native",
    price: "$399",
    duration: "16 weeks",
    level: "Intermediate",
  },
];

const CourseCard = ({ course, index }: { course: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const router = useRouter();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.1,
        ease: "easeOut",
      }}
      className="relative h-[500px] md:h-[520px] bg-white w-full mx-auto shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="h-[40%] bg-gradient-to-tr from-purple-500 to-blue-400 relative rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-2xl" />
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-4">
          <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
          <p className="text-gray-200 line-clamp-2">{course.description}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <span className="text-purple-600 font-bold text-lg">
            {course.price}
          </span>
          <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {course.duration}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
            {course.level}
          </div>
          <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm flex items-center gap-1">
            <FaStar className="text-yellow-500" /> 4.9/5
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Course Includes:</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-600">
              <FaCheck className="w-5 h-5 text-purple-500" />
              50+ Coding Challenges
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <FaCheck className="w-5 h-5 text-purple-500" />
              Real-world Projects
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <FaCheck className="w-5 h-5 text-purple-500" />
              Certificate of Completion
            </li>
          </ul>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          <button
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg transition-all"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CourseLand() {
  const router = useRouter();

  return (
    <div className="bg-white justify-center flex w-full px-8">
      <div className="m-10 px-4 lg:px-8 py-16 lg:py-24 bg-gradient-to-b from-purple-900/95 via-purple-950/90 to-purple-800/80 w-full rounded-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 lg:mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Master Web Development
            </h1>
            <p className="text-lg md:text-xl text-purple-100/90 max-w-2xl mx-auto md:mx-0">
              Comprehensive courses taught by industry experts
            </p>
          </div>
          <button
            onClick={() => router.push("/courses")}
            className="px-6 py-2.5 text-sm font-semibold text-purple-100 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg backdrop-blur-sm transition-colors duration-300 shrink-0"
          >
            See All Courses
          </button>
        </div>

        <Swiper
          modules={[Pagination]}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="relative"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={course.id} className="!h-auto pb-12">
              <CourseCard course={course} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}