// src/components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MathModal from './mathModal'; // Adjust the import path to match your project structure
import '../styles/navBar.scss';

const NavBar = () => {
  const [playGame, setPlayGame] = useState(false); // State to control modal visibility
  const userId = 1; // Example user ID; replace with actual user ID logic

  // Function to toggle the modal
  const toggleModal = () => {
    setPlayGame(!playGame);
  };

  return (
    <nav>
      <ul>

        <li>Beastly Bonds</li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/adopt">Adopt</Link>
        </li>
        <li>
          {/* Use javascript:void(0) to prevent navigation */}
          <a href="javascript:void(0);" onClick={toggleModal} className="game-link">
            {playGame ? 'Cancel Game' : 'Play Math Game'}
          </a>
        </li>
      </ul>

      {/* Render MathModal component */}
      <MathModal isOpen={playGame} onRequestClose={toggleModal} userId={userId} />
    </nav>
  );
};

export default NavBar;
