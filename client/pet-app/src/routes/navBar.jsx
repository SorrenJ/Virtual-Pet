// src/components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MathModal from './mathModal'; // Adjust the import path to match your project structure

const NavBar = () => {
  const [playGame, setPlayGame] = useState(false); // State to control modal visibility
  const userId = 1; // Example user ID; replace with actual user ID logic

  // Function to toggle the modal
  const toggleModal = () => {
    setPlayGame(!playGame);
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: '#fff' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '15px' }}>
        <li>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        </li>
        <li>
          <Link to="/shop" style={{ color: '#fff', textDecoration: 'none' }}>Shop</Link>
        </li>
        <li>
          <Link to="/adopt" style={{ color: '#fff', textDecoration: 'none' }}>Adopt</Link>
        </li>
        <li>
          <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
        </li>
        <li>
          <button onClick={toggleModal} style={{ backgroundColor: '#555', color: '#fff', border: 'none', padding: '5px 10px' }}>
            {playGame ? 'Cancel Game' : 'Play Math Game'}
          </button>
        </li>
      </ul>

      {/* Render MathModal component */}
      <MathModal isOpen={playGame} onRequestClose={toggleModal} userId={userId} />
    </nav>
  );
};

export default NavBar;
