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
      <img
          src="https://res.cloudinary.com/deszclhtq/image/upload/v1728533043/5-modified_bxuj8q.png"
          alt="Red"
          className="moving-image red-moving"
        />
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
  );
};

export default FrontPage;
