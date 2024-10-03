import React, { useState, useEffect } from 'react';
import UserFoodTable from '../components/UserFoodTable'; 

const HomeTesterPage = () => {
    const [pets, setPets] = useState([]); // To store all pets and their stats
    const [selectedPet, setSelectedPet] = useState(null);
    const [userFood, setUserFood] = useState([]); // To store user food data
    const [foodCount, setFoodCount] = useState(0); // To store food count
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

            {/* Button to toggle Component One */}
            <div>
                <button 
                    onClick={() => setVisibleComponent(1)} 
                    disabled={visibleComponent === 1}>
                    Show Component One
                </button>
            </div>

            {/* Render UserFoodTable if visibleComponent is 1 */}
            <div style={{ marginTop: '20px' }}>
                {visibleComponent === 1 && <UserFoodTable 
                        userFood={userFood} 
                        feedPet={feedPet} 
                        selectedPet={selectedPet}
                />}
            </div>
        </div>
    );
};

export default HomeTesterPage;
