import React from "react";
import {Helmet} from 'react-helmet'
import '../styles/frontPage.scss';

const FrontPage = () => {
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

      {/* Moving Image Container */}
      <div className="moving-image-container">
        <img
          src="https://res.cloudinary.com/deszclhtq/image/upload/v1728492155/Slugaboo_line-modified_1_p6srdw.png"
          alt="Moving"
          className="moving-image"
        />
      </div>
    </body>
  );
};

export default FrontPage;
