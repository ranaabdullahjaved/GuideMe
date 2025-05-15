// src/pages/SignupPage.jsx
import { useState } from "react";
import axios from "axios";
import '../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState("mentee");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skill: "",
    role: "mentee",
    yearsExperience: "",
    linkedin: "",
    education: "",
    github: "",
    references: [{ name: "", email: "", phone: "" }, { name: "", email: "", phone: "" }],
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [educationCertificateFile, setEducationCertificateFile] = useState(null);
  const [workExperienceLetterFile, setWorkExperienceLetterFile] = useState(null);
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, role: tab });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReferenceChange = (idx, e) => {
    const updatedReferences = [...formData.references];
    updatedReferences[idx][e.target.name] = e.target.value;
    setFormData({ ...formData, references: updatedReferences });
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleEducationCertificateChange = (e) => {
    setEducationCertificateFile(e.target.files[0]);
  };

  const handleWorkExperienceLetterChange = (e) => {
    setWorkExperienceLetterFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Log the form data before sending
      console.log('Form data before sending:', {
        ...formData,
        avatar: avatarFile?.name,
        educationCertificate: educationCertificateFile?.name,
        workExperienceLetter: workExperienceLetterFile?.name
      });

      Object.keys(formData).forEach((key) => {
        if (key === "references") {
          formDataToSend.append("references", JSON.stringify(formData.references));
        } else {
        formDataToSend.append(key, formData[key]);
        }
      });
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }
      if (educationCertificateFile) {
        formDataToSend.append("educationCertificate", educationCertificateFile);
      }
      if (workExperienceLetterFile) {
        formDataToSend.append("workExperienceLetter", workExperienceLetterFile);
      }

      // Log the FormData entries
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post("http://localhost:5000/api/auth/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message || "Sign up successful!");
      navigate('/login');
    } catch (error) {
      console.error("Error during signup:", error);
      // Show the specific error message from the server if available
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      if (error.response?.data?.details) {
        console.error('Validation details:', error.response.data.details);
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2z" fill="#fff" />
            <path d="M12 8v8m-4-4h8" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-content">
          <h2>Sign up</h2>
          <div className="tab-switch">
            <button className={`tab ${activeTab === "mentee" ? "active" : ""}`} onClick={() => handleTabSwitch("mentee")}>I&apos;m a mentee</button>
            <button className={`tab ${activeTab === "mentor" ? "active" : ""}`} onClick={() => handleTabSwitch("mentor")}>I&apos;m a mentor</button>
          </div>
          <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" autoComplete="current-password" value={formData.password} onChange={handleChange} required />
            <input type="text" name="skill" placeholder="Skill" value={formData.skill} onChange={handleChange} required />
            {activeTab === "mentor" && (
              <div className="mentor-fields">
                <input type="number" name="yearsExperience" placeholder="Years of experience" value={formData.yearsExperience} onChange={handleChange} required />
                <input type="url" name="linkedin" placeholder="LinkedIn profile URL" value={formData.linkedin} onChange={handleChange} required />
                <div className="linkedin-verification-info">We will verify your LinkedIn profile after signup.</div>
                <input type="text" name="education" placeholder="Education" value={formData.education} onChange={handleChange} required />
                <label htmlFor="educationCertificateFile">Upload Educational Certificate</label>
                <input type="file" id="educationCertificateFile" accept="application/pdf,image/*" onChange={handleEducationCertificateChange} />
                <input type="url" name="github" placeholder="GitHub profile URL" value={formData.github} onChange={handleChange} />
                <label htmlFor="workExperienceLetterFile">Upload Work Experience Letter</label>
                <input type="file" id="workExperienceLetterFile" accept="application/pdf,image/*" onChange={handleWorkExperienceLetterChange} />
                <div className="references-section">
                  <h3>Professional References</h3>
                  <p className="reference-helper">Please provide one or two professional references we can contact.</p>
                  {[0, 1].map(idx => (
                    <div key={idx} className="reference-card">
                      <h4>Reference {idx + 1}</h4>
                      <input type="text" name="name" placeholder="Reference Name" value={formData.references[idx].name} onChange={e => handleReferenceChange(idx, e)} />
                      <input type="email" name="email" placeholder="Reference Email" value={formData.references[idx].email} onChange={e => handleReferenceChange(idx, e)} />
                      <input type="text" name="phone" placeholder="Reference Phone" value={formData.references[idx].phone} onChange={e => handleReferenceChange(idx, e)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <label htmlFor="avatarFile">Profile Image</label>
            <input type="file" id="avatarFile" accept="image/*" onChange={handleFileChange} />
            <button type="submit" className="signup-btn">Sign up</button>
          </form>
          <div className="or-divider">
            <span>Or</span>
          </div>
          <button className="google-signup-btn">Sign up with Google</button>
          <div className="signup-links">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
