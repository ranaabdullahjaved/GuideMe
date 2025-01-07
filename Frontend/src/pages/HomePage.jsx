import '../styles/HomePage.css';
export default function HomePage() {
    return (
      <div className="app">
        {/* Header */}
        <header className="header">
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
        </header>
  
        {/* Category Navigation */}
        <nav className="category-nav">
          <div className="category-content">
            {["Engineering Mentors", "Design Mentors", "Startup Mentors", 
              "Product Managers", "Marketing Coaches", "Leadership Mentors", 
              "Career Coaches", "Top Mentors"].map(category => (
              <a key={category} href="#" className="category-link">{category}</a>
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
            />
            <button className="button primary">Find mentors</button>
          </div>
          <div className="category-pills">
            {["Product Managers", "Career Coaches", "Software Engineers",
              "Leadership Mentors", "UX Designers", "Data Scientists",
              "Startup Founders"].map(pill => (
              <a key={pill} href="#" className="pill">{pill}</a>
            ))}
          </div>
        </section>
  
        {/* Stats Section */}
        <section className="stats">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">5,700+</div>
              <div className="stat-label">Available mentors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24,900+</div>
              <div className="stat-label">Matches made</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">130+</div>
              <div className="stat-label">Countries represented</div>
            </div>
          </div>
        </section>
  
        {/* Mentor Cards */}
        <section className="mentors">
          <div className="mentors-grid">
            {[1, 2, 3].map(mentor => (
              <div key={mentor} className="mentor-card">
                <div className="mentor-info">
                  <div className="mentor-avatar"></div>
                  <div className="mentor-details">
                    <h3 className="mentor-name">John Doe</h3>
                    <p className="mentor-title">Senior Engineer at Tech Corp</p>
                    <div className="mentor-tags">
                      <span className="tag">Frontend</span>
                      <span className="tag">React</span>
                    </div>
                  </div>
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
  
  