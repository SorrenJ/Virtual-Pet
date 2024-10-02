// src/pages/HomePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MathModal from './mathModal'; // Import MathModal component

const HomePage = () => {
  const [playGame, setPlayGame] = useState(false); // State to control modal visibility
  const userId = 1; // Example user ID; replace with actual user ID logic

  // Function to toggle the modal
  const toggleModal = () => {
    setPlayGame(!playGame);
  };

  return (
    <div>
      <h1>Welcome to Beastly Bonds! Adopting a monster has never been easier!</h1>
      <div style={{ marginBottom: '10px' }}>
        <Link to="/shop">Go to Shop</Link>
      </div>
      <div>
        <Link to="/adopt">Go to Adopt</Link>
      </div>
      <div>
        <button onClick={toggleModal}>
          {playGame ? 'Cancel Game' : 'Play Math Game'}
        </button>
      </div>

      {/* Render MathModal component */}
      <MathModal isOpen={playGame} onRequestClose={toggleModal} userId={userId} />
    </div>
  );
};

export default HomePage;
