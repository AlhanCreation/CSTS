import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';
import { apiFetch } from '../services/api';

function Login() {
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.email.trim()) errors.email = 'Email is required';
    else if (!values.email.includes('@')) errors.email = 'Invalid email';
    if (!values.password.trim()) errors.password = 'Password is required';
    else if (values.password.length < 4)
      errors.password = 'Password too short';
    return errors;
  };

  const { values, errors, handleChange } = useFormValidation(
    { email: '', password: '' },
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const body = {
        email: values.email,
        passwordHash: values.password, 
      };

      const res = await apiFetch('auth/login', 'POST', body);
      console.log('Login response:', res);

      if (res && res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', res.user.userId);

        window.dispatchEvent(new Event('storage'));

        switch (res.user.role) {
          case 'Admin':
            navigate('/admin/dashboard');
            break;
          case 'Agent':
            navigate('/agent/dashboard');
            break;
          case 'Customer':
            navigate('/customer/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Error occurred while logging in');
    }
  };

  return (
    <div className="container d-flex  justify-content-center min-vh-80">
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back</h3>
          <p className="text-center text-muted mb-4">Login to your account</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted">Email Address</label>
              <input
                name="email"
                className="form-control form-control-lg bg-light border-0"
                placeholder="name@example.com"
                value={values.email}
                onChange={handleChange}
              />
              {errors.email && <small className="text-danger ps-2">{errors.email}</small>}
            </div>

            <div className="mb-4">
              <label className="form-label text-muted">Password</label>
              <input
                name="password"
                type="password"
                className="form-control form-control-lg bg-light border-0"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger ps-2">{errors.password}</small>
              )}
            </div>

            <button 
              className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-bold mb-3" 
              type="submit"
              style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', border: 'none' }}
            >
              Login
            </button>

            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <a href="/register" className="text-primary fw-bold text-decoration-none">Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
