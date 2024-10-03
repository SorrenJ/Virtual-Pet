import React, { useState, useEffect } from 'react';

const CleanPetPage= () => {
    const [pets, setPets] = useState([]); // To store all pets and their stats
    const [selectedPet, setSelectedPet] = useState(null);
    const [userToiletries, setUserToiletries] = useState([]);
    const [toiletriesCount, setToiletriesCount] = useState(0);
 

    // Fetch data when the component is mounted
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data for pets and user toiletry
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/home?selectedPetId=${selectedPet?selectedPet.pet_id:1}`);
            const data = await response.json();

            setPets(data.pets || []);
            setSelectedPet(data.selectedPet || null);
            setToiletriesCount(data.toiletriesCount || 0);
            setUserToiletries(data.userToiletries || []);

            console.log('Fetched userToiletriesdata in HomePage:', data.userToiletries);
        } catch (error) {
            console.error('Error fetching home data:', error);
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

    return (
        <div>
            <h3>Pet Cleaning Test Page</h3>

            {/* Display the pet details */}
            {pets.length > 0 ? (
                <>
                    <h1>Welcome {pets[0].user_name}</h1>

                    <h2>Select Your Pet</h2>
                    <select
                        id="petSelector"
                        value={selectedPet?.pet_id || ''}
                        onChange={(e) => {
                            console.log("selected your pet")
                            return setSelectedPet(pets.find(p => p.pet_id === parseInt(e.target.value)) ) 
                      
                        } }
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

            {/* Display the user's toiletry inventory */}
            <div className="inventory" id="inventoryTable">
                <h2>User Toiletries Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item Image</th>
                            <th>Item Name</th>
                            <th>Count</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userToiletries.map((item) => (
                            <tr key={item.item_type_id || item.id}>
                                <td><img src={item.toiletryImage} alt={item.toiletries_name} width="100" /></td>
                                <td>{item.toiletries_name}</td>
                                <td>{item.count}</td>
                                <td>
                                    <button
                                        onClick={() => cleanPet(selectedPet?.pet_id, item.id)}
                                        disabled={item.count <= 0}
                                    >
                                        Clean
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CleanPetPage;
