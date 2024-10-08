import React, { useState, useEffect, useRef } from 'react';
// Import the required components for inventory display
import UserFoodTable from '../components/UserFoodTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserToysTable from '../components/UserToysTable';
import Sentiment from 'sentiment';
import '../styles/home.css';  // Assuming the CSS is in the same directory as your JSX file


const sentimentAnalyzer = new Sentiment();



 
const HomePage = () => {
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
    const [foodCount, setFoodCount] = useState(0); // To store food count
    const [toiletriesCount, setToiletriesCount] = useState(0);
    const [toysCount, setToysCount] = useState(0);
    const [forceRender, setForceRender] = useState(0); // State to force re-render
    const spriteRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [dogEmotion, setDogEmotion] = useState('🐕😐');
    // UseEffect to fetch stats when selected pet changes
    useEffect(() => {
        let intervalId;
        if (selectedPet) {
            fetchPetStats(selectedPet.pet_id);
            intervalId = setInterval(() => {
                fetchPetStats(selectedPet.pet_id);
            }, 5000); // Check every 5 seconds (adjust the interval as needed)
        }  return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [selectedPet]);

    // Fetch general pet and user data on mount
    useEffect(() => {
        const savedSelectedPetId = localStorage.getItem('selectedPetId');
        fetchGeneralData(savedSelectedPetId);
    }, []);


    const handleSendMessage = async () => {
        if (input.trim() === '') return;
    
        const sentiment = analyzeSentiment(input);
        const response = getChatResponse(input);
    
        // Wait for the async function to complete before updating state
        const emotion = await getDogEmotion(sentiment, selectedPet.pet_id);
    
        setMessages([...messages, { user: input, bot: response }]);
        setDogEmotion(emotion); // Update the dog emotion state after the async call
        setInput('');
    };
    
    

    // Fetch general data (pets and user resources)
    const fetchGeneralData = async (savedSelectedPetId) => {
        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            console.log('General data received:', data);
            setPets(data.pets || []);
            data.pets.forEach(pet => console.log(`Pet: ${pet.pet_name}, Color ID: ${pet.color_id}`));

            setUserFood(data.userFood || []);
            setUserToiletries(data.userToiletries || []);
            setUserToys(data.userToys || []);
            setToiletriesCount(data.toiletriesCount || 0);
            setUserToiletries(data.userToiletries || []);
            setToysCount(data.toysCount || 0);
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

    // Function to check if any stat is below 1 and set the mood to 14 (death)
const checkForDeath = async (petId, stats) => {
    // Check if any stat is below 1
    if (stats.hunger < 1 || stats.energy < 1 || stats.happiness < 1 || stats.cleanliness < 1) {
        console.log('One or more stats below 1. Pet is "dead". Setting mood_id to 14.');

        // Update the mood to 14 (dead)
        await updatePetMood(petId, 14);
        await fetchPetSprite(petId, 14); // Fetch and update the sprite for mood_id = 14
    }

    setForceRender(prev => prev + 1); // Trigger a re-render after mood change
};


    const fetchPetStats = async (petId, excludeMoodId4 = false) => {
        try {
            const response = await fetch(`/api/pets-stats/${petId}`);
            const data = await response.json();
            setPetStats(data);
            console.log("Pet stats updated for petId:", petId);


// Ensure color_id is present
const colorId = data.color_id;
console.log("Color ID:", colorId);

if (!colorId) {
    throw new Error("Color ID is missing");
}

        // Call the checkForDeath function to verify if any stat is below 1
        // await checkForDeath(petId, data);

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

            // If excludeMoodId4 is true, filter out mood_id 4, 10, 3, 7, 8
            if (excludeMoodId4) {
                moodOptions = moodOptions.filter(option => ![4, 10, 3, 7, 8].includes(option.id));
            }

            // Sort by the lowest stat value first, and in case of a tie, use the smallest mood ID
            moodOptions.sort((a, b) => a.value - b.value || a.id - b.id);

            // Select the moodId of the lowest stat
            const newMoodId = moodOptions[0].id;

            if (newMoodId !== moodId) {
                setMoodId(newMoodId);
                await updatePetMood(petId, newMoodId); // Update the pet's mood on the server
                localStorage.setItem('selectedPetId', petId); // Save the selected pet to localStorage
                setIsUpdated(prev => !prev); // Trigger local state update instead
            }

            // Fetch updated sprite after the mood change
            await fetchPetSprite(petId, newMoodId, data.color_id); // Ensure sprite is fetched after mood update
        } catch (error) {
            console.error('Error fetching pet stats or updating mood:', error);
        }

        setForceRender(prev => prev + 1); // Trigger a re-render after mood change
    };




    const fetchPetSprite = async (petId, moodId, colorId) => {
        if (!moodId || isNaN(moodId) || !colorId || isNaN(colorId)) {
            console.error('Invalid or missing moodId or colorId:', moodId, colorId);
            return;
        }
        if (!colorId) {
            console.error('Invalid or missing colorId:', colorId);
            return;
        }
        try {
             const spriteResponse = await fetch(`/api/pets-stats/pet-sprite/${petId}?mood_id=${moodId}&color_id=${colorId}`);
            const spriteData = await spriteResponse.json();
            const spriteWithCacheBuster = `${spriteData.image_url}?v=${new Date().getTime()}`;

            if (sprite !== spriteData.image_url) { // Only update if the image has changed
                setSprite(spriteWithCacheBuster); // Update sprite image dynamically based on mood
                console.log('Sprite updated:', spriteWithCacheBuster, 'for petId:', petId, 'with moodId:', moodId);
            } else {
                console.log('Sprite has not changed, keeping the current image.');
            }
        } catch (error) {
            console.error('Error fetching sprite:', error);
        }
        setForceRender(prev => prev + 1); // Trigger a re-render after mood change
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
            // localStorage.setItem('selectedPet', JSON.stringify(selectedPet));
            await fetchPetSprite(petId, newMoodId, selectedPet.color_id); 
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
// Function to handle sleeping the pet and changing mood temporarily
// Function to handle sleeping the pet and changing mood temporarily
// Function to handle sleeping the pet and increasing energy stat, and changing mood temporarily
const sleepButton = async (amount, petId) => {
    if (!selectedPet) return;

    try {
        // Step 1: Increase the energy stat by the specified amount
        const response = await fetch(`/api/sleep-pet/${petId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: +amount }), // Increase energy by 'amount'
        });

        if (response.ok) {
            const data = await response.json();
            setPetStats(data.pet); // Update pet stats
            setIsUpdated(prev => !prev); // Force state update for UI refresh
            console.log(`Energy increased by ${amount}. New energy level: ${data.pet.energy}`);

            // Step 2: Set the mood to 8 (resting)
            await updatePetMood(petId, 7); // Set mood to 8 (resting)
            await fetchPetSprite(petId, 7, selectedPet.color_id); // Update the sprite to reflect mood 8 (resting)
            console.log('Mood set to 8 (resting)');

            // Step 3: After 3 seconds, set the mood to 9 (post-sleep)
            setTimeout(async () => {
                await updatePetMood(petId, 8); // Set mood to 9 (post-sleep)
                await fetchPetSprite(petId, 8, selectedPet.color_id); // Update the sprite to reflect mood 9 (post-sleep)
                console.log('Mood set to 9 (post-sleep)');

                // Step 4: After another 3 seconds, reset the mood to 1 (default)
                setTimeout(async () => {
                    await updatePetMood(petId, true); // Reset mood to 1 (default)
                    await fetchPetSprite(petId, true, selectedPet.color_id); // Update the sprite to reflect mood 1 (default)
                    console.log('Mood reset to 1 (default)');
                    forceImageReload();
                }, 3000); // 3 seconds after changing to mood 9

            }, 3000); // 3 seconds after changing to mood 8
        } else {
            console.error('Failed to update energy and sleep the pet');
        }
    } catch (error) {
        console.error('Error while sleeping and updating energy:', error);
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
                await fetchPetSprite(petId, true, selectedPet.color_id); // Update the sprite to reflect mood 1 (default)

            }, 2000); // 2 seconds delay

        console.log("eating anime is done")
        }
    } catch (error) {
        console.error('Error feeding pet:', error);
    }

    setIsUpdated(prev => !prev); // Trigger state change to re-render

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

                // Temporarily change mood_id to 10
                await updatePetMood(petId, 10); // Set the mood to 10
                await fetchPetSprite(petId, 10); // Update the sprite for mood_id = 10

                // Recalculate the mood_id after 2 seconds
                setTimeout(async () => {
                    // Fetch the updated pet stats and recalculate mood based on the stats
                    await fetchPetStats(petId, true); // Recalculate the mood using the existing function
                    await fetchPetSprite(petId, true, selectedPet.color_id); // Update the sprite to reflect mood 1 (default)
                }, 2000); // 2 seconds delay

            console.log("cleaning anime is done")
            }
        } catch (error) {
            console.error('Error cleaning pet:', error);
        }


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

                // Temporarily change mood_id to 10
                await updatePetMood(petId, 3); // Set the mood to 10
                await fetchPetSprite(petId, 3); // Update the sprite for mood_id = 10

                // Recalculate the mood_id after 2 seconds
                setTimeout(async () => {
                    // Fetch the updated pet stats and recalculate mood based on the stats
                    await fetchPetStats(petId, true); // Recalculate the mood using the existing function
                    await fetchPetSprite(petId, true, selectedPet.color_id); // Update the sprite to reflect mood 1 (default)
                }, 2000); // 2 seconds delay

            console.log("happy anime is done")
            }
        } catch (error) {
            console.error('Error playing with pet:', error);
        }


        setIsUpdated(prev => !prev); // Trigger state change to re-render

    };

// Function to delete the pet
const deletePet = async (petId) => {
    if (!petId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this pet?');
    console.log("delete:",petId);
    if (!confirmDelete) return;

    try {
        const response = await fetch(`/api/delete-pet/${petId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Pet deleted successfully!');
            setPets(pets.filter(pet => pet.pet_id !== petId)); // Remove the deleted pet from the state
            setSelectedPet(null); // Reset the selected pet after deletion
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error deleting pet:', error);
    }
};


    // UseEffect to fetch stats when selected pet changes
    useEffect(() => {
        if (selectedPet) {
            fetchPetStats(selectedPet.pet_id);
            fetchPetSprite(selectedPet.pet_id);
            setForceRender(prev => prev + 1); // Trigger a re-render after mood change
        }
    }, [selectedPet]);



    const forceImageReload = () => {
        if (spriteRef.current) {
            spriteRef.current.src = `${spriteRef.current.src}?v=${new Date().getTime()}`;
        }
    };


    // Fetch general pet and user data on mount
    useEffect(() => {
        fetchGeneralData();
    }, []);

   // Function to analyze sentiment
const analyzeSentiment = (text) => {
    const result = sentimentAnalyzer.analyze(text);
    if (result.score > 0) {
      return 'happy';
    } else if (result.score < 0) {
      return 'angry';
    } else {
      return 'neutral';
    }
  };
  
  // Function to simulate chatbot response
  const getChatResponse = (input) => {
    const responses = {
      happy: `${selectedPet.pet_name} is jumping for joy from what you said`,
      angry: `${selectedPet.pet_name} is hurt from what you said`,
      neutral: `${selectedPet.pet_name} is listening`,
    };
    const sentiment = analyzeSentiment(input);
    return responses[sentiment] || `${selectedPet.pet_name} doesn't understand`;
  };
  
    //Function to display dog emotion
    const  getDogEmotion = async (sentiment, petId) => {
        try {
    
            if (!petId) throw new Error('Missing petId');
    
       
      if (sentiment === 'happy') {
        await updatePetMood(petId, 3); // Set the mood to 10
        await fetchPetSprite(petId, 3); // Update the sprite for mood_id = 10
        
        
    
    } else if (sentiment === 'angry') {
        
        await updatePetMood(petId, 12); // Set the mood to 10
        await fetchPetSprite(petId, 12); // Update the sprite for mood_id = 10
        
        
      
      } else {
    
        // await updatePetMood(petId, 1); // Set the mood to 10
        // await fetchPetSprite(petId, 1); // Update the sprite for mood_id = 10
    
       
      }
    } catch (error) {
        console.error('Error playing with pet:', error);
    
    }

    };
    






    return (
        <div className="homepage-container">
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
                    <div className="pet-details-container">

                        <div className="left-section">
                        <div className="bot-message">{messages[messages.length - 1].bot}</div>
                            <img ref={spriteRef} className="pet-image" src={sprite || selectedPet.pet_image} alt={selectedPet.pet_name} />
                            <div className="chatbot-container">


      {/* Chat Window */}
      <div className="chat-window">
  {messages.length > 0 && (
    <div className="message">
      <div className="user-message">You: {messages[messages.length - 1].user}</div>
     
    </div>
  )}
</div>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
                            
                            <div className="buttons-section">
                                <button onClick={() => sleepButton(100, selectedPet.pet_id)}>Sleep</button>
                                <button onClick={() => deletePet(selectedPet.pet_id)}>Release Pet</button>
                                <button onClick={() => setVisibleComponent(visibleComponent === 4 ? null : 4)}>
                                    Admin Controls
                                </button>
                            </div>
                        
                            <div style={{ marginTop: '20px' }}>
                    {visibleComponent === 4 && (
                     <>
                     <button onClick={() => reduceHunger(10)}>Reduce Hunger by 10</button>
                     <button onClick={() => reduceEnergy(10)}>Reduce Energy by 10</button>
                    <button onClick={() => reduceHappiness(10)}>Reduce Happiness by 10</button>
                    <button onClick={() => reduceCleanliness(10)}>Reduce Cleanliness by 10</button>
                    </>
                    )}
                        </div>
                        
                        </div>
                        <div className="right-section">
                            <h2>Meet {selectedPet.pet_name}</h2>
                            <p>Energy: {petStats.energy}</p>
                            <p>Happiness: {petStats.happiness}</p>
                            <p>Hunger: {petStats.hunger}</p>
                            <p>Cleanliness: {petStats.cleanliness}</p>
                            <p>Species: {selectedPet.species_name}</p>
                            <p>Diet: {selectedPet.diet_desc}</p>
                            <p>Personality: {selectedPet.personality_name}</p>
                        </div>
                    </div>
                )}
            </>
        ) : (
            <p>No pets available at the moment.</p>
        )}

        <h2>Inventory</h2>
        <div className="inventory-section">
            <button onClick={() => setVisibleComponent(1)} disabled={visibleComponent === 1}>Pet Treats</button>
            <button onClick={() => setVisibleComponent(2)} disabled={visibleComponent === 2}>Pet Toiletries</button>
            <button onClick={() => setVisibleComponent(3)} disabled={visibleComponent === 3}>Pet Toys</button>
        </div>

        <div className="inventory-table">
            {visibleComponent === 1 && <UserFoodTable userFood={userFood} feedPet={feedPet} selectedPet={selectedPet} />}
            {visibleComponent === 2 && <UserToiletriesTable userToiletries={userToiletries} cleanPet={cleanPet} selectedPet={selectedPet} />}
            {visibleComponent === 3 && <UserToysTable userToys={userToys} playWithPet={playWithPet} selectedPet={selectedPet} />}
        </div>
    </div>
);
};

export default HomePage;
