const submitScore = async (userId, score) => {
  const moneyPerScore = 10; // Define money earned per score
  const moneyEarned = score * moneyPerScore;

  try {
    const response = await fetch('http://localhost:5000/api/convert-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, score }),
    });

    if (!response.ok) {
      throw new Error('Failed to update score');
    }

    const result = await response.json();
    return { moneyEarned, newBalance: result.money }; // Return earnings and new balance
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error; // Rethrow error for handling in MathGame
  }
};

export default submitScore;


