import React from 'react';

const SpeciesList = ({ speciesList, adoptPet }) => {
  return (
    <div>
      <h1>Adopt a Species</h1>
      <ul>
        {speciesList.map((species) => (
          <li key={species.id}>
            <h2>{species.species_name}</h2>
            <p>Hunger Modifier: {species.hunger_mod}</p>
            <p>Happy Modifier: {species.happy_mod}</p>
            <p>Energy Modifier: {species.energy_mod}</p>
            <p>Cleanliness Modifier: {species.clean_mod}</p>
            <p>Lifespan: {species.lifespan}</p>
            <p>Diet Type: {species.diet_type}</p>
            <p>Diet Description: {species.diet_desc}</p>
            <p>Image:</p>
            <img src={species.image} alt={species.species_name} />

            <label htmlFor={`color-${species.id}`}>Select Color:</label>
            <select id={`color-${species.id}`}>
              <option value="1">Yellow</option>
              <option value="2">Red</option>
              <option value="3">Blue</option>
              <option value="4">Green</option>
              <option value="5">Purple</option>
              <option value="6">Orange</option>
            </select>

            <button onClick={() => adoptPet(species.id)}>Adopt This Pet</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeciesList;
