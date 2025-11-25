import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section d-flex align-items-center justify-content-center text-center text-white">
        <div className="container position-relative z-1 fade-in-up">
          <h1 className="display-3 fw-bold mb-4">Customer Support Ticketing System</h1>
          <p className="lead mb-5 fs-4">
            Elevate your customer service experience with our intelligent ticketing solution.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-sm text-primary fw-bold text-decoration-none">
              <i className="fas fa-rocket me-2"></i> Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-4 mx-auto d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-ticket-alt fa-lg"></i>
                  </div>
                  <h3 className="h5 card-title fw-bold">Ticket Management</h3>
                  <p className="card-text text-muted">
                    Efficiently track, prioritize, and resolve customer queries with our advanced ticketing system.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-success bg-gradient text-white rounded-circle mb-4 mx-auto d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-headset fa-lg"></i>
                  </div>
                  <h3 className="h5 card-title fw-bold">Complete Assistance</h3>
                  <p className="card-text text-muted">
                    Get comprehensive support for all your needs with our dedicated assistance tools.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-info bg-gradient text-white rounded-circle mb-4 mx-auto d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-chart-line fa-lg"></i>
                  </div>
                  <h3 className="h5 card-title fw-bold">Analytics Dashboard</h3>
                  <p className="card-text text-muted">
                    Monitor team performance and ticket trends with comprehensive analytics and reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
