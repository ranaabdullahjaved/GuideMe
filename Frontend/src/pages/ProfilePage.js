import React, { useState } from "react";
import '../styles/ProfilePage.css'; // Adjust the relative path as needed

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      {/* Profile Section */}
      <div className="section">
        <h2 className="heading">Your Profile</h2>
        <div className="profileInfo">
          <div className="photoContainer">
            <div className="photoPreview">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="imagePreview"
                />
              ) : (
                <span>Photo</span>
              )}
            </div>
            <button
              className="button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Upload Photo
            </button>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="fileInput"
              onChange={handleImageUpload}
            />
          </div>

          <div className="formGroup">
            <label className="label">First Name*</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Last Name*</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Email*</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Location</label>
            <select className="input">
              <option value="">Select your location</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Job Title</label>
            <input
              type="text"
              placeholder="Enter your job title"
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">LinkedIn</label>
            <input
              type="text"
              placeholder="LinkedIn URL"
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Twitter</label>
            <input type="text" placeholder="Twitter URL" className="input" />
          </div>
          <div className="formGroup">
            <label className="label">Goal</label>
            <textarea
              placeholder="Enter your goal"
              className="textarea"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Timezone Section */}
      <div className="section">
        <h2 className="heading">Time Zone & Availability</h2>
        <div className="formGroup">
          <label className="label">Time Zone</label>
          <select className="input">
            <option value="">Select Time Zone</option>
            <option value="pst">PST</option>
            <option value="est">EST</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Preferred Meeting Time</label>
          <div className="radioGroup">
            <label>
              <input type="radio" name="time" value="morning" />
              Early mornings (before 9 AM)
            </label>
            <label>
              <input type="radio" name="time" value="day" />
              During the day (9 AM - 5 PM)
            </label>
            <label>
              <input type="radio" name="time" value="evening" />
              In the evenings (after 5 PM)
            </label>
            <label>
              <input type="radio" name="time" value="flexible" />
              I'm flexible
            </label>
          </div>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="section">
        <h2 className="heading">Email Preferences</h2>
        <div className="checkboxGroup">
          <label>
            <input type="checkbox" />
            Important updates about your account, mentorship, messages, and
            billing
          </label>
          <label>
            <input type="checkbox" />
            Regular reminders of your ongoing mentorships
          </label>
          <label>
            <input type="checkbox" />
            Notifications of mentors on your wishlist
          </label>
        </div>
        <button className="signoutButton">Sign Out</button>
      </div>
    </div>
  );
};

export default ProfilePage;
