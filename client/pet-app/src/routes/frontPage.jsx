import React, { useState } from "react"; // Import useState
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import '../styles/frontPage.scss';
import LoadingScreen from '../components/loadingScreen'; // Ensure you have the correct path to your loading screen component

const FrontPage = () => {
  const [loading, setLoading] = useState(false); // State to manage the loading screen
  const navigate = useNavigate();

  const handleAdoptClick = () => {
    setLoading(true); // Show the loading screen
    setTimeout(() => {
      navigate('/adopt'); // Redirect to /adopt page after a delay
    }, 2000); // Simulate loading delay
  };

  const handleHomeClick = () => {
    setLoading(true); // Show the loading screen
    setTimeout(() => {
      navigate('/home'); // Redirect to /home page after a delay
    }, 2000); // Simulate loading delay
  };

  return (
    <>
      {loading ? (
        <LoadingScreen /> // Display the loading screen when loading state is true
      ) : (
        <div className="colored-bg">
          <div className="overlay"></div>

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
