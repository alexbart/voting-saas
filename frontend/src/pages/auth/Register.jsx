// frontend/src/pages/auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    context_type: 'school',
    external_id: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Shareholder">Shareholder</option>
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    name="context_type"
                    className="form-control"
                    value={formData.context_type}
                    onChange={handleChange}
                  >
                    <option value="school">School</option>
                    <option value="board">Board</option>
                  </select>
                </div>
                {(formData.role === 'Shareholder' || formData.role === 'Student') && (
                  <div className="mb-3">
                    <input
                      name="external_id"
                      className="form-control"
                      placeholder={formData.role === 'Shareholder' ? "Shares Owned" : "Student ID"}
                      value={formData.external_id}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <button type="submit" className="btn btn-success w-100">Register</button>
                <div className="text-center mt-3">
                  <a href="/login">Already have an account? Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}