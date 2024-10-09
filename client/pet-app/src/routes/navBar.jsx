// src/components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MathModal from './mathModal'; // Adjust the import path to match your project structure
import InventoryModal from './inventoryModal'
import '../styles/navBar.scss';

const NavBar = () => {
  const [playGame, setPlayGame] = useState(false); // State for Math Game modal
  const [showInventory, setShowInventory] = useState(false); // State for Inventory modal
  const userId = 1; // Example user ID, replace with your actual user ID logic
  const [selectedPet, setSelectedPet] = useState(null); // Placeholder for the selected pet

  // Toggle Math Game modal
  const toggleMathModal = () => setPlayGame(!playGame);

  // Toggle Inventory modal
  const toggleInventoryModal = () => setShowInventory(!showInventory);

  return (
    <nav>
      <ul>
        <li>Beastly Bonds</li>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <a href="javascript:void(0);" onClick={toggleInventoryModal} className="inventory-link">
            Inventory
          </a>
        </li>
        <li>
          <Link to="/adopt">Adopt</Link>
        </li>
        <li>
          <a href="javascript:void(0);" onClick={toggleMathModal} className="game-link">
            {playGame ? 'Cancel Game' : 'Play Math Game'}
          </a>
        </li>
      </ul>

      {/* Render MathModal component */}
      <MathModal isOpen={playGame} onRequestClose={toggleMathModal} userId={userId} />

      {/* Render InventoryModal component */}
      <InventoryModal isOpen={showInventory} onRequestClose={toggleInventoryModal} selectedPet={selectedPet} />
    </nav>
  );
};

export default NavBar;