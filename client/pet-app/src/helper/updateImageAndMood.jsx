const updateImageAndMood = async (userId, moodId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/pets/update-image/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood_id: moodId }), // Send the mood_id for update
    });

    if (!response.ok) throw new Error('Failed to update mood and image');

    // Fetch updated pet data to reflect mood and image change
    const updatedResponse = await fetch(`http://localhost:5000/api/pets/${userId}`);
    if (!updatedResponse.ok) throw new Error('Failed to fetch updated pet data');

    return await updatedResponse.json(); // Return the updated pet data
  } catch (error) {
    console.error('Error updating mood and image:', error);
    throw error; // Rethrow error for handling in MathGame
  }
};

export default updateImageAndMood;