const updateImageAndMood = async (userId, petId, moodId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/pets/update-image/${userId}/${petId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood_id: moodId }), // Send mood_id for update
    });

    if (!response.ok) throw new Error('Failed to update mood and image');

    // Return the updated pet data (including new sprite URL)
    return await response.json();
  } catch (error) {
    console.error('Error updating mood and image:', error);
    throw error; // Rethrow error for handling in MathGame
  }
};

export default updateImageAndMood;
