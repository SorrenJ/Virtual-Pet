import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MathGame from '../components/mathGame'; // Import the MathGame component

const HomePage = () => {
  const [playGame, setPlayGame] = useState(false); // State to control game visibility
  const userId = 1; // Example user ID; replace with actual user ID logic

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
        <button onClick={() => setPlayGame(!playGame)}>
          {playGame ? 'Cancel Game' : 'Play Math Game'}
        </button>
      </div>

      {playGame && <MathGame userId={userId} />} {/* Render MathGame if playGame is true */}
    </div>
  );
};

export default HomePage;

