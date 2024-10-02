import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import UserToysTable from '../components/UserToysTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserFoodTable from '../components/UserFoodTable';

const HomePage = () => {
    const { id } = useParams(); // Get dynamic param like /home/:id
    const location = useLocation(); // Get the current route
    const [pets, setPets] = useState([]); // To store all pets and their stats
    const [selectedPet, setSelectedPet] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [userFood, setUserFood] = useState([]);
    const [userToiletries, setUserToiletries] = useState([]);
    const [userToys, setUserToys] = useState([]);
    const [foodCount, setFoodCount] = useState(0);
    const [toiletriesCount, setToiletriesCount] = useState(0);
    const [toysCount, setToysCount] = useState(0);
    const [visibleTable, setVisibleTable] = useState(null); // To manage which table is visible
    const [inventoryVisible, setInventoryVisible] = useState(false); // Add this back

    // Fetch data when the component is mounted or when the route (id or location) changes
    useEffect(() => {
        fetchData();
    }, [id, location]);

    // Fetch data based on the current route
    const fetchData = async () => {
        try {
            // Fetch the general home data
            const response = await fetch('/api/home');
    
            // Check if the response is OK (status 200-299)
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            // Try parsing the JSON body
            const data = await response.json();
    
            // Check if we received valid data
            if (!data) {
                throw new Error('No data received from the server');
            }
    
            // Set state with the received data
            setPets(data.pets || []);
            setSelectedPet(data.selectedPet || null);
            setInventory(data.inventory || []);
            setFoodCount(data.foodCount || 0);
            setToiletriesCount(data.toiletriesCount || 0);
            setToysCount(data.toysCount || 0);
            setUserFood(data.userFood || []);
            setUserToiletries(data.userToiletries || []);
            setUserToys(data.userToys || []);
    
        } catch (error) {
            // Log detailed error for debugging
            console.error('Error fetching home data:', error);
        }
    };
    

    // Fetch updated pet stats from the server
    const fetchPetStats = async () => {
        try {
            const response = await fetch('/api/pets-stats');
            const petStats = await response.json();

            // Update the pets state with the new stats
            setPets((prevPets) =>
                prevPets.map((pet) =>
                    petStats.find((p) => p.pet_id === pet.pet_id) || pet
                )
            );
        } catch (error) {
            console.error('Error fetching pet stats:', error);
        }
    };

    // Fetch pet stats every 0.1 seconds
    useEffect(() => {
        const interval = setInterval(fetchPetStats, 100); // Fetch every 0.1 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const toggleInventory = () => {
        setInventoryVisible(prev => !prev); // Toggle inventory visibility
    };

    // Function to handle feeding the pet
    const feedPet = async (petId, foodId) => {
        try {
            const response = await fetch('/api/feed-pet', {
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

    // Function to handle cleaning the pet
    const cleanPet = async (petId, toiletriesId) => {
        try {
            const response = await fetch('/api/clean-pet', {
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

    // Function to handle playing with the pet
    const playWithPet = async (petId, toyId) => {
        try {
            const response = await fetch('/api/play-with-pet', {
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
            <a href="/home/adopt">Adopt a Pet</a>
            <a href="/shop">Visit the Shop</a>
            <a href="/all_tables">View All Tables</a>

            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0].user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select
                        id="petSelector"
                        value={selectedPet?.pet_id || ''}
                        onChange={(e) => setSelectedPet(pets.find(p => p.pet_id === parseInt(e.target.value)))}
                    >
                        {pets.map((pet) => (
                            <option
                                key={pet.pet_id}
                                value={pet.pet_id}
                            >
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
                        </div>
                    )}
                </>
            ) : (
                <p>No pets available at the moment.</p>
            )}

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
                        <button onClick={() => setVisibleTable('userToysTable')}>Toggle User Toys Data</button>
                        <button onClick={() => setVisibleTable('userToiletriesTable')}>Toggle User Toiletries Data</button>
                        <button onClick={() => setVisibleTable('userFoodTable')}>Toggle User Food Data</button>
                    </div>
                </div>
            )}

            {visibleTable === 'userToysTable' && (
                <UserToysTable userToys={userToys} playWithPet={playWithPet} selectedPet={selectedPet} />
            )}

            {visibleTable === 'userToiletriesTable' && (
                <UserToiletriesTable userToiletries={userToiletries} cleanPet={cleanPet} selectedPet={selectedPet} />
            )}

            {visibleTable === 'userFoodTable' && (
                <UserFoodTable userFood={userFood} feedPet={feedPet} selectedPet={selectedPet} />
            )}
        </div>
    );
};

export default HomePage;
