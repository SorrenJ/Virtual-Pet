import React, { useEffect, useState } from 'react';
import PetMoodUpdater from '../components/petMoodUpdater';

const PetPage = () => {
  const userId = 1;  // Make sure this is replaced with the correct logic for fetching userId
  
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    if (userId) { // Ensure that userId is defined
      fetchPets();
    } else {
      console.error("User ID is undefined!");
    }
  }, [userId]);

  return (
    <div>
      <h1>Your Pets</h1>
      {pets.length > 0 ? (
        pets.map((pet) => (
          <div key={pet.id}>
            <h2>{pet.name}</h2>
            <img src={pet.pet_image_url} alt={`${pet.name}`} />
            <PetMoodUpdater userId={userId} petId={pet.id} />
          </div>
        ))
      ) : (
        <p>No pets found.</p>
      )}
    </div>
  );
};

export default PetPage;
