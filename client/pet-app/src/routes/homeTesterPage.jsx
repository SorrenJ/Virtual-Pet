import React, { useState, useEffect } from 'react';
import UserToysTable from '../components/UserToysTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserFoodTable from '../components/UserFoodTable';

const HomeTesterPage = () => {
    const [pets, setPets] = useState([]); // To store all pets and their stats
    const [selectedPet, setSelectedPet] = useState(null);
    const [userFood, setUserFood] = useState([]); // To store user food data
    const [foodCount, setFoodCount] = useState(0); // To store food count
    const [userToiletries, setUserToiletries] = useState([]);
    const [toiletriesCount, setToiletriesCount] = useState(0);
    const [userToys, setUserToys] = useState([]);
    const [toysCount, setToysCount] = useState(0);
    const [visibleComponent, setVisibleComponent] = useState(null); // To handle component visibility

    // Fetch data when the component is mounted
    useEffect(() => {
        fetchData(); // Fetch data on component mount

        // Set up a periodic update for pet stats (every 60 seconds)
        const intervalId = setInterval(() => {
            fetchData();  // Call fetchData without resetting the selected pet
        }, 60000); // 60 seconds

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // Ensure selected pet is set after pets are fetched
    useEffect(() => {
        if (!selectedPet && pets.length > 0) {
            setSelectedPet(pets[0]); // Set the first pet only if selectedPet is null (first render case)
        }
    }, [pets]);

    // Fetch data for pets and user food
    const fetchData = async () => {
        console.log('Fetching new data...'); // Log when the fetch starts

        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            console.log('Data received:', data); // Log the received data
            setPets(data.pets || []);

            if (data.pets.length > 0) {
                // Find the currently selected pet in the newly fetched pets list
                const existingSelectedPet = data.pets.find(pet => pet.pet_id === selectedPet?.pet_id);

                if (existingSelectedPet) {
                    // Keep the currently selected pet if it exists in the new data
                    setSelectedPet(existingSelectedPet);
                } else {
                    // If the currently selected pet is no longer available, select the first pet
                    setSelectedPet(data.pets[0]);
                }
            }

            setFoodCount(data.foodCount || 0);
            setUserFood(data.userFood || []);
            setToiletriesCount(data.toiletriesCount || 0);
            setUserToiletries(data.userToiletries || []);
            setToysCount(data.toysCount || 0);
            setUserToys(data.userToys || []);
        } catch (error) {
            console.error('Error fetching home data:', error);
        }
    };

    return (
        <div>
            {/* Display the pet details */}
            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0].user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select
                        id="petSelector"
                        value={selectedPet?.pet_id || ''}
                        onChange={(e) => {
                            const pet = pets.find(p => p.pet_id === parseInt(e.target.value));
                            setSelectedPet(pet);
                        }}
                    >
                        {pets.map((pet) => (
                            <option key={pet.pet_id} value={pet.pet_id}>
                                {pet.pet_name}
                            </option>
                        ))}
                    </select>

                    {selectedPet && (
                        <div id="petDetails">
                            <h2>Meet {selectedPet.pet_name}</h2>
                            <img src={selectedPet.pet_image} alt={selectedPet.pet_name} />
                            <br />
                            <p>Energy: {selectedPet.energy}</p>
                            <p>Happiness: {selectedPet.happiness}</p>
                            <p>Hunger: {selectedPet.hunger}</p>
                            <p>Cleanliness: {selectedPet.cleanliness}</p>
                        </div>
                    )}
                </>
            ) : (
                <p>No pets available at the moment.</p>
            )}

            {/* Inventory and other components */}
            <div>
                <h2>Inventory</h2>
                <button onClick={() => setVisibleComponent(1)} disabled={visibleComponent === 1}>
                    Pet Treats
                </button>
                <button onClick={() => setVisibleComponent(2)} disabled={visibleComponent === 2}>
                    Pet Toiletries
                </button>
                <button onClick={() => setVisibleComponent(3)} disabled={visibleComponent === 3}>
                    Pet Toys
                </button>
            </div>

            {/* Render UserFoodTable if visibleComponent is 1 */}
            <div style={{ marginTop: '20px' }}>
                {visibleComponent === 1 && (
                    <UserFoodTable userFood={userFood} feedPet={() => {}} selectedPet={selectedPet} />
                )}

                {visibleComponent === 2 && (
                    <UserToiletriesTable userToiletries={userToiletries} cleanPet={() => {}} selectedPet={selectedPet} />
                )}

                {visibleComponent === 3 && (
                    <UserToysTable userToys={userToys} playWithPet={() => {}} selectedPet={selectedPet} />
                )}
            </div>
        </div>
    );
};

export default HomeTesterPage;
