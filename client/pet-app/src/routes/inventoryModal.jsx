// src/components/InventoryModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/inventoryModal.scss';

Modal.setAppElement('#root');

const InventoryModal = ({ isOpen, onRequestClose }) => {
    const [pets, setPets] = useState([]);
    const [userFood, setUserFood] = useState([]);
    const [userToiletries, setUserToiletries] = useState([]);
    const [userToys, setUserToys] = useState([]);
    const [visibleComponent, setVisibleComponent] = useState(1); // Default to showing food

    useEffect(() => {
        fetchGeneralData();
    }, []);

    const fetchGeneralData = async () => {
        try {
            const response = await fetch(`/api/inventory`);
            const data = await response.json();
            setPets(data.pets || []);
            setUserFood(data.userFood.filter(item => item.count > 0) || []);
            setUserToiletries(data.userToiletries.filter(item => item.count > 0) || []);
            setUserToys(data.userToys.filter(item => item.count > 0) || []);
        } catch (error) {
            console.error('Error fetching general data:', error);
        }
    };

    const handleComponentToggle = (componentNumber) => {
        setVisibleComponent(componentNumber);
    };

    // Combine all items into a single array for display
    const allItems = [
        ...userFood.map(item => ({
            ...item,
            type: 'food',
            name: item.food_name,
            image: item.foodImage,
            description: item.description || 'No description available',
        })),
        ...userToiletries.map(item => ({
            ...item,
            type: 'toiletries',
            name: item.toiletries_name,
            image: item.toiletryImage,
            description: item.description || 'No description available',
        })),
        ...userToys.map(item => ({
            ...item,
            type: 'toys',
            name: item.toys_name,
            image: item.toyImage,
            description: item.description || 'No description available',
        })),
    ];

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Inventory Modal">
            <div className="modal-content">
                {/* Close button */}
                <button className="close-button" onClick={onRequestClose}>
                    &times;
                </button>

                <h2 className='title'>Inventory</h2>

                <div className="inventory-buttons">
                    <button onClick={() => handleComponentToggle(4)} disabled={visibleComponent === 4}>
                        All Items
                    </button>
                    <button onClick={() => handleComponentToggle(1)} disabled={visibleComponent === 1}>
                        Foods
                    </button>
                    <button onClick={() => handleComponentToggle(2)} disabled={visibleComponent === 2}>
                        Toiletries
                    </button>
                    <button onClick={() => handleComponentToggle(3)} disabled={visibleComponent === 3}>
                        Toys
                    </button>
                </div>

                <div className="item-container" style={{ marginTop: '20px' }}>
                    {allItems
                        .filter(item => {
                            if (visibleComponent === 1) return item.type === 'food';
                            if (visibleComponent === 2) return item.type === 'toiletries';
                            if (visibleComponent === 3) return item.type === 'toys';
                            return true; // Show all by default
                        })
                        .map(item => (
                            <div key={item.id} className="item-card" data-tooltip={item.description}>
                                <img src={item.image} alt={item.name} width="100" />
                                <h4>{item.name}</h4>
                                
                            </div>
                        ))}
                </div>
            </div>
        </Modal>
    );
};

export default InventoryModal;
