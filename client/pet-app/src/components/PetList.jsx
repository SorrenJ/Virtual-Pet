import React from 'react';
import '../styles/petsList.scss'; // Assuming you're using SCSS

const PetsList = ({ petsList }) => {
  return (
    <div className="pets-list-container">
      <h1>Your Pets</h1>
      <ul className="pets-list">
        {petsList.map((pet) => (
          <li key={pet.id} className="pet-card">
            <div className="pet-image">
              <img src={pet.image_url} alt={pet.name} />
            </div>
            <div className="pet-info">
              <h2>{pet.name}</h2>
              <p><strong>Species:</strong> {pet.species_name}</p>
              {/* <p><strong>Age:</strong> {pet.age}</p> */}
              <p><strong>Personality:</strong> {pet.personality_name}</p>
              {/* <p><strong>Diet:</strong> {pet.diet_desc}</p>
              <p><strong>Mood:</strong> {pet.mood_name}</p> */}
              <p><strong>Color:</strong> {pet.color_name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PetsList;
