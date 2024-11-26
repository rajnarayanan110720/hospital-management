import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const AddEmployeeModal = ({ show, onClose, onAddEmployee }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    role: 'employee',
    password: '',
  });

  const [error, setError] = useState(''); 
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError('');
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!employeeData.name || !employeeData.email || !employeeData.password) {
      setError('All fields are required');
      return; 
    }


    if (!validateEmail(employeeData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (employeeData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return; 
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/add',
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onAddEmployee(response.data.employee); 
        onClose(); 
      } else {
        console.error('Error adding employee', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting employee data', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>} 

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={employeeData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={employeeData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group position-relative">
            <label>Password</label>
            <div className="input-group">
              <input
                type={passwordVisible ? 'text' : 'password'} 
                name="password"
                className="form-control"
                value={employeeData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setPasswordVisible(!passwordVisible)} 
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="form-control"
              value={employeeData.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary mt-3 w-100">
            Add Employee
          </button> 
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEmployeeModal;
