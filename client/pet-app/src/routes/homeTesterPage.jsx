import React, { useState, useEffect } from 'react';
import UserFoodTable from '../components/UserFoodTable'; 
import UserToiletriesTable from '../components/UserToiletriesTable'; 
import UserToysTable from '../components/UserToysTable'; 

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
        fetchData();

        // Set up a periodic update for pet stats (every 60 seconds)
        const intervalId = setInterval(() => {
            fetchData(false);  // Call fetchData without resetting the selected pet
        }, 6000); // 60 seconds

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // UseEffect that tracks changes in the pets array and ensures the selectedPet is not reset unnecessarily
    useEffect(() => {
        if (!selectedPet && pets.length > 0) {
            // Only set the first pet if selectedPet is null (first render case)
            setSelectedPet(pets[0]);
        }
    }, [pets]); // This effect only runs when pets array changes

    // Fetch data for pets and user food
    const fetchData = async (resetSelectedPet = true) => {
        try {
            const response = await fetch(`/api/home?selectedPetId=${selectedPet ? selectedPet.pet_id : 1}`);
            const data = await response.json();

            setPets(data.pets || []);

            // Don't reset the selected pet when fetchData is called periodically
            if (resetSelectedPet && data.pets.length > 0) {
                setSelectedPet(data.selectedPet || data.pets[0] || null);
            } else if (!resetSelectedPet && selectedPet) {
                // Update selectedPet stats without switching the pet
                const updatedPet = data.pets.find(pet => pet.pet_id === selectedPet.pet_id);
                if (updatedPet) {
                    setSelectedPet(updatedPet);
                }
            }

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
                fetchData(false); // Fetch updated data without resetting selected pet
            }
        } catch (error) {
            console.error('Error feeding pet:', error);
        }
    };

    // Function to handle cleaning the pet
    const cleanPet = async (petId, toiletriesId) => {
        try {
            console.log('Cleaning pet:', petId, 'with toiletry:', toiletriesId);  // Debug
            if (!petId || !toiletriesId) {
                throw new Error('Missing petId or toiletriesId');
            }

            const response = await fetch('/api/clean-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, toiletriesId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);  // Log the error response
                alert(`Error: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('Pet cleaned successfully!');
                fetchData(false); // Fetch updated data without resetting selected pet
            }
        } catch (error) {
            console.error('Error cleaning pet:', error);
        }
    };

    // Function to handle playing with the pet
    const playWithPet = async (petId, toyId) => {
        try {
            console.log('Playing with pet:', petId, 'with toy:', toyId);  // Debug
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
                alert('Pet played successfully!');
                fetchData(false); // Fetch updated data without resetting selected pet
            }
        } catch (error) {
            console.error('Error playing with pet:', error);
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
                            console.log("Selected your pet");
                            const pet = pets.find(p => p.pet_id === parseInt(e.target.value));
                            setSelectedPet(pet);
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

                <button 
                    onClick={() => setVisibleComponent(2)} 
                    disabled={visibleComponent === 2}>
                    Show Component Two
                </button>

                <button 
                    onClick={() => setVisibleComponent(3)} 
                    disabled={visibleComponent === 3}>
                    Show Component Three
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
        </div>
    );
};

export default HomeTesterPage;
