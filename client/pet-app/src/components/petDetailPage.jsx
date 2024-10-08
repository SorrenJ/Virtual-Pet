import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UserFoodTable from '../components/UserFoodTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserToysTable from '../components/UserToysTable';

const PetDetail = () => {
    const { id } = useParams(); // Extract the pet ID from the URL
    const [pet, setPet] = useState(null); // Store pet data
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
    // UseEffect to fetch pet data and stats when the component loads
    // Fetch pet stats and sprite when the component mounts
    useEffect(() => {
        if (id) {
            fetchPetStats(id);
            fetchUserInventories(); // Fetch user inventories when component loads
        }
    }, [id]);

    // Fetch the pet stats
    const fetchPetStats = async (petId) => {
        try {
            const response = await fetch(`/api/pets-stats/${petId}`);
            const data = await response.json();
            setPet(data.pet);
            setPetStats(data);
            fetchPetSprite(petId, data.mood_id, data.color_id); // Fetch sprite for the pet
        } catch (error) {
            console.error('Error fetching pet stats:', error);
        }
    };

    // Fetch the sprite image for the pet based on mood and color
    const fetchPetSprite = async (petId, moodId, colorId) => {
        if (!moodId || !colorId) {
            console.error('Invalid or missing moodId or colorId:', moodId, colorId);
            return;
        }
        try {
            const response = await fetch(`/api/pets-stats/pet-sprite/${petId}?mood_id=${moodId}&color_id=${colorId}`);
            const spriteData = await response.json();
            setSprite(`${spriteData.image_url}?v=${new Date().getTime()}`); // Append cache buster to avoid caching issues
        } catch (error) {
            console.error('Error fetching sprite:', error);
        }
    };

    // Fetch user inventories (food, toiletries, toys)
    const fetchUserInventories = async () => {
        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            setUserFood(data.userFood || []);
            setUserToiletries(data.userToiletries || []);
            setUserToys(data.userToys || []);
        } catch (error) {
            console.error('Error fetching user inventories:', error);
        }
    };

    // Update pet mood on the server
    const updatePetMood = async (petId, newMoodId) => {
        try {
            const response = await fetch(`/api/pets-stats/update-mood/${petId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood_id: newMoodId }),
            });
            if (response.ok) {
                console.log(`Mood updated to ${newMoodId} for petId: ${petId}`);
                await fetchPetSprite(petId, newMoodId, pet.color_id); // Update sprite after mood change
            } else {
                console.error('Failed to update mood');
            }
        } catch (error) {
            console.error('Error updating mood:', error);
        }
    };


    // Function to put the pet to sleep
    const sleepButton = async (amount, petId) => {
        if (!pet) return;
        try {
            const response = await fetch(`/api/sleep-pet/${petId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: +amount }),
            });
            if (response.ok) {
                const data = await response.json();
                setPetStats(data.pet); // Update pet stats
                console.log(`Energy increased by ${amount}. New energy level: ${data.pet.energy}`);
                await updatePetMood(petId, 7); // Temporary mood after sleep
                setTimeout(() => updatePetMood(petId, 1), 3000); // Reset mood after 3 seconds
            } else {
                console.error('Failed to sleep the pet');
            }
        } catch (error) {
            console.error('Error sleeping the pet:', error);
        }
    };

    // Function to handle feeding the pet
    const feedPet = async (foodId) => {
        if (!pet || !foodId) return;
        try {
            const response = await fetch('/api/feed-pet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId: pet.pet_id, foodId }),
            });
            if (response.ok) {
                alert('Pet fed successfully!');
                await updatePetMood(pet.pet_id, 4); // Temporary mood change after feeding
                setTimeout(() => fetchPetStats(pet.pet_id), 2000); // Recalculate mood after delay
            } else {
                console.error('Failed to feed pet');
            }
        } catch (error) {
            console.error('Error feeding pet:', error);
        }
    };

    return (
        <div>
            {pet && petStats ? (
                <>
                    <h2>Meet {pet.pet_name}</h2>
                    <img ref={spriteRef} src={sprite || pet.pet_image} alt={pet.pet_name} />
                    <p>Energy: {petStats.energy}</p>
                    <p>Happiness: {petStats.happiness}</p>
                    <p>Hunger: {petStats.hunger}</p>
                    <p>Cleanliness: {petStats.cleanliness}</p>
                    <p>Species: {pet.species_name}</p>
                    <p>Diet: {pet.diet_desc}</p>
                    <p>Personality: {pet.personality_name}</p>

                    {/* Buttons for stat interactions */}
                   
                    <button onClick={() => sleepButton(100, pet.pet_id)}>Sleep</button>

                    {/* Inventory Section */}
                    <h2>Inventory</h2>
                    <button onClick={() => setVisibleComponent(1)} disabled={visibleComponent === 1}>
                        Pet Treats
                    </button>
         

                    {visibleComponent === 1 && (
                        <UserFoodTable userFood={userFood} feedPet={feedPet} selectedPet={pet} />
                    )}
                   
                </>
            ) : (
                <p>Loading pet details...</p>
            )}
        </div>
    );
};

export default PetDetail;
