import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MathModal from './mathModal'; // Adjust the import path to match your project structure
import InventoryModal from './inventoryModal';
import '../styles/navBar.scss';
import LoadingScreen from '../components/loadingScreen';

const NavBar = () => {
  const [playGame, setPlayGame] = useState(false); // State for Math Game modal
  const [showInventory, setShowInventory] = useState(false); // State for Inventory modal
  const userId = 1; // Example user ID, replace with your actual user ID logic
  const [selectedPet, setSelectedPet] = useState(null); // Placeholder for the selected pet

  const [loading, setLoading] = useState(false); // Loading state for the navigation
  const navigate = useNavigate();

  // Toggle Math Game modal
  const toggleMathModal = () => setPlayGame(!playGame);

  // Toggle Inventory modal
  const toggleInventoryModal = () => setShowInventory(!showInventory);

  // Function to handle link click with loading
  const handleLinkClick = (path) => {
    setLoading(true); // Show the loading screen
    setTimeout(() => {
      setLoading(false); // Hide the loading screen after a delay
      navigate(path); // Navigate to the new page
    }, 2000); // Simulated delay for loading (you can adjust or remove this)
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <nav>
          <ul>
            <li>
              <a href="javascript:void(0);" onClick={() => handleLinkClick('/')}>Beastly Bonds</a>
            </li>
            <li>
              <a href="javascript:void(0);" onClick={() => handleLinkClick('/home')}>Pet</a>
            </li>
            <li>
              <a href="javascript:void(0);" onClick={() => handleLinkClick('/shop')}>Shop</a>
            </li>
            <li>
              <a href="javascript:void(0);" onClick={() => handleLinkClick('/adopt')}>Adopt</a>
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
      )}
    </>
  );
};

export default NavBar;
