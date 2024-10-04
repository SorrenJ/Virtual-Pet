import React, { useState } from 'react';

const PetMoodUpdater = ({ userId, petId, currentImage, setPetImage }) => {
  const [currentMood, setCurrentMood] = useState(null);

  // Moods and their corresponding moodId
  const moods = [
    { name: 'default', id: 1 },
    { name: 'acknowledge', id: 2 },
    { name: 'happy', id: 3 },
    { name: 'feeding', id: 4 },
    { name: 'hungry', id: 5 },
    { name: 'tired', id: 6 },
    { name: 'sleep', id: 7 },
    { name: 'wake', id: 8 },
    { name: 'dirty', id: 9 },
    { name: 'clean', id: 10 },
    { name: 'angry', id: 11 },
    { name: 'sad', id: 12 },
    { name: 'pet', id: 13 }
  ];

  // Function to handle mood update
  const updateMood = async (moodId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets/update-image/${userId}/${petId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_id: moodId }), // Send the mood_id to the backend
      });
  
      if (!response.ok) {
        throw new Error('Failed to update mood');
      }
  
      const data = await response.json();
      setCurrentMood(moodId);  // Optionally update the current mood in the component state
      setPetImage(data.pet_image_url);  // Update the parent component's pet image state
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  return (
    <div>
      <h2>Update Pet Mood</h2>
      <div>
        {moods.map((mood) => (
          <button key={mood.id} onClick={() => updateMood(mood.id)}>
            {mood.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PetMoodUpdater;
