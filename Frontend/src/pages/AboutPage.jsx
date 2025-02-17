"use client"

import { useEffect, useRef } from "react"
import "../styles/About.css"

function About() {
  const sectionRefs = {
    header: useRef(null),
    mission: useRef(null),
    vision: useRef(null),
    team: useRef(null),
    footer: useRef(null),
  }

  const teamMembers = [
    {
      name: "Muhammad Hashir",
      role: "Full Stack Developer",
      image: "/src/assets/hashir.jpeg",
    },
    {
      name: "Rana Abdullah Javed",
      role: "Backend Developer",
      image: "/src/assets/rana.jpeg",
    },
    {
      name: "Hooria Nadeem",
      role: "Frontend Developer",
      image: "/src/assets/hooria.jpeg",
    },
    {
      name: "Mr. Muhammad Usama Hassan Alvi",
      role: "Project Advisor",
      image: "/src/assets/sir.jpeg",
    },
  ]

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, []) // Removed sectionRefs from the dependency array

  return (
    <div className="about-container">
      <div className="about-header" ref={sectionRefs.header}>
        <h1>GuideMe: Navigate Your Career with Expert Mentorship</h1>
      </div>

      <div className="about-body">
        <div className="about-content">
          <section className="about-section" ref={sectionRefs.mission}>
            <h2>Our Mission</h2>
            <p>
              GuideMe introduces an innovative platform that reshapes mentorship dynamics in the coding and software
              development space. By bridging the gap between aspiring developers and experienced mentors, the platform
              facilitates seamless collaboration and real-time updates. It fosters personalized mentorship through
              features such as session scheduling, code review, contract creation, and billing management. GuideMe
              empowers both mentees and mentors by optimizing availability and ensuring a productive learning
              environment.
            </p>
          </section>

          <section className="about-section" ref={sectionRefs.vision}>
            <h2>Our Vision</h2>
            <p>
              Our vision is to create a dynamic and interconnected space where aspiring developers have the resources
              and expert guidance to advance their careers. GuideMe aims to offer a comprehensive mentorship experience
              that goes beyond traditional methods, ensuring a meaningful partnership between learners and mentors. By
              fostering the growth of new talents, we aspire to contribute to advancements in technology and innovation
              across the globe.
            </p>
          </section>

          <section className="about-section" ref={sectionRefs.team}>
            <h2>Meet the Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={member.name} className="team-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="team-card-image">
                    <img src={member.image || "/placeholder.svg"} alt={member.name} />
                  </div>
                  <div className="team-card-content">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="about-footer" ref={sectionRefs.footer}>
        <p>&copy; 2025 GuideMe - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default About

