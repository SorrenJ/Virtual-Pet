import React from 'react';
import '../styles/loadingScreen.scss'; // Ensure you create this CSS file and import it

const LoadingScreen = ({ isTransitioning }) => {
  return (
    <div className={`loading-screen ${isTransitioning ? 'swipe-out' : ''}`}>
      <div className="loading-content">
        <div className="spinner"></div>
        <h1>Loading...</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
