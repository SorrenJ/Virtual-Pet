import React from 'react';

const PetsList = ({ petsList }) => {
  return (
    <div>
      <h1>Your Pet</h1>
      <ul>
        {petsList.map((pet) => (
          <li key={pet.id}>
            <h2>{pet.name}</h2>
            <p>Species: {pet.species_name}</p>
            <p>Age: {pet.age}</p>
            <p>Personality: {pet.personality}</p>
            <p>Diet: {pet.diet_desc}</p>
            <p>Personality: {pet.personality_name}</p>
            <p>Mood: {pet.mood_name}</p>
            <p>Color: {pet.color_name}</p>
            <img src={pet.image_url} alt={pet.name} width="640" height="480" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PetsList;
