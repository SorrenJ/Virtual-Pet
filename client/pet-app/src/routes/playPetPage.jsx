import React, { useState, useEffect } from 'react';

const PlayPetPage = () => {
    const [pets, setPets] = useState([]); // To store all pets and their stats
    const [selectedPet, setSelectedPet] = useState(null);
    const [userToys, setUserToys] = useState([]);
    const [toysCount, setToysCount] = useState(0);

    // Fetch data when the component is mounted
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data for pets and user food
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/home?selectedPetId=${selectedPet?selectedPet.pet_id:1}`);
            const data = await response.json();

            setPets(data.pets || []);
            setSelectedPet(data.selectedPet || null);
            setToysCount(data.toysCount || 0);
            setUserToys(data.userToys || []);

            console.log('Fetched userToy data in HomePage:', data.userToys);
        } catch (error) {
            console.error('Error fetching home data:', error);
        }
    };

    // Function to handle feeding the pet
    const playWithPet = async (petId, toyId) => {
        try {
            console.log('Playing pet:', petId, 'with toy:', toyId);  // Debug
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
                alert('Pet play successfully!');
                fetchData(); // Fetch updated data
            }
        } catch (error) {
            console.error('Error playing pet:', error);
        }
    };

    return (
        <div>
            <h3>Pet Playing Test Page</h3>

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

            {/* Display the user's food inventory */}
            <div className="inventory" id="inventoryTable">
                <h2>User Toy Data</h2>
                <table>
                    <thead>
                    <tr>
            <th>Toy Name</th>
            <th>Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userToys.map((item) => (
            <tr key={item.item_type_id || item.id}>
              <td>
                <img src={item.toyImage} alt={item.toys_name} width="100" />
              </td>
              <td>{item.toys_name}</td>
              <td>{item.count}</td>
              <td>
                <button
                  onClick={() => playWithPet(selectedPet?.pet_id, item.id)}
                  disabled={item.count <= 0}
                >
                  Play
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

export default PlayPetPage;
