import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const SignupForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate(); 

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};


    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axios.post(`http://localhost:5000/api/signup`, formData);
      setMessage(response.data.message);
      navigate("/login");  
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); 
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ width: "400px" }}>
        <h2 className="text-center">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              onChange={handleChange}
              value={formData.name}
              required
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              value={formData.email}
              required
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
          <div className="mb-3">
            <label>Password</label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"} 
                name="password"
                className="form-control"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <button
                type="button"
                className="input-group-text"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select name="role" className="form-select" onChange={handleChange} value={formData.role}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="btn btn-primary w-100" type="submit">Signup</button> 
        </form>
        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default SignupForm;
