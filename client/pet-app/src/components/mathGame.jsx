import React, { useState, useEffect } from 'react';
import updatePetMood from '../helper/petUpdateMood';
import submitScore from '../helper/submitScore';

const MathGame = ({ userId }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for the game
  const [gameOver, setGameOver] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [originalPetImage, setOriginalPetImage] = useState(''); // Original image
  const [currentPetImage, setCurrentPetImage] = useState(''); // Dynamic image
  const [originalMoodId, setOriginalMoodId] = useState(0); // Original mood ID
  const [moodId, setMoodId] = useState(0); // Dynamic mood ID
  const [streak, setStreak] = useState(0); // Track correct answer streak
  const [feedbackMessage, setFeedbackMessage] = useState(''); // UI feedback

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch pets data');
        const petsData = await response.json();
        setPets(petsData);

        if (petsData.length > 0) {
          const firstPet = petsData[0];
          setSelectedPetId(firstPet.id);
          setOriginalPetImage(firstPet.pet_image_url); // Save original image
          setCurrentPetImage(firstPet.pet_image_url);
          setOriginalMoodId(firstPet.mood_id); // Save original mood
          setMoodId(firstPet.mood_id);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, [userId]);

  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setAnswer('');
  };

  useEffect(() => {
    generateProblem();

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          setGameOver(true);
          return 0; // End the game
        }
        return prevTime - 1; // Decrement by 1
      });
    }, 1000);

    // Cleanup function to clear the timer when component unmounts or game ends
    return () => {
      clearInterval(timer); // Clear the interval
    };
  }, []);

  const checkAnswer = async () => {
    const correctAnswer = num1 + num2;

    if (parseInt(answer) === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
      setFeedbackMessage('Correct!');

      let newMoodId = 3;  // Happy mood by default
      if (streak + 1 >= 3) newMoodId = 8;  // Mood change for streak (e.g., "wake")

      const newImage = await updatePetMood(userId, selectedPetId, newMoodId);
      setCurrentPetImage(newImage);
      setMoodId(newMoodId);
    } else {
      setFeedbackMessage(`Wrong! The correct answer was ${correctAnswer}`);
      setStreak(0);
      const newImage = await updatePetMood(userId, selectedPetId, 11); // Angry mood
      setCurrentPetImage(newImage);
      setMoodId(11);
    }

    generateProblem();
    setAnswer('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      checkAnswer();
    }
  };

  useEffect(() => {
    if (gameOver) {
      submitScore(userId, score);

      // Revert the pet's mood and image to its original state after the game
      const revertMoodAndImage = async () => {
        await updatePetMood(userId, selectedPetId, originalMoodId); // Revert to original mood
        setCurrentPetImage(originalPetImage); // Revert to original image
        setMoodId(originalMoodId); // Reset mood ID
      };

      revertMoodAndImage();
      setFeedbackMessage('Game Over! Your score has been submitted.');
    }
  }, [gameOver, submitScore, userId, score, originalMoodId, originalPetImage]);

  return (
    <div>
      <h1>Math Game</h1>

      {pets.length > 0 && (
        <div>
          <label htmlFor="pet-select">Choose your pet:</label>
          <select
            id="pet-select"
            value={selectedPetId}
            onChange={(e) => {
              const selectedPet = pets.find((pet) => pet.id === parseInt(e.target.value, 10));
              if (selectedPet) {
                setSelectedPetId(selectedPet.id);
                setOriginalPetImage(selectedPet.pet_image_url);
                setCurrentPetImage(selectedPet.pet_image_url);
                setOriginalMoodId(selectedPet.mood_id);
                setMoodId(selectedPet.mood_id);
                setStreak(0); // Reset streak when changing pets
              }
            }}
          >
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {feedbackMessage && <p>{feedbackMessage}</p>} {/* Display feedback */}

      {gameOver ? (
        <h2>Game Over! Your score: {score}</h2>
      ) : (
        <div>
          <p>Time left: {timeLeft}s</p>
          <p>What is {num1} + {num2}?</p>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown} // Add the keydown handler here
          />
          <button onClick={checkAnswer}>Submit Answer</button>
          <p>Score: {score}</p>
          <p>You made: {score * 10}</p>
        </div>
      )}

      {selectedPetId && (
        <div>
          <h2>Your Pet</h2>
          <img
            src={currentPetImage}
            alt="Pet"
            style={{ width: '150px', height: '150px' }}
          />
        </div>
      )}
    </div>
  );
};

export default MathGame;
