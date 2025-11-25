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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">CSTS</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {!role && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

            {role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/tickets">All Tickets</Link>
                </li>
              </>
            )}

            {role === 'Agent' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/agent/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/agent/resolved">Resolved Tickets</Link>
                </li>
              </>
            )}

            {role === 'Customer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer/search">Search Tickets</Link>
                </li>
              </>
            )}

            {role && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-3"
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
