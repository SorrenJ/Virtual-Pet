 const updatePetMood = async (userId, petId, moodId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/user-pets/update-image/${userId}/${petId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood_id: moodId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update mood');
    }

    const data = await response.json();
    return data.pet_image_url;  // Return the updated image URL
  } catch (error) {
    console.error('Error updating mood:', error);
  }
};

export default updatePetMood