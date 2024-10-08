import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PetGallery = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch('/api/home');
                const data = await response.json();
                setPets(data.pets || []);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, []);

    return (
        <div>
            <h1>Pet Gallery</h1>
            <div className="pet-gallery">
                {pets.map((pet) => (
                    <div key={pet.pet_id} className="pet-card">
                        <Link to={`/pet/${pet.pet_id}`}>
                            <img src={pet.pet_image} alt={pet.pet_name} />
                            <h2>{pet.pet_name}</h2>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetGallery;
