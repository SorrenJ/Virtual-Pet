import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import UserToysTable from '../components/UserToysTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserFoodTable from '../components/UserFoodTable';
import MathGame from '../components/mathGame'; // Import the MathGame component
const HomePage = () => {
    const [playGame, setPlayGame] = useState(false); // State to control game visibility
    
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
        fetchData();
    }, []);

    // Fetch data for pets and user food
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/home?selectedPetId=${selectedPet ? selectedPet.pet_id : 1}`);
            const data = await response.json();

            setPets(data.pets || []);
            setSelectedPet(data.selectedPet || null);
            setFoodCount(data.foodCount || 0);
            setUserFood(data.userFood || []);

            setToiletriesCount(data.toiletriesCount || 0);
            setUserToiletries(data.userToiletries || []);


            setToysCount(data.toysCount || 0);
            setUserToys(data.userToys || []);


            console.log('Fetched userFood data in HomePage:', data.userFood);
        } catch (error) {
            console.error('Error fetching home data:', error);
        }
    };

    // Function to handle feeding the pet
    const feedPet = async (petId, foodId) => {
        try {
            console.log('Feeding pet:', petId, 'with food:', foodId);  // Debug
            if (!petId || !foodId) {
                throw new Error('Missing petId or foodId');
            }

            const response = await fetch('/api/feed-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, foodId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);  // Log the error response
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


     // Function to handle feeding the pet
     const cleanPet = async (petId, toiletriesId) => {
        try {
            console.log('Feeding pet:', petId, 'with toiletry:', toiletriesId);  // Debug
            if (!petId || !toiletriesId) {
                throw new Error('Missing petId or toiletriesId');
            }

            const response = await fetch('/api/clean-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, toiletriesId}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);  // Log the error response
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

 // Function to handle feeding the pet
 const playWithPet = async (petId, toyId) => {
    try {
        console.log('Playing pet:', petId, 'with toy:', toyId);  // Debug
        if (!petId || !toyId) {
            throw new Error('Missing petId or toyId');
        }

        const response = await fetch('/api/play-with-pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ petId, toyId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);  // Log the error response
            alert(`Error: ${errorData.error}`);
            return;
        }

        const data = await response.json();
        if (data.success) {
            alert('Pet play successfully!');
            fetchData(); // Fetch updated data
        }
    } catch (error) {
        console.error('Error playing pet:', error);
    }
};

    return (
        <div>
   <div className="links">
        <h3>Explore More:</h3>
        <a href="/">Go home</a>
        <a href="/adopt">Adopt a Pet</a>
        <a href="/shop">Visit the Shop</a>  
      </div>

            {/* Display the pet details */}
            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0].user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select
                        id="petSelector"
                        value={selectedPet?.pet_id || ''}
                        onChange={(e) => {
                            console.log("selected your pet");
                            setSelectedPet(pets.find(p => p.pet_id === parseInt(e.target.value)));
                        }}
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
                            <br/>
                            <p>Current Mood: {selectedPet.mood_name}</p>
                            <br/>
                            <p>Energy: {selectedPet.energy}</p>
                            <p>Happiness: {selectedPet.happiness}</p>
                            <p>Hunger: {selectedPet.hunger}</p>
                            <p>Cleanliness: {selectedPet.cleanliness}</p>
                        <br/>
                        <p>Species: {selectedPet.species_name}</p>
                        <p>Diet: {selectedPet.diet_desc}</p>
                        <p>Personality: {selectedPet.personality_name}</p>
                        </div>
                    )}
                </>
            ) : (
                <p>No pets available at the moment.</p>
            )}

            {/* Button to toggle Component One */}
            <div>
            <h2>Inventory</h2>
                <button 
                    onClick={() => setVisibleComponent(1)} 
                    disabled={visibleComponent === 1}>
                    Pet Treats
                </button>

                <button 
                    onClick={() => setVisibleComponent(2)} 
                    disabled={visibleComponent === 2}>
                    Pet Toiletries
                </button>

                <button 
                    onClick={() => setVisibleComponent(3)} 
                    disabled={visibleComponent === 3}>
                   Pet Toys
                </button>
            </div>

            {/* Render UserFoodTable if visibleComponent is 1 */}
            <div style={{ marginTop: '20px' }}>
                {visibleComponent === 1 && <UserFoodTable 
                        userFood={userFood} 
                        feedPet={feedPet} 
                        selectedPet={selectedPet}
                />}

                {visibleComponent === 2 && <UserToiletriesTable 
                        userToiletries={userToiletries} 
                        cleanPet={cleanPet} 
                        selectedPet={selectedPet}
                />}            
                
                {visibleComponent === 3 && <UserToysTable
                        userToys={userToys} 
                        playWithPet={playWithPet} 
                        selectedPet={selectedPet}
                />}  
            </div>
            <button onClick={() => setPlayGame(!playGame)}>
          {playGame ? 'Cancel Game' : 'Play Math Game'}
        </button>
        
        </div>
    );
};

export default HomePage;
