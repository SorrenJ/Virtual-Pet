import React from "react";
import {Helmet} from 'react-helmet'
import {Navigate, useNavigate} from 'react-router-dom'
import '../styles/frontPage.scss';

const FrontPage = () => {
  const Navigate = useNavigate();
  const handleAdoptClick = () => {
    Navigate('/adopt'); // Redirect to /adopt page
  };

  const handleHomeClick = () => {
    Navigate('/home'); // Redirect to /home page
  };

  return (
    <body>
      <Helmet>
        <title>Front Page</title>
      </Helmet>
      <div className="logo">
        Welcome to
      {/* Logo Image */}
      <img 
        src="https://res.cloudinary.com/deszclhtq/image/upload/v1728492346/2-modified_qzohk3.png"
        alt="beastly-bond"
        className="beastly-bond-logo" 
      />
      </div>
      <div className="button-container">
        <button onClick={handleAdoptClick} className="adopt-button">Adopt</button>
        <button onClick={handleHomeClick} className="home-button">Home</button>
        </div>

      {/* Moving Image Container */}
      <div className="moving-image-container">
        <img
          src="https://res.cloudinary.com/deszclhtq/image/upload/v1728506338/Slugaboo_line-modified_1_1_vw9wbq.png"
          alt="Moving"
          className="moving-image"
        />
      </div>
    </body>
  );
};

export default FrontPage;
