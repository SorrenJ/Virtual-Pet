import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to read query params

const HomePage = () => {
    const [pets, setPets] = useState([]); 
    const [selectedPet, setSelectedPet] = useState(null);
    const [petStats, setPetStats] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false); 

    const location = useLocation();  // Access the current URL location

    // Helper function to get query parameter value
    const getQueryParam = (param) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(param);
    };

    const fetchPetStats = async (petId) => {
        try {
            const response = await fetch(`/api/pets-stats/${petId}`);
            const data = await response.json();
            setPetStats(data);
        } catch (error) {
            console.error('Error fetching pet stats:', error);
        }
    };

    const fetchGeneralData = async () => {
        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            setPets(data.pets || []);

            const newPetId = getQueryParam('newPetId');
            
            if (newPetId) {
                const newPet = data.pets.find(p => p.pet_id === parseInt(newPetId));
                if (newPet) {
                    setSelectedPet(newPet); // Select the newly adopted pet
                }
            } else if (!selectedPet && data.pets.length > 0) {
                setSelectedPet(data.pets[0]); // Select the first pet if none is selected
            }
        } catch (error) {
            console.error('Error fetching general data:', error);
        }
    };

    useEffect(() => {
        fetchGeneralData();  // Fetch data on component mount and whenever location changes (for query param)
    }, [location]);  // Add `location` as a dependency to trigger when the user is redirected

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (selectedPet) {
                fetchPetStats(selectedPet.pet_id);
            }
        }, 5000); 

        return () => clearInterval(intervalId);
    }, [selectedPet]);

    return (
        <div>
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
                            <img src={selectedPet.pet_image} alt={selectedPet.pet_name} />
                            <p>Energy: {petStats.energy}</p>
                            <p>Happiness: {petStats.happiness}</p>
                            <p>Hunger: {petStats.hunger}</p>
                            <p>Cleanliness: {petStats.cleanliness}</p>
                            <p>Species: {selectedPet.species_name}</p>
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
