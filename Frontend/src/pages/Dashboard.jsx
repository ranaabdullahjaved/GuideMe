// App.js
import React from 'react';
import '../styles/Dashboard.css';

function App() {
  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome, Mentor</h1>
        <p>Find important messages, tips, and links to helpful resources here:</p>
        <div className="card">
          <h3>Grow your business with Seller Plus</h3>
          <p>Check out all the tools and benefits that can help you scale your success</p>
        </div>
        <div className="card">
          <h3>Set up inbox auto replies</h3>
          <p>Greet new potential buyers with an auto reply to their first message.</p>
        </div>
      </div>

      <div className="status-section">
        <div className="level-overview">
          <h2>Level Overview</h2>
          <p><strong>My level:</strong> New seller</p>
          <p><strong>Success score:</strong> 5</p>
          <p><strong>Rating:</strong> ⭐ 4.9</p>
          <p><strong>Response rate:</strong> 96%</p>
          <button>View progress</button>
        </div>

        <div className="active-orders">
          <h2>Active orders - 0 ($0)</h2>
        </div>
      </div>

      <div className="upgrade-section">
        <h3>3 steps to become a top Mentor on GuideMe</h3>
        <p>The key to your success on GuideMe is the brand you build for yourself through your GuideMe reputation. We gathered some tips and resources to help you become a leading Mentor on GuideMe.</p>
      </div>
    </div>
  );
}

export default App;
