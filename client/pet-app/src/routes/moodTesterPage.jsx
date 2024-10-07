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
    const [isUpdated, setIsUpdated] = useState(false); // Track when to refresh

    // UseEffect to fetch stats when selected pet changes
    useEffect(() => {
        if (selectedPet) {
            fetchPetStats(selectedPet.pet_id);
            fetchPetSprite(selectedPet.pet_id);
        }
    }, [selectedPet]);

    // Fetch general pet and user data on mount
    useEffect(() => {
        const savedSelectedPetId = localStorage.getItem('selectedPetId');
        fetchGeneralData(savedSelectedPetId);
    }, []);

    // Fetch general data (pets and user resources)
    const fetchGeneralData = async (savedSelectedPetId) => {
        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            console.log('General data received:', data);
            setPets(data.pets || []);
            setUserFood(data.userFood || []);
            setUserToiletries(data.userToiletries || []);
            setUserToys(data.userToys || []);
    
            if (data.pets.length > 0) {
                const restoredPet = data.pets.find(p => p.pet_id === parseInt(savedSelectedPetId));
                const firstPet = restoredPet || data.pets[0];
                setSelectedPet(firstPet);
            }
        } catch (error) {
            console.error('Error fetching general data:', error);
        }
    };
    


    const fetchPetStats = async (petId, excludeMoodId4 = false) => {
        try {
            const response = await fetch(`/api/pets-stats/${petId}`);
            const data = await response.json();
            setPetStats(data);
            console.log("Pet stats updated for petId:", petId);
    
            // Determine mood based on stat thresholds
            const hungerMoodId = data.hunger < 30 ? 5 : 1; // Default to 1 if no mood
            const energyMoodId = data.energy < 30 ? 6 : 1; // Default to 1 if no mood
            const happinessMoodId = data.happiness < 30 ? 12 : 1; // Default to 1 if no mood
            const cleanlinessMoodId = data.cleanliness < 30 ? 9 : 1; // Default to 1 if no mood
    
            // Collect all the moods that need to be considered
           const moodOptions = [
                { stat: 'hunger', value: data.hunger, id: hungerMoodId },
                { stat: 'energy', value: data.energy, id: energyMoodId },
                { stat: 'happiness', value: data.happiness, id: happinessMoodId },
                { stat: 'cleanliness', value: data.cleanliness, id: cleanlinessMoodId }
            ];
    
                  // If excludeMoodId4 is true, filter out mood_id 4
                  const filteredMoodOptions = excludeMoodId4
                  ? moodOptions.filter(option => option.id !== 4)
                  : moodOptions;
      
              // Sort by the lowest stat value first, and in case of a tie, use the smallest mood ID
              filteredMoodOptions.sort((a, b) => a.value - b.value || a.id - b.id);
            // Select the moodId of the lowest stat
            const newMoodId = moodOptions[0].id;
    
            if (newMoodId !== moodId) {
                setMoodId(newMoodId);
                await updatePetMood(petId, newMoodId); // Update the pet's mood on the server
                localStorage.setItem('selectedPetId', petId); // Save the selected pet to localStorage
                setIsUpdated(prev => !prev); // Trigger local state update instead
            }
    
            // Fetch updated sprite after the mood change
            await fetchPetSprite(petId, newMoodId); // Ensure sprite is fetched after mood update
        } catch (error) {
            console.error('Error fetching pet stats or updating mood:', error);
        }
    };
    


     
    const fetchPetSprite = async (petId, moodId) => {
        if (!moodId || isNaN(moodId)) {
            console.error('Invalid or missing moodId:', moodId);
            return;
        }
    
        try {
            const spriteResponse = await fetch(`/api/pets-stats/pet-sprite/${petId}?mood_id=${moodId}`);
            const spriteData = await spriteResponse.json();
    
            if (sprite !== spriteData.image_url) { // Only update if the image has changed
                setSprite(spriteData.image_url); // Update sprite image dynamically based on mood
                console.log('Sprite updated:', spriteData.image_url, 'for petId:', petId, 'with moodId:', moodId);
            } else {
                console.log('Sprite has not changed, keeping the current image.');
            }
        } catch (error) {
            console.error('Error fetching sprite:', error);
        }
    };
    
  // Update pet mood on the server
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

            // Store selected pet in localStorage before refreshing the page
            localStorage.setItem('selectedPet', JSON.stringify(selectedPet));
          
        } else {
            console.error('Failed to update mood');
        }
    } catch (error) {
        console.error('Error updating mood:', error);
    }
};
   


    // Function to reduce hunger
    const reduceHunger = async (amount) => {
        if (!selectedPet) return;

        try {
            const response = await fetch(`/api/pets-stats/reduce-hunger/${selectedPet.pet_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: -amount }),
            });

            if (response.ok) {
                const updatedPetStats = await response.json();
                setPetStats(updatedPetStats);
                console.log(`Hunger reduced by ${amount}. New hunger level: ${updatedPetStats.hunger}`);
            } else {
                console.error('Failed to reduce hunger');
            }
        } catch (error) {
            console.error('Error reducing hunger:', error);
        }
    };

    // Function to reduce energy
    const reduceEnergy = async (amount) => {
        if (!selectedPet) return;

        try {
            const response = await fetch(`/api/pets-stats/reduce-energy/${selectedPet.pet_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: -amount }),
            });

            if (response.ok) {
                const updatedPetStats = await response.json();
                setPetStats(updatedPetStats);
                console.log(`Energy reduced by ${amount}. New energy level: ${updatedPetStats.energy}`);
            } else {
                console.error('Failed to reduce energy');
            }
        } catch (error) {
            console.error('Error reducing energy:', error);
        }
    };



        // Function to reduce energy
        const reduceHappiness = async (amount) => {
            if (!selectedPet) return;
    
            try {
                const response = await fetch(`/api/pets-stats/reduce-happiness/${selectedPet.pet_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: -amount }),
                });
    
                if (response.ok) {
                    const updatedPetStats = await response.json();
                    setPetStats(updatedPetStats);
                    console.log(`reduce-happiness reduced by ${amount}. New energy level: ${updatedPetStats.energy}`);
                } else {
                    console.error('Failed to reduce energy');
                }
            } catch (error) {
                console.error('Error reducing energy:', error);
            }
        };
            // Function to reduce energy
                const reduceCleanliness = async (amount) => {
                    if (!selectedPet) return;
            
                    try {
                        const response = await fetch(`/api/pets-stats/reduce-cleanliness/${selectedPet.pet_id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ amount: -amount }),
                        });
            
                        if (response.ok) {
                            const updatedPetStats = await response.json();
                            setPetStats(updatedPetStats);
                            console.log(`reduce-cleanliness reduced by ${amount}. New energy level: ${updatedPetStats.cleanliness}`);
                        } else {
                            console.error('Failed to reduce clean');
                        }
                    } catch (error) {
                        console.error('Error reducing clean:', error);
                    }
                };



                       // Function to reduce energy
        const sleepButton = async (amount) => {
            if (!selectedPet) return;
    
            try {
                const response = await fetch(`/api/pets-stats/sleep/${selectedPet.pet_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: +amount }),
                });
    
                if (response.ok) {
                    const updatedPetStats = await response.json();
                    setPetStats(updatedPetStats);
                    setIsUpdated(prev => !prev);
                    console.log(`sleep by ${amount}. New energy level: ${updatedPetStats.energy}`);
                } else {
                    console.error('Failed to sleep');
                }
            } catch (error) {
                console.error('Error sleeping:', error);
            }
        };
    
// Function to handle feeding the pet
const feedPet = async (petId, foodId) => {
    try {
        console.log('Feeding pet:', petId, 'with food:', foodId);
        if (!petId || !foodId) throw new Error('Missing petId or foodId');

        const response = await fetch('/api/feed-pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ petId, foodId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            alert(`Error: ${errorData.error}`);
            return;
        }

        const data = await response.json();
        if (data.success) {
            alert('Pet fed successfully!');
            setIsUpdated(prev => !prev);

            // Temporarily change mood_id to 4
            await updatePetMood(petId, 4); // Set the mood to 4
            await fetchPetSprite(petId, 4); // Update the sprite for mood_id = 4

            // Recalculate the mood_id after 2 seconds
            setTimeout(async () => {
                // Fetch the updated pet stats and recalculate mood based on the stats
                await fetchPetStats(petId, true); // Recalculate the mood using the existing function
            }, 2000); // 2 seconds delay
        
        console.log("eating anime is done")
        }
    } catch (error) {
        console.error('Error feeding pet:', error);
    }
};


    // Function to clean the pet
    const cleanPet = async (petId, toiletriesId) => {
        try {
            console.log('Cleaning pet:', petId, 'with toiletry:', toiletriesId);
            if (!petId || !toiletriesId) throw new Error('Missing petId or toiletriesId');

            const response = await fetch('/api/clean-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, toiletriesId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert(`Error: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('Pet cleaned successfully!');
                setIsUpdated(prev => !prev);
            }
        } catch (error) {
            console.error('Error cleaning pet:', error);
        }
   
        fetchPetStats(petId);
        fetchPetSprite(petId, moodId); // Ensure moodId is correct if needed
        setIsUpdated(prev => !prev); // Trigger state change to re-render
   
    };

    // Function to play with the pet
    const playWithPet = async (petId, toyId) => {
        try {
            console.log('Playing with pet:', petId, 'with toy:', toyId);
            if (!petId || !toyId) throw new Error('Missing petId or toyId');

            const response = await fetch('/api/play-with-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, toyId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert(`Error: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('Pet played successfully!');
                setIsUpdated(prev => !prev);
            }
        } catch (error) {
            console.error('Error playing with pet:', error);
        }
    
        fetchPetStats(petId);
        fetchPetSprite(petId, moodId); // Ensure moodId is correct if needed
        setIsUpdated(prev => !prev); // Trigger state change to re-render
    
    };

    // UseEffect to fetch stats when selected pet changes
    useEffect(() => {
        if (selectedPet) {
            fetchPetStats(selectedPet.pet_id);
            fetchPetSprite(selectedPet.pet_id);
        }
    }, [selectedPet]);

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
                            setSelectedPet(pet);
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
                            <img src={sprite || selectedPet.pet_image} alt={selectedPet.pet_name} />
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
                            <button onClick={() => reduceHunger(10)}>Reduce Hunger by 10</button>
                            <button onClick={() => reduceEnergy(10)}>Reduce Energy by 10</button>
                            <button onClick={() => reduceHappiness(10)}>Reduce Happiness by 10</button>
                            <button onClick={() => reduceCleanliness(10)}>Reduce Cleanliness by 10</button>
                            <button onClick={() => sleepButton(100)}>Sleep</button>
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
                    <UserFoodTable userFood={userFood} feedPet={feedPet} selectedPet={selectedPet} />
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
