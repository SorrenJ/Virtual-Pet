import React, { useEffect, useState } from 'react';
import '../styles/loadingScreen.scss'; // Ensure you create this CSS file and import it

const LoadingScreen = ({ isTransitioning }) => {

  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    // Define an array of phrases
    const phrases = [
      'Take your time ...',
      'Gotta adopt em all ...',
      'Dont forget to come to my shop ...',
      'The real beast is you for not caring for your pet ...',
      'Daily math training keeps your pet sharp ...',
      'Just a shoutout to Lighthouse ...'
    ];

    // Randomly select a phrase
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Set the randomly selected phrase
    setLoadingText(randomPhrase);
  }, []); // Empty dependency array means this effect will only run once when the component mounts


  return (
    <div className={`loading-screen ${isTransitioning ? 'swipe-out' : ''}`}>
      <div className="loading-content">
      <div className='lil-shopkeeper'>
      <img
          src='https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Neutral_grmlj6.png'
          alt="shopkeeper"
          className='shopkeeper'
        />
        </div>
        <h1 className="loading-text">{loadingText}</h1>

        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
