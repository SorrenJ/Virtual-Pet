import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [inventory, setInventory] = useState({});
  const [userFood, setUserFood] = useState([]);
  const [userToiletries, setUserToiletries] = useState([]);
  const [userToys, setUserToys] = useState([]);
  const [foodCount, setFoodCount] = useState(0);
  const [toiletriesCount, setToiletriesCount] = useState(0);
  const [toysCount, setToysCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/home'); // Proxy will forward this to http://localhost:5000/api/home
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const data = await response.json();
        
        // Set the received data to state variables
        setPets(data.pets);
        setSelectedPet(data.selectedPet);
        setInventory(data.inventory);
        setFoodCount(data.foodCount);
        setToiletriesCount(data.toiletriesCount);
        setToysCount(data.toysCount);
        setUserFood(data.userFood);
        setUserToiletries(data.userToiletries);
        setUserToys(data.userToys);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {pets.length > 0 ? (
        <>
          <h1>Welcome {pets[0].user_name}</h1>

          <h2>Select Your Pet</h2>
          <select id="petSelector" onChange={(e) => setSelectedPet(pets.find(pet => pet.pet_id === parseInt(e.target.value)))}>
            {pets.map(pet => (
              <option key={pet.pet_id} value={pet.pet_id}>
                {pet.pet_name}
              </option>
            ))}
          </select>

          {selectedPet && (
            <div id="petDetails">
              <h2>Meet {selectedPet.pet_name}</h2>
              <img src={selectedPet.pet_image} alt={selectedPet.pet_name} />
              <p>Energy: {selectedPet.energy}</p>
              <p>Happiness: {selectedPet.happiness}</p>
              <p>Hunger: {selectedPet.hunger}</p>
              <p>Cleanliness: {selectedPet.cleanliness}</p>
              <div>
                <h3>Food Count: {foodCount}</h3>
                <h3>Toiletries Count: {toiletriesCount}</h3>
                <h3>Toys Count: {toysCount}</h3>
              </div>
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
