import React from 'react';
import { toast } from 'react-hot-toast';
import useFormValidation from '../hooks/useFormValidation';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Name required';
    if (!values.email.trim()) errors.email = 'Email required';
    else if (!values.email.includes('@')) errors.email = 'Invalid email';
    if (!values.password.trim()) errors.password = 'Password required';
    else if (values.password.length < 4)
      errors.password = 'Minimum 4 characters';
    if (!values.role) errors.role = 'Select a role';
    return errors;
  };

  const { values, errors, handleChange } = useFormValidation(
    { name: '', email: '', password: '', role: '' },
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const payload = {
        name: values.name,
        email: values.email,
        passwordHash: values.password,
        role: values.role,
      };

      console.log('Sending register data:', payload);
      const res = await apiFetch('/auth/register', 'POST', payload);
      console.log('Register response:', res);

      if (res && res.success) {
        toast.success('Registration successful!');
      } else if (res && res.message) {
        toast.success(res.message);
        navigate('/login');
      }
    } catch (err) {
      console.error('Register error:', err);
      toast.error(err.message || 'Error occurred while registering');
    }
  };

  return (
    <div className="container d-flex  justify-content-center min-vh-80">
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-2 fw-bold text-primary">Create Account</h3>
          <p className="text-center text-muted mb-4">Join us today</p>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label text-muted mb-1">Full Name</label>
                <input
                  name="name"
                  className="form-control bg-light border-0"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={handleChange}
                />
                {errors.name && <small className="text-danger ps-2">{errors.name}</small>}
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted mb-1">Email Address</label>
                <input
                  name="email"
                  className="form-control bg-light border-0"
                  placeholder="name@example.com"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && <small className="text-danger ps-2">{errors.email}</small>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted mb-1">Password</label>
              <input
                name="password"
                type="password"
                className="form-control bg-light border-0"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger ps-2">{errors.password}</small>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label text-muted mb-1">Role</label>
              <select
                name="role"
                className="form-select bg-light border-0"
                value={values.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Agent">Agent</option>
                <option value="Customer">Customer</option>
              </select>
              {errors.role && <small className="text-danger ps-2">{errors.role}</small>}
            </div>

            <button 
              className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-bold mb-3" 
              type="submit"
              style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', border: 'none' }}
            >
              Register
            </button>

            <div className="text-center">
              <span className="text-muted">Already have an account? </span>
              <a href="/login" className="text-primary fw-bold text-decoration-none">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
