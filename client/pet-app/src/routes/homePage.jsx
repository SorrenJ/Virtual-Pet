import React, { useState, useEffect } from 'react';

const HomePage = () => {
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
    const [visibleTable, setVisibleTable] = useState(null); // To manage which table is visible

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

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

    const fetchPetStats = async () => {
        try {
            const response = await fetch('/api/pets-stats');
            const petStats = await response.json();

            // Update each pet's stats in the state
            setPets((prevPets) =>
                prevPets.map((pet) =>
                    petStats.find((p) => p.pet_id === pet.pet_id) || pet
                )
            );
        } catch (error) {
            console.error('Error fetching pet stats:', error);
        }
    };

    // Use setInterval to fetch the pet stats every 0.1 seconds
    useEffect(() => {
        const interval = setInterval(fetchPetStats, 100);
        return () => clearInterval(interval);
    }, []);

    const toggleDetails = () => {
        setDetailsVisible((prev) => !prev);
    };

    const toggleInventory = () => {
        setInventoryVisible((prev) => !prev);
    };

    const toggleTable = (tableId) => {
        setVisibleTable((prevTable) => (prevTable === tableId ? null : tableId));
    };

    const switchPet = async () => {
        try {
            const response = await fetch('/switch-pet', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newPet = await response.json();
            setSelectedPet(newPet);
        } catch (error) {
            console.error('Error switching pet:', error);
        }
    };

    const feedPet = async (petId, foodId) => {
        try {
            const response = await fetch('/feed-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, foodId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('Pet fed successfully!');
                fetchData(); // Fetch updated data
            }
        } catch (error) {
            console.error('Error feeding pet:', error);
        }
    };

    const cleanPet = async (petId, toiletriesId) => {
        try {
            const response = await fetch('/clean-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, toiletriesId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('Pet cleaned successfully!');
                fetchData(); // Fetch updated data
            }
        } catch (error) {
            console.error('Error cleaning pet:', error);
        }
    };

    const playWithPet = async (petId, toyId) => {
        try {
            const response = await fetch('/play-with-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, toyId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('Pet played with successfully!');
                fetchData(); // Fetch updated data
            }
        } catch (error) {
            console.error('Error playing with pet:', error);
        }
    };

    return (
        <div>
            <h3>Explore More:</h3>
            <a href="/home">Go home</a>
            <a href="/adopt">Adopt a Pet</a>
            <a href="/shop">Visit the Shop</a>
            <a href="/all_tables">View All Tables</a>

            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0].user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select
                        id="petSelector"
                        onChange={(e) => setSelectedPet(pets.find(p => p.pet_id === parseInt(e.target.value)))}
                    >
                        {pets.map((pet) => (
                            <option
                                key={pet.pet_id}
                                value={pet.pet_id}
                                selected={pet.pet_id === selectedPet?.pet_id}
                            >
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
                        {inventoryVisible ? 'Hide Inventory Data' : 'Show Inventory Data'}
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
                                    {inventory.map((item) => (
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

                            <div id="userButtons">
                                <button onClick={() => toggleTable('userToysTable')}>Toggle User Toys Data</button>
                                <button onClick={() => toggleTable('userToiletriesTable')}>Toggle User Toiletries Data</button>
                                <button onClick={() => toggleTable('userFoodTable')}>Toggle User Food Data</button>
                            </div>
                        </div>
                    )}

                    {visibleTable === 'userToysTable' && (
                        <div className="user-data" id="userToysTable">
                            <h2>User Toys Data</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Toy Name</th>
                                        <th>Count</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userToys.map((item) => (
                                        <tr key={item.item_type_id}>
                                            <td><img src={item.toy_image} alt={item.toys_name} width="100" /></td>
                                            <td>{item.toys_name}</td>
                                            <td>{item.count}</td>
                                            <td>
                                                <button
                                                    onClick={() => playWithPet(selectedPet.pet_id, item.item_type_id)}
                                                    disabled={item.count <= 0}
                                                >
                                                    Play
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {visibleTable === 'userToiletriesTable' && (
                        <div className="user-data" id="userToiletriesTable">
                            <h2>User Toiletries Data</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Toiletries Name</th>
                                        <th>Count</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userToiletries.map((item) => (
                                        <tr key={item.item_type_id}>
                                            <td><img src={item.toiletry_image} alt={item.toiletries_name} width="100" /></td>
                                            <td>{item.toiletries_name}</td>
                                            <td>{item.count}</td>
                                            <td>
                                                <button
                                                    onClick={() => cleanPet(selectedPet.pet_id, item.item_type_id)}
                                                    disabled={item.count <= 0}
                                                >
                                                    Clean
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {visibleTable === 'userFoodTable' && (
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
                                    {userFood.map((item) => (
                                        <tr key={item.item_type_id}>
                                            <td><img src={item.food_image} alt={item.food_name} width="100" /></td>
                                            <td>{item.food_name}</td>
                                            <td>{item.count}</td>
                                            <td>
                                                <button
                                                    onClick={() => feedPet(selectedPet.pet_id, item.item_type_id)}
                                                    disabled={item.count <= 0}
                                                >
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
