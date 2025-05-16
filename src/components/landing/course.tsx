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

  return (
    <div
      ref={ref}
      className="relative h-[500px] lg:h-[520px] bg-white w-full mx-auto shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      {/* Image Header Section */}
      <div className="h-[40%] relative rounded-t-2xl overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-4 space-y-2">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {course.title}
          </h3>
          <p className="text-gray-200 line-clamp-2 font-medium leading-snug">
            {course.description}
          </p>
        </div>
        <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/20 rounded-xl flex items-center justify-center">
          <AcademicCapIcon className="w-6 h-6 text-white/80" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price & Duration */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-purple-600 font-bold text-2xl">
              {course.price}
            </span>
            <span className="text-gray-400 text-sm line-through">$599</span>
          </div>
          <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold shadow-sm flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {course.duration}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            {course.level}
          </div>
          <div className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-amber-500" />
            4.9/5
          </div>
        </div>

        {/* Course Features */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-100 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-purple-600" />
            Course Includes:
          </h4>
          <ul className="space-y-3">
            {[
              "50+ Coding Challenges",
              "Real-world Projects",
              "Certificate of Completion",
              "Lifetime Access",
              "Community Support",
            ].map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enroll Button */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          <button
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2"
          >
            <ComputerDesktopIcon className="w-5 h-5" />
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CourseLand() {
  const router = useRouter();

  return (
    <div className="bg-white justify-center flex w-full px-4 sm:px-8">
      <div className="m-8 sm:m-10 px-4 lg:px-8 py-14 lg:py-24 bg-gradient-to-b from-black via-violet-700 to-purple-950/90 w-full rounded-[2.5rem]">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 lg:mb-16 gap-6">
          <div className="text-center lg:text-left max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-100 flex items-center gap-3">
              Master Modern Web Development
            </h1>
          </div>
          <button
            onClick={() => router.push("/courses")}
            className="px-8 py-3.5 text-base font-semibold text-purple-100 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl backdrop-blur-sm transition-colors duration-300 shrink-0 hover:scale-[1.02] flex items-center gap-2"
          >
            <BookOpenIcon className="w-5 h-5" />
            Explore All Courses →
          </button>
        </div>

        {/* Courses Slider */}
        <Swiper
          modules={[Pagination]}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".course-pagination",
            bulletClass: "swiper-pagination-bullet !bg-white/50",
            bulletActiveClass: "!bg-purple-400",
          }}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: 3.5, spaceBetween: 35 },
          }}
          className="relative"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={course.id} className="!h-auto">
              <CourseCard course={course} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
