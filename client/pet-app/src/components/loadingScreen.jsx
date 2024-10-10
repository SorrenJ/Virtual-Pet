import React from 'react';
import '../styles/loadingScreen.scss'; // Ensure you create this CSS file and import it

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <h1>Loading...</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
