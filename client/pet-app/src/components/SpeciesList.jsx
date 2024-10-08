import React, { useState, useEffect } from 'react';
import '../styles/speciesList.scss';

const SpeciesList = ({ speciesList, adoptPet }) => {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [speciesImage, setSpeciesImage] = useState(null);
  const [petName, setPetName] = useState('');  // New state for pet name

  const handleImageClick = (species) => {
    setSelectedSpecies(species);
    setSelectedColor(null);
    setSpeciesImage(species.image);
    setPetName('');  // Reset the pet name when a new species is selected
  };

  useEffect(() => {
    if (selectedSpecies && selectedColor) {
      fetch(`/api/species/sprite?species_id=${selectedSpecies.id}&color_id=${selectedColor}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.spriteUrl) {
            setSpeciesImage(data.spriteUrl);
          }
        })
        .catch((err) => console.error('Error fetching sprite:', err));
    }
  }, [selectedSpecies, selectedColor]);

  return (
    <div className="species-container">
      <div className="species-list">
        <ul>
          {speciesList.map((species) => (
            <li key={species.id} onClick={() => handleImageClick(species)} className="species-item">
              <img src={species.image} alt={species.species_name} />
              <span className="tooltip">{species.species_name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="species-details">
        {selectedSpecies ? (
          <div>
            <div className="details-image">
              <img src={speciesImage} alt={selectedSpecies.species_name} />
            </div>
            <div className="species-info">
              <h2>{selectedSpecies.species_name}</h2>
              <p>Diet Description: {selectedSpecies.diet_desc}</p>
              <div className='color-selector'>
              <label htmlFor={`color-${selectedSpecies.id}`}>Select Color:</label>
              <select 
                id={`color-${selectedSpecies.id}`} 
                onChange={(e) => setSelectedColor(e.target.value)} 
              >
                <option value="1">Yellow</option>
                <option value="2">Red</option>
                <option value="3">Blue</option>
                <option value="4">Green</option>
                <option value="5">Purple</option>
                <option value="6">Orange</option>
              </select>
              </div>
              {/* Input field for pet name */}
              <div className="pet-name-input">
                <div>
                <label htmlFor="pet-name">Give Your Pet A Name</label>
                </div>
                <div className='name-fill'>
                <input 
                  type="text" 
                  id="pet-name" 
                  value={petName} 
                  onChange={(e) => setPetName(e.target.value)} 
                  placeholder="Enter Pet Name" 
                />
                </div>
              </div>

              <div>
                <button 
                  onClick={() => adoptPet(selectedSpecies.id, petName, selectedColor)} 
                  disabled={!petName || !selectedColor}  // Disable button if name or color is not selected
                >
                  Adopt Your New Pet
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Select a species to see more details.</p>
        )}
      </div>
    </div>
  );
};

export default SpeciesList;
