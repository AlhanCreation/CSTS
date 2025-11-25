import React from 'react';
import useFormValidation from '../hooks/useFormValidation';
import { apiFetch } from '../services/api';

function Register() {
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
        alert('Registration successful!');
      } else if (res && res.message) {
        alert(`${res.message}`);
      } else {
        alert('Registration failed, please try again.');
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('Error occurred while registering');
    }
  };

  return (
    <div className="col-md-4 mx-auto mt-5">
      <h3 className="text-center mb-4">Register</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          className="form-control my-2"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <small className="text-danger">{errors.name}</small>}

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

        <select
          name="role"
          className="form-select my-2"
          value={values.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
          <option value="Customer">Customer</option>
        </select>
        {errors.role && <small className="text-danger">{errors.role}</small>}

        <button className="btn btn-dark w-100 mt-3" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
