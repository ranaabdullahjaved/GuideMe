"use client"

import CourseItem from "./CoursesItem"
import { useRef, useEffect } from "react"

const CourseList = ({ courses, userRole }) => {
  const listRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show")
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    const courseItems = listRef.current.querySelectorAll(".course-item")
    courseItems.forEach((item) => observer.observe(item))

    return () => {
      courseItems.forEach((item) => observer.unobserve(item))
    }
  }, []) // Removed unnecessary dependency 'courses'

  return (
    <div className="course-list" ref={listRef}>
      {courses.map((course, index) => (
        <CourseItem key={course.id} course={course} userRole={userRole} style={{ animationDelay: `${index * 0.1}s` }} />
      ))}
    </div>
  )
}

export default CourseList

