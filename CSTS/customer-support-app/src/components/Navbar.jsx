import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logoutUser } from '../services/api';

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId && role === 'Agent') {
        await logoutUser();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setRole(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <i className="fas fa-headset me-2"></i> CSTS
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">
            {!role && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light rounded-pill px-4 fw-bold text-primary" to="/register">Register</Link>
                </li>
              </>
            )}

            {role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/tickets">All Tickets</Link>
                </li>
              </>
            )}

            {role === 'Agent' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/agent/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/agent/resolved">Resolved Tickets</Link>
                </li>
              </>
            )}

            {role === 'Customer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/customer/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/customer/search">Search Tickets</Link>
                </li>
              </>
            )}

            {role && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-3 rounded-pill px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
