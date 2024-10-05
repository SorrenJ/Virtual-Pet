import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UserFoodTable from '../components/UserFoodTable';
import UserToiletriesTable from '../components/UserToiletriesTable';
import UserToysTable from '../components/UserToysTable';

const InventoryModal = ({ isOpen, onRequestClose, selectedPet, setIsUpdated }) => {
  const [userFood, setUserFood] = useState([]); // To store user food data
  const [foodCount, setFoodCount] = useState(0); // To store food count
  const [userToiletries, setUserToiletries] = useState([]);
  const [toiletriesCount, setToiletriesCount] = useState(0);
  const [userToys, setUserToys] = useState([]);
  const [toysCount, setToysCount] = useState(0);
    
    // Fetch data when the modal opens
    useEffect(() => {
        if (isOpen) {
            fetchGeneralData();
        }
    }, [isOpen]);

    const fetchGeneralData = async () => {
        try {
            const response = await fetch(`/api/home`);
            const data = await response.json();
            setFoodCount(data.foodCount || 0);
            setUserFood(data.userFood || []);
            setToiletriesCount(data.toiletriesCount || 0);
            setUserToiletries(data.userToiletries || []);
            setToysCount(data.toysCount || 0);
            setUserToys(data.userToys || []);
        } catch (error) {
            console.error('Error fetching general data:', error);
        }
    };

    const updatePetAndInventory = async (petId, itemId, type) => {
        try {
            const endpointMap = {
                food: '/api/feed-pet',
                toiletry: '/api/clean-pet',
                toy: '/api/play-with-pet'
            };

            const response = await fetch(endpointMap[type], {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, itemId }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} used successfully!`);
                    setIsUpdated(prev => !prev); // Toggle to trigger update in pet stats
                    fetchGeneralData(); // Update inventory
                }
            }
        } catch (error) {
            console.error(`Error using ${type}:`, error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Inventory Modal">
            <div>
                <h2>Your Inventory</h2>
                
                <UserFoodTable
                    userFood={userFood}
                    selectedPet={selectedPet}
                    feedPet={(petId, foodId) => updatePetAndInventory(petId, foodId, 'food')}
                />

                <UserToiletriesTable
                    userToiletries={userToiletries}
                    selectedPet={selectedPet}
                    cleanPet={(petId, toiletriesId) => updatePetAndInventory(petId, toiletriesId, 'toiletry')}
                />

                <UserToysTable
                    userToys={userToys}
                    selectedPet={selectedPet}
                    playWithPet={(petId, toyId) => updatePetAndInventory(petId, toyId, 'toy')}
                />

                <button onClick={onRequestClose}>Close</button>
            </div>
        </Modal>
    );
};

export default InventoryModal;
