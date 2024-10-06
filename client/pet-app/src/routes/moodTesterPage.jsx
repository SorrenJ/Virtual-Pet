import React, { useState, useEffect } from 'react';
// Import the required components for inventory display
import UserFoodTable from '../components/UserFoodTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserToysTable from '../components/UserToysTable';

const MoodTesterPage = () => {
    const [pets, setPets] = useState([]); // To store all pets and their stats
    const [selectedPet, setSelectedPet] = useState(null); // Track the selected pet
    const [petStats, setPetStats] = useState(null); // Store stats separately
    const [sprite, setSprite] = useState(''); // State for the sprite image (per pet)
    const [moodId, setMoodId] = useState(null); // State for pet's mood
    const [visibleComponent, setVisibleComponent] = useState(1); // State to control which component is visible
    const [userFood, setUserFood] = useState([]); // Store user's food inventory
    const [userToiletries, setUserToiletries] = useState([]); // Store user's toiletries inventory
    const [userToys, setUserToys] = useState([]); // Store user's toys inventory

    // Fetch pet stats function
    const fetchPetStats = async (petId) => {
        try {
            const response = await fetch(`/api/pets-stats/${petId}`);
            const data = await response.json();
            setPetStats(data);
            console.log("Pet stats updated for petId:", petId);

            // Check hunger level and update mood based on hunger
            const newMoodId = data.hunger < 30 ? 5 : 1; // 5 if hungry, 1 otherwise

            // Update mood state if it has changed
            if (newMoodId !== moodId) {
                setMoodId(newMoodId);
                await updatePetMood(petId, newMoodId); // Update the pet's mood on the server
            }
        } catch (error) {
            console.error('Error fetching pet stats or updating mood:', error);
        }
    };

    // Function to update pet mood
    const updatePetMood = async (petId, newMoodId) => {
        try {
            const response = await fetch(`/api/pets-stats/update-mood/${petId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mood_id: newMoodId }),
            });

            if (response.ok) {
                console.log(`Mood updated to ${newMoodId} for petId: ${petId}`);
                // Fetch and update the sprite after mood update
                await fetchPetSprite(petId);
            } else {
                console.error('Failed to update mood');
            }
        } catch (error) {
            console.error('Error updating mood:', error);
        }
    };

    // Function to fetch the pet sprite
    const fetchPetSprite = async (petId) => {
        try {
            const spriteResponse = await fetch(`/api/pets-stats/pet-sprite/${petId}`);
            const spriteData = await spriteResponse.json();
            setSprite(spriteData.image_url); // Update sprite image
            console.log('Sprite updated:', spriteData.image_url, 'for petId:', petId);
        } catch (error) {
            console.error('Error fetching sprite:', error);
        }
    };

    // Fetch general data (pets and user resources)
    const fetchGeneralData = async () => {
        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            console.log('General data received:', data);
            setPets(data.pets || []);
            setUserFood(data.userFood || []); // Set user's food inventory
            setUserToiletries(data.userToiletries || []); // Set user's toiletries inventory
            setUserToys(data.userToys || []); // Set user's toys inventory

            if (!selectedPet && data.pets.length > 0) {
                const firstPet = data.pets[0];
                setSelectedPet(firstPet); // Select the first pet if none is selected
                fetchPetStats(firstPet.pet_id); // Fetch stats for the first pet
                fetchPetSprite(firstPet.pet_id); // Fetch sprite for the first pet
            }
        } catch (error) {
            console.error('Error fetching general data:', error);
        }
    };

    // Function to reduce hunger (your specific button)
    const reduceHunger = async (amount) => {
        if (!selectedPet) return;

        try {
            const response = await fetch(`/api/pets-stats/reduce-hunger/${selectedPet.pet_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: -amount }), // Sending negative amount to reduce hunger
            });

            if (response.ok) {
                const updatedPetStats = await response.json();
                setPetStats(updatedPetStats); // Update the pet stats with the new data
                console.log(`Hunger reduced by ${amount}. New hunger level: ${updatedPetStats.hunger}`);

                // Ensure hunger conditional logic works properly here
                if (updatedPetStats.hunger < 30 && moodId !== 5) {
                    // Pet is hungry, update mood to hungry
                    await updatePetMood(selectedPet.pet_id, 5);
                } else if (updatedPetStats.hunger >= 30 && moodId !== 1) {
                    // Pet is not hungry, update mood to normal
                    await updatePetMood(selectedPet.pet_id, 1);
                }
            } else {
                console.error('Failed to reduce hunger');
            }
        } catch (error) {
            console.error('Error reducing hunger:', error);
        }
    };

    // Function to clean the pet (increases cleanliness)
    const cleanPet = async () => {
        if (!selectedPet) return;

        try {
            const response = await fetch(`/api/pets-stats/clean/${selectedPet.pet_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 10 }), // Increase cleanliness by 10
            });

            if (response.ok) {
                const updatedPetStats = await response.json();
                setPetStats(updatedPetStats); // Update the pet stats with the new data
                console.log('Pet cleaned. New cleanliness:', updatedPetStats.cleanliness);
            } else {
                console.error('Failed to clean pet');
            }
        } catch (error) {
            console.error('Error cleaning pet:', error);
        }
    };

    // Function to play with the pet (increases happiness)
    const playWithPet = async () => {
        if (!selectedPet) return;

        try {
            const response = await fetch(`/api/pets-stats/play/${selectedPet.pet_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 10 }), // Increase happiness by 10
            });

            if (response.ok) {
                const updatedPetStats = await response.json();
                setPetStats(updatedPetStats); // Update the pet stats with the new data
                console.log('Pet played with. New happiness:', updatedPetStats.happiness);
            } else {
                console.error('Failed to play with pet');
            }
        } catch (error) {
            console.error('Error playing with pet:', error);
        }
    };

    // UseEffect to fetch stats when selected pet changes
    useEffect(() => {
        if (selectedPet) {
            fetchPetStats(selectedPet.pet_id); // Fetch stats for the currently selected pet
            fetchPetSprite(selectedPet.pet_id); // Fetch sprite for the currently selected pet
        }
    }, [selectedPet]); // Trigger when the selected pet changes

    // Fetch general pet and user data on mount
    useEffect(() => {
        fetchGeneralData();
    }, []);

    return (
        <div>
            {/* Display the pet details */}
            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0]?.user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select
                        id="petSelector"
                        value={selectedPet?.pet_id || ''}
                        onChange={(e) => {
                            const pet = pets.find(p => p.pet_id === parseInt(e.target.value));
                            setSelectedPet(pet); // Set selected pet
                        }}
                    >
                        {pets.map((pet) => (
                            <option key={pet.pet_id} value={pet.pet_id}>
                                {pet.pet_name}
                            </option>
                        ))}
                    </select>

                    {selectedPet && petStats && (
                        <div id="petDetails">
                            <h2>Meet {selectedPet.pet_name}</h2>
                            <img src={sprite || selectedPet.pet_image} alt={selectedPet.pet_name} /> {/* Sprite updates dynamically */}
                            <br />
                            <p>Energy: {petStats.energy}</p>
                            <p>Happiness: {petStats.happiness}</p>
                            <p>Hunger: {petStats.hunger}</p>
                            <p>Cleanliness: {petStats.cleanliness}</p>
                            <br />
                            <p>Species: {selectedPet.species_name}</p>
                            <p>Diet: {selectedPet.diet_desc}</p>
                            <p>Personality: {selectedPet.personality_name}</p>

                            {/* Button to reduce hunger */}
                            <button onClick={() => reduceHunger(10)}>Feed Pet (Reduce Hunger by 10)</button>
                        </div>
                    )}
                </>
            ) : (
                <p>No pets available at the moment.</p>
            )}

            {/* Inventory Section */}
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

            <div style={{ marginTop: '20px' }}>
                {visibleComponent === 1 && (
                    <UserFoodTable userFood={userFood} feedPet={reduceHunger} selectedPet={selectedPet} />
                )}

                {visibleComponent === 2 && (
                    <UserToiletriesTable userToiletries={userToiletries} cleanPet={cleanPet} selectedPet={selectedPet} />
                )}

                {visibleComponent === 3 && (
                    <UserToysTable userToys={userToys} playWithPet={playWithPet} selectedPet={selectedPet} />
                )}
            </div>
        </div>
    );
};

export default MoodTesterPage;
