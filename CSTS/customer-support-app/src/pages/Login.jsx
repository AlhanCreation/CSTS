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
    <div className="col-md-4 mx-auto mt-5">
      <h3 className="text-center mb-4">Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          className="form-control my-2"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <small className="text-danger">{errors.email}</small>}

        <input
          name="password"
          type="password"
          className="form-control my-2"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && (
          <small className="text-danger">{errors.password}</small>
        )}

        <button className="btn btn-dark w-100 mt-3" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
