import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MathGame from '../components/mathGame'; // Import the MathGame component

const HomePage = () => {
  const [playGame, setPlayGame] = useState(false); // State to control game visibility
  const userId = 1; // Example user ID; replace with actual user ID logic

  // Define the necessary state variables
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [inventory, setInventory] = useState({});
  const [userFood, setUserFood] = useState([]);
  const [userToiletries, setUserToiletries] = useState([]);
  const [userToys, setUserToys] = useState([]);

  // Define state for counts
  const [foodCount, setFoodCount] = useState(0);
  const [toiletriesCount, setToiletriesCount] = useState(0);
  const [toysCount, setToysCount] = useState(0);

  const [showDetails, setShowDetails] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showUserToys, setShowUserToys] = useState(false);
  const [showUserToiletries, setShowUserToiletries] = useState(false);
  const [showUserFood, setShowUserFood] = useState(false);

  // Fetch the initial pet data and inventory when the component mounts
  useEffect(() => {
    fetchHomeData();
    fetchInventory();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await axios.get('/api/home');
      const { pets, selectedPet, inventory, userFood, userToiletries, userToys } = res.data;
      setPets(pets);
      setSelectedPet(selectedPet);
      setInventory(inventory);
      setUserFood(userFood);
      setUserToiletries(userToiletries);
      setUserToys(userToys);
    } catch (error) {
      console.error('Error fetching home data', error);
    }
  };

  // Fetch inventory from the API and update state
  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/inventory');
      const inventoryData = response.data;
      setInventory(inventoryData.inventory);
      setFoodCount(inventoryData.foodCount);
      setToiletriesCount(inventoryData.toiletriesCount);
      setToysCount(inventoryData.toysCount);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleSelectPet = (petId) => {
    const selected = pets.find(pet => pet.pet_id === parseInt(petId));
    setSelectedPet(selected);
  };

  const handleAction = async (petId, itemId, actionType) => {
    try {
      let endpoint = '';
      if (actionType === 'feed') endpoint = '/api/feed-pet';
      else if (actionType === 'clean') endpoint = '/api/clean-pet';
      else if (actionType === 'play') endpoint = '/api/play-with-pet';

      await axios.post(endpoint, { petId, itemId });
      alert(`Pet ${actionType}ed successfully!`);
      fetchHomeData(); // Refresh the state after the action
    } catch (error) {
      console.error(`Error performing ${actionType} action`, error);
      alert(`Error: ${error.response.data.error}`);
    }
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
        <button onClick={() => setPlayGame(!playGame)}>
          {playGame ? 'Cancel Game' : 'Play Math Game'}
        </button>
      </div>

      {playGame && <MathGame userId={userId} />} {/* Render MathGame if playGame is true */}

      {pets.length > 0 && selectedPet ? (
        <>
          <h1>Welcome {pets[0].user_name}</h1>
          <h2>Select Your Pet</h2>
          <select value={selectedPet.pet_id} onChange={(e) => handleSelectPet(e.target.value)}>
            {pets.map(pet => (
              <option key={pet.pet_id} value={pet.pet_id}>{pet.pet_name}</option>
            ))}
          </select>

          <div id="petDetails">
            <h2>Meet {selectedPet.pet_name}</h2>
            <img src={selectedPet.pet_image} alt={selectedPet.pet_name} style={{ maxWidth: '300px', borderRadius: '10px' }} />
            <p>Energy: {selectedPet.energy}</p>
            <p>Happiness: {selectedPet.happiness}</p>
            <p>Hunger: {selectedPet.hunger}</p>
            <p>Cleanliness: {selectedPet.cleanliness}</p>

            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Hide Details' : 'Show More Details'}
            </button>

            {showDetails && (
              <div>
                <p>Species: {selectedPet.species_name}</p>
                <p>Mood: {selectedPet.mood_name}</p>
                <p>Color: {selectedPet.color_name}</p>
                <p>Personality: {selectedPet.personality_name}</p>
                <p>Hunger Modifier: {selectedPet.hunger_mod}</p>
                <p>Happiness Modifier: {selectedPet.happy_mod}</p>
                <p>Energy Modifier: {selectedPet.energy_mod}</p>
                <p>Cleanliness Modifier: {selectedPet.clean_mod}</p>
                <p>Lifespan: {selectedPet.lifespan}</p>
                <p>Diet Type: {selectedPet.diet_type}</p>
                <p>Diet Description: {selectedPet.diet_desc}</p>
              </div>
            )}
          </div>

          <button onClick={() => setShowInventory(!showInventory)}>Toggle Inventory Data</button>

          {showInventory && (
            <div className="inventory">
              <h2>Inventory Data</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Money</th>
                    <th>User ID</th>
                    <th>Created At</th>
                    <th>Food Count</th>
                    <th>Toiletries Count</th>
                    <th>Toys Count</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Assuming inventory is an array */}
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.money}</td>
                      <td>{item.user_id}</td>
                      <td>{item.created_at}</td>
                      <td>{foodCount}</td>
                      <td>{toiletriesCount}</td>
                      <td>{toysCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div id="userButtons">
            <button onClick={() => setShowUserToys(!showUserToys)}>Toggle User Toys Data</button>
            <button onClick={() => setShowUserToiletries(!showUserToiletries)}>Toggle User Toiletries Data</button>
            <button onClick={() => setShowUserFood(!showUserFood)}>Toggle User Food Data</button>
          </div>

          {showUserToys && (
            <div className="user-data" id="userToysTable">
              <h2>User Toys Data</h2>
              <table>
                <thead>
                  <tr>
                    <th>Toy Image</th>
                    <th>Toy Name</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userToys.map(item => (
                    <tr key={item.item_type_id}>
                      <td><img src={item.toyImage} alt={item.toys_name} width="100" /></td>
                      <td>{item.toys_name}</td>
                      <td>{item.count}</td>
                      <td>
                        <button onClick={() => handleAction(selectedPet.pet_id, item.item_type_id, 'play')} disabled={item.count <= 0}>
                          Play
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showUserToiletries && (
            <div className="user-data" id="userToiletriesTable">
              <h2>User Toiletries Data</h2>
              <table>
                <thead>
                  <tr>
                    <th>Toiletry Image</th>
                    <th>Toiletries Name</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userToiletries.map(item => (
                    <tr key={item.item_type_id}>
                      <td><img src={item.toiletryImage} alt={item.toiletries_name} width="100" /></td>
                      <td>{item.toiletries_name}</td>
                      <td>{item.count}</td>
                      <td>
                        <button onClick={() => handleAction(selectedPet.pet_id, item.item_type_id, 'clean')} disabled={item.count <= 0}>
                          Clean
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showUserFood && (
            <div className="user-data" id="userFoodTable">
              <h2>User Food Data</h2>
              <table>
                <thead>
                  <tr>
                    <th>Food Image</th>
                    <th>Food Name</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userFood.map(item => (
                    <tr key={item.item_type_id}>
                      <td><img src={item.foodImage} alt={item.food_name} width="100" /></td>
                      <td>{item.food_name}</td>
                      <td>{item.count}</td>
                      <td>
                        <button onClick={() => handleAction(selectedPet.pet_id, item.item_type_id, 'feed')} disabled={item.count <= 0}>
                          Feed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p>No pets available at the moment.</p>
      )}
    </div>
  );
};

export default HomePage;
