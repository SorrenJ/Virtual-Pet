import React, { useState, useEffect } from 'react';
import SpeciesList from '../components/SpeciesList';  // Import the SpeciesList component
import PetsList from '../components/PetList';        // Import the PetsList component

function AdoptPage() {
  const [speciesList, setSpeciesList] = useState([]);
  const [petsList, setPetsList] = useState([]);

  useEffect(() => {
    // Fetch species and pets data from the server
    const fetchData = async () => {
      try {
        const speciesResponse = await fetch('/api/species');
        const petsResponse = await fetch('/api/pets');
        
        const species = await speciesResponse.json();
        const pets = await petsResponse.json();
  
        setSpeciesList(species);
        setPetsList(pets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const adoptPet = async (speciesId) => {
    const colorDropdown = document.getElementById(`color-${speciesId}`);
    const colorId = colorDropdown.value;

    try {
      const response = await fetch('/adopt-pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ species_id: speciesId, color_id: colorId }),
      });

      if (response.ok) {
        const adoptedPet = await response.json();
        const petName = prompt('Enter a name for your new pet:');
        if (petName) {
          await fetch('/set-pet-name', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pet_id: adoptedPet.id, name: petName }),
          });
          alert('Pet adopted and named successfully!');
          window.location.reload();
        }
      } else {
        alert('Error adopting pet.');
      }
    } catch (error) {
      console.error('Error adopting pet:', error);
    }
  };

  return (
    <div>
      <div className="links">
        <h3>Explore More:</h3>
        <a href="/">Go home</a>
        <a href="/adopt">Adopt a Pet</a>
        <a href="/shop">Visit the Shop</a>  
      </div>


      <SpeciesList speciesList={speciesList} adoptPet={adoptPet} />
      <PetsList petsList={petsList} />
    </div>
  );
}

export default AdoptPage;
