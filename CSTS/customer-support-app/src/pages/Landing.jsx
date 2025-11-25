import React from 'react';
import bgimage from '../assets/background.jpg';

function Landing() {
  return (
    <div className="text-center mt-5"
      style={{
        backgroundImage: `url(${bgimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '550px',
        color: 'black'
      }}
    >
      <div className="pt-40">
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <h1>Welcome to CSTS</h1>
        <p className="lead mt-3">
          Customer Support Service to resolve in all your queries.
        </p>
      </div>
    </div>
  );
}

export default Landing;
