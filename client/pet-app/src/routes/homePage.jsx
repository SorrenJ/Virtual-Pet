import React from 'react';
import { Link } from 'react-router-dom'; //Link is used to link to different parts of the website.

const HomePage = () => {
  return (
    <div>
      <h1>
        Welcome to Beastly Bonds! Adopting a monster has never been easier!
      </h1>
      <div style={{ marginBottom: '10px' }}> {/* Optional styling for spacing */}
        <Link to="/shop">Go to Shop</Link>
      </div>
      <div>
        <Link to="/adopt">Go to Adopt</Link>
      </div>
    </div>
  );
};

export default HomePage;