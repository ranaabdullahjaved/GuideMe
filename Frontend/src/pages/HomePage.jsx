import { useState, useEffect } from "react";
import '../styles/HomePage.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function HomePage() {
  const navigate = useNavigate();
  const [mentorSearch, setMentorSearch] = useState("");
  const [mentorResults, setMentorResults] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [stats, setStats] = useState({
    mentorCount: '5,700+',
    matchesCount: '24,900+',
    countriesCount: '130+'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch platform statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('https://harmonious-creation-production.up.railway.app/api/admin/statistics');
        if (response.data) {
          setStats({
            mentorCount: (response.data.mentorCount || 0) > 0 
              ? response.data.mentorCount.toLocaleString() + '+' 
              : '1+',
            matchesCount: (response.data.matchesCount || 0) > 0 
              ? response.data.matchesCount.toLocaleString() + '+' 
              : '1+',
            countriesCount: (response.data.countriesCount || 0) > 0 
              ? response.data.countriesCount.toLocaleString() + '+' 
              : '1+'
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Keep the default stats if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const teamMembers = [
    {
      name: "Ali Shah",
      role: "Full Stack Developer",
      image: "/src/assets/shah3.JPG",
    },
    {
      name: "Anas Aqeel",
      role: "Data Scientist",
      image: "/src/assets/anas.jpeg",
    },
    {
      name: "Mr. Muhammad Usama Hassan Alvi",
      role: "Project Advisor",
      image: "/src/assets/sir.jpeg",
    },
  ]
  const handleMentorSelect = async (mentor) => {
    setSelectedMentor(mentor.email);
    setMentorSearch(mentor.name);
    setMentorResults([]);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const menteeId = currentUser._id || currentUser.id;
      const res = await axios.post('https://harmonious-creation-production.up.railway.app/api/chat/conversations', {
        menteeId,
        mentorId: mentor,
      });
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };
  const handleMentorSearch = async (input) => {
    setMentorSearch(input);
    if (input.length >= 2) {
      try {
        const response = await fetch(`https://harmonious-creation-production.up.railway.app/api/courses/search?query=${input}`);
        const data = await response.json();
        setMentorResults(data);
      } catch (error) {
        console.error("Error searching mentors:", error);
      }
    } else {
      setMentorResults([]);
    }
  };
  return (
    <div className="app">
      {/* Header */}
      {/* <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon"></div>
              <span>GuideMe</span>
            </div>
            <div className="search-container">
              <input type="search" placeholder="Search" className="search-input" />
            </div>
            <nav className="main-nav">
              <a href="#" className="nav-link">For Businesses</a>
              <button className="button primary">Browse all mentors</button>
              <button onClick={() => (window.location.href = '/login')}>Login</button>

            </nav>
          </div>
        </header> */}

      {/* Category Navigation */}
      <nav className="category-nav">
        <div className="category-content">
          {["Engineering Mentors", "Design Mentors", "Startup Mentors",
            "Product Managers", "Marketing Coaches", "Leadership Mentors",
            "Career Coaches", "Top Mentors"].map(category => (
              <div key={category} className="category-link">{category}</div>
            ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <p className="hero-subtitle">Learn a new skill, launch a project, land your dream career.</p>
        <h1 className="hero-title">
          1-on-1 <span className="accent-text">Career</span> Mentorship
        </h1>
        <div className="hero-search">
          <input
            type="text"
            placeholder="Search by company, skills or role"
            className="search-input large"
            value={mentorSearch}
            onChange={(e) => handleMentorSearch(e.target.value)}
          />
          {mentorResults.length > 0 && (
            <ul className="mentor-results">
              {mentorResults.map((mentor) => (
                <li key={mentor.email} onClick={() => handleMentorSelect(mentor)}>
                  {mentor.avatar && (
                    <img
                      src={`https://harmonious-creation-production.up.railway.app/uploads/${mentor.avatar}`}
                      alt="User Avatar"
                      className="navbar-avatar"
                    />
                  )}
                  {mentor.name} - {mentor.skill}
                </li>
              ))}
            </ul>
          )}
          {/* <button className="button primary">Find mentors</button> */}
        </div>
        <div className="category-pills">
          {["Product Managers", "Career Coaches", "Software Engineers",
            "Leadership Mentors", "UX Designers", "Data Scientists",
            "Startup Founders"].map(pill => (
              <div key={pill} className="pill">{pill}</div>
            ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{isLoading ? 'Loading...' : stats.mentorCount}</div>
            <div className="stat-label">Available mentors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{isLoading ? 'Loading...' : stats.matchesCount}</div>
            <div className="stat-label">Matches made</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{isLoading ? 'Loading...' : stats.countriesCount}</div>
            <div className="stat-label">Countries represented</div>
          </div>
        </div>
      </section>

      {/* Mentor Cards */}
      <section className="mentors">
        <h2>Some Of Our Top Mentors:</h2>
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

      {/* Company Logos */}
      <section className="companies">
        <div className="company-logos">
          {["Airbnb", "Amazon", "Meta", "Microsoft", "Spotify", "Uber"]
            .map(company => (
              <div key={company} className="company-logo">
                <div className="logo-placeholder"></div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

