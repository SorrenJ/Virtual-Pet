import React, { useState, useEffect } from 'react';
import UserToysTable from '../components/UserToysTable'; // Adjust the import path as necessary
import UserToiletriesTable from '../components/UserToiletriesTable'; // Adjust the import path as necessary
import UserFoodTable from '../components/UserFoodTable'; // Adjust the import path as necessary

function HomePage() {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [userFood, setUserFood] = useState([]);
    const [userToiletries, setUserToiletries] = useState([]);
    const [userToys, setUserToys] = useState([]);
    const [foodCount, setFoodCount] = useState(0);
    const [toiletriesCount, setToiletriesCount] = useState(0);
    const [toysCount, setToysCount] = useState(0);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [inventoryVisible, setInventoryVisible] = useState(false);
    const [userToysVisible, setUserToysVisible] = useState(false);
    const [userToiletriesVisible, setUserToiletriesVisible] = useState(false);
    const [userFoodVisible, setUserFoodVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/home');
                const data = await response.json();
                setPets(data.pets);
                setSelectedPet(data.selectedPet);
                setInventory(data.inventory);
                setFoodCount(data.foodCount);
                setToiletriesCount(data.toiletriesCount);
                setToysCount(data.toysCount);
                setUserFood(data.userFood);
                setUserToiletries(data.userToiletries);
                setUserToys(data.userToys);
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleDetails = () => {
        setDetailsVisible(!detailsVisible);
    };

    const toggleInventory = () => {
        setInventoryVisible(!inventoryVisible);
    };

    const toggleUserToys = () => {
        setUserToysVisible(!userToysVisible);
    };

    const toggleUserToiletries = () => {
        setUserToiletriesVisible(!userToiletriesVisible);
    };

    const toggleUserFood = () => {
        setUserFoodVisible(!userFoodVisible);
    };

    const selectPet = async (petId) => {
        try {
            const response = await fetch(`/api/home?selectedPetId=${petId}`);
            const newSelectedPet = await response.json();
            setSelectedPet(newSelectedPet.selectedPet);
        } catch (error) {
            console.error('Error selecting pet:', error);
        }
    };

    const switchPet = async () => {
        try {
            const response = await fetch('/switch-pet');
            const newPet = await response.json();
            setSelectedPet(newPet);
        } catch (error) {
            console.error('Error switching pet:', error);
        }
    };

    const feedPet = async (petId, foodId) => {
        try {
            const response = await fetch('/api/feed-pet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, foodId }),
            });

            if (response.ok) {
                const updatedPet = await response.json(); // Get updated pet details
                setSelectedPet(updatedPet.updatedPet); // Set the updated pet details
                alert('Pet fed successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error feeding pet:', error);
        }
    };

    const cleanPet = async (petId, toiletriesId) => {
        try {
            const response = await fetch('/api/clean-pet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, toiletriesId }),
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setSelectedPet(updatedPet.updatedPet);
                alert('Pet cleaned successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error cleaning pet:', error);
        }
    };

    const playWithPet = async (petId, toyId) => {
        try {
            const response = await fetch('/api/play-with-pet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, toyId }),
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setSelectedPet(updatedPet.updatedPet);
                alert('Pet played with successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error playing with pet:', error);
        }
    };

    return (
        <div>
            <div className="links">
                <h3>Explore More:</h3>
                <a href="/home">Go home</a>
                <a href="/adopt">Adopt a Pet</a>
                <a href="/shop">Visit the Shop</a>
                <a href="/all_tables">View All Tables</a>
            </div>

            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0].user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select id="petSelector" onChange={(e) => selectPet(e.target.value)}>
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
                            <p>Energy: <span id={`energy-${selectedPet.pet_id}`}>{selectedPet.energy}</span></p>
                            <p>Happiness: <span id={`happiness-${selectedPet.pet_id}`}>{selectedPet.happiness}</span></p>
                            <p>Hunger: <span id={`hunger-${selectedPet.pet_id}`}>{selectedPet.hunger}</span></p>
                            <p>Cleanliness: <span id={`cleanliness-${selectedPet.pet_id}`}>{selectedPet.cleanliness}</span></p>

                            <button onClick={toggleDetails}>
                                {detailsVisible ? 'Hide Details' : 'Show More Details'}
                            </button>

                            {detailsVisible && (
                                <div className="hidden-details">
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
                    )}

                    <button onClick={switchPet}>Switch Pet</button>
                    <button onClick={toggleInventory}>
                        {inventoryVisible ? 'Hide Inventory Data' : 'Toggle Inventory Data'}
                    </button>

                    {inventoryVisible && (
                        <div className="inventory" id="inventoryTable">
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

                    <div id="userButtons" style={{ display: inventoryVisible ? 'block' : 'none' }}>
                        <button onClick={toggleUserToys}>Toggle User Toys Data</button>
                        <button onClick={toggleUserToiletries}>Toggle User Toiletries Data</button>
                        <button onClick={toggleUserFood}>Toggle User Food Data</button>
                    </div>

                    {userToysVisible && (
                        <UserToysTable userToys={userToys} playWithPet={playWithPet} />
                    )}

                    {userToiletriesVisible && (
                        <UserToiletriesTable userToiletries={userToiletries} cleanPet={cleanPet} />
                    )}

                    {userFoodVisible && (
                        <UserFoodTable userFood={userFood} feedPet={feedPet} />
                    )}
                </>
            ) : (
                <p>No pets available at the moment.</p>
            )}
        </div>
    );
}

export default HomePage;
