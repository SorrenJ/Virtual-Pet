import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {Helmet} from 'react-helmet'
import SpeciesList from '../components/SpeciesList';  
import PetsList from '../components/PetList';        
import LoadingScreen from '../components/loadingScreen';
function AdoptPage() {
  const [speciesList, setSpeciesList] = useState([]);
  const [petsList, setPetsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // State to manage the transition effect
  const navigate = useNavigate();  // Initialize useNavigate hook for navigation

  useEffect(() => {
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




  const adoptPet = async (speciesId, petName, colorId) => {
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
        
        const nameResponse = await fetch('/set-pet-name', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pet_id: adoptedPet.id, name: petName }),
        });

        if (nameResponse.ok) {
          alert('Pet adopted and named successfully!');

           // Trigger loading after the alert is confirmed
           setLoading(true);
           setTimeout(() => {
           setIsTransitioning(true); // Start transition after loading
           // Add a slight delay before navigating to simulate loading
           setTimeout(() => {
            setLoading(false); // Hide loading after the transition
            navigate(`/home?newPetId=${adoptedPet.id}`);    
            }, 500);
            }, 4000); // You can adjust or remove the delay as needed
          
        
        } else {
          alert('Error setting pet name.');
        }
      } else {
        alert('Error adopting pet.');
      }
    } catch (error) {
      console.error('Error adopting pet:', error);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen isTransitioning={isTransitioning} /> // Show loading screen while loading after alert
      ) : (
        <div>
          <div className="overlay"></div>
          <Helmet><title>Adopt</title></Helmet>
          <br/>
          <br/>
          <br/>
          <h1 style={{ fontSize: '32px' }}>Choose a species to adopt</h1>

          <SpeciesList speciesList={speciesList} adoptPet={adoptPet} />
          <PetsList petsList={petsList} />
        </div>
      )}
    </>
  );
}

export default AdoptPage;
