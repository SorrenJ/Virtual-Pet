import React, { useState, useEffect } from "react"; // Import useEffect to handle transition
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import '../styles/frontPage.scss';
import LoadingScreen from '../components/loadingScreen'; // Ensure you have the correct path to your loading screen component

const FrontPage = () => {
  const [loading, setLoading] = useState(false); // State to manage the loading screen
  const [isTransitioning, setIsTransitioning] = useState(false); // State to manage the transition effect
  const navigate = useNavigate();

  const handleAdoptClick = () => {
    setLoading(true); // Show the loading screen
    setTimeout(() => {
      setIsTransitioning(true); // Start transition after loading
      setTimeout(() => {
        setLoading(false); // Hide loading after the transition
        navigate('/adopt'); // Redirect to /adopt page after a delay
      }, 500); // Duration of transition (0.5s)
    }, 2000); // Simulate loading delay
  };

  const handleHomeClick = () => {
    setLoading(true); // Show the loading screen
    setTimeout(() => {
      setIsTransitioning(true); // Start transition after loading
      setTimeout(() => {
        setLoading(false); // Hide loading after the transition
        navigate('/home'); // Redirect to /home page after a delay
      }, 500); // Duration of transition (0.5s)
    }, 2000); // Simulate loading delay
  };

  return (
    <>
      {loading ? (
        <LoadingScreen isTransitioning={isTransitioning} /> // Pass the transition state to LoadingScreen component
      ) : (
        <div className="colored-bg">
          <div className="overlay"></div>
          <div className="light-clouds"></div>
          <div className="light-clouds"></div>
          <Helmet>
            <title>Front Page</title>
          </Helmet>
          <body>
            <img
              src="https://res.cloudinary.com/deszclhtq/image/upload/v1728533043/5-modified_bxuj8q.png"
              alt="Red"
              className="moving-image red-moving"
            />

            <div className="logo">
              {/* Logo Image */}
              <img
                src="https://res.cloudinary.com/deszclhtq/image/upload/v1728533192/Beatly_Bonds_Hero_vtu813.png"
                alt="beastly-bond"
                className="beastly-bond-logo"
              />
            </div>
            
            <div className="button-container">
              <button onClick={handleAdoptClick} className="adopt-button">Adopt</button>
              <button onClick={handleHomeClick} className="home-button">Home</button>
            </div>

            {/* Moving Image Container */}
            <img
              src="https://res.cloudinary.com/deszclhtq/image/upload/v1728533039/6-modified_u2qxwx.png"
              alt="yellow"
              className="moving-image yellow-moving"
            />
            <img
              src="https://res.cloudinary.com/deszclhtq/image/upload/v1728533089/3-modified_xxva0o.png"
              alt="orange"
              className="moving-image orange-moving"
            />
            <br></br>
            <img
              src="https://res.cloudinary.com/deszclhtq/image/upload/v1728533066/4-modified_g1hsfe.png"
              alt="Pink"
              className="moving-image pink-image"
            />
          </body>
        
        </div>
      )}
    </>
  );
};

export default FrontPage;
