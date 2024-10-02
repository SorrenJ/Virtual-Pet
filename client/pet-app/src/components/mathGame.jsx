import React, { useState, useEffect, useCallback } from 'react';
import updateImageAndMood from '../helper/updateImageAndMood';
import submitScore from '../helper/submitScore'; 

const MathGame = ({ userId }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Time limit of 30 seconds
  const [gameOver, setGameOver] = useState(false);
  const [pet, setPet] = useState(null); // State to store pet info
  const [originalPetImage, setOriginalPetImage] = useState(''); // State to store original pet image

  // Fetch the user's pet when the component mounts
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch pet data');
        const petData = await response.json();
        setPet(petData);
        setOriginalPetImage(petData.pet_image_url); // Store the original image
      } catch (error) {
        console.error('Error fetching pet:', error);
      }
    };

    fetchPet();
  }, [userId]);

  // Generate a new math problem
  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setAnswer('');
  };

  useEffect(() => {
    generateProblem(); // Generate initial problem

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const handleAnswerChange = (e) => setAnswer(e.target.value);

  // Detect "Enter" key press to submit answer
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const checkAnswer = async () => {
    const correctAnswer = num1 + num2;
    if (parseInt(answer) === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      console.log('Correct answer! Updating mood to happy (3)');
      const updatedPet = await updateImageAndMood(userId, 3); // Update mood to happy (mood_id 3)
      setPet(updatedPet); // Update pet with happy image
    } else {
      console.log('Wrong answer! Updating mood to angry (11)');
      const updatedPet = await updateImageAndMood(userId, 11); // Update mood to angry (mood_id 11)
      setPet(updatedPet); // Update pet with angry image
    }
    generateProblem(); // Generate a new problem
    setAnswer(''); // Reset answer input after checking
  };

  // Function to handle the end of the game
  const handleGameOver = () => {
    setPet((prevPet) => ({
      ...prevPet,
      pet_image_url: originalPetImage, // Revert to original pet image
    }));
  };

  useEffect(() => {
    if (gameOver) {
      submitScore(userId, score); // Submit the score when the game is over
      handleGameOver(); // Revert image on game over
    }
  }, [gameOver, submitScore, userId, score]);

  return (
    <div>
      <h1>Math Game</h1>
      
      {/* Display the user's pet */}
      {pet && (
        <div>
          <h2>Your Pet: {pet.name}</h2>
          <img src={pet.pet_image_url} alt={pet.name} style={{ width: '150px', height: '150px' }} />
        </div>
      )}

      {gameOver ? (
        <div>
          <h2>Game Over! Your score: {score}</h2>
        </div>
      ) : (
        <div>
          <p>Time left: {timeLeft}s</p>
          <p>What is {num1} + {num2}?</p>
          <input
            type="number"
            value={answer}
            onChange={handleAnswerChange}
            onKeyPress={handleKeyPress} // Add key press event listener
          />
          <button onClick={checkAnswer}>
            Submit Answer
          </button>
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default MathGame;
