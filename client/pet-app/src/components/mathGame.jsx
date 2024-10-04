import React, { useState, useEffect } from 'react';
import updateImageAndMood from '../helper/updateImageAndMood';
import submitScore from '../helper/submitScore';

const MathGame = ({ userId }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Time limit of 30 seconds
  const [gameOver, setGameOver] = useState(false);
  const [pets, setPets] = useState([]); // Store pets info
  const [selectedPetId, setSelectedPetId] = useState(null); // Selected pet's ID
  const [originalPetImage, setOriginalPetImage] = useState(''); // Original pet image
  const [currentPetImage, setCurrentPetImage] = useState(''); // State for current pet image based on mood
  const [moodId, setMoodId] = useState(0); // New state for mood ID
  const [currentSpriteId, setCurrentSpriteId] = useState(0); // New state for the current sprite ID
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null); // State to track if last answer was correct

  // Fetch the user's pets on component mount
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch pets data');
        const petsData = await response.json();
        setPets(petsData);

        // Default to first pet
        if (petsData.length > 0) {
          setSelectedPetId(petsData[0].id);
          setOriginalPetImage(petsData[0].pet_image_url);
          setCurrentPetImage(petsData[0].pet_image_url); // Set initial current image
          setMoodId(petsData[0].mood_id); // Initialize moodId
          setCurrentSpriteId(petsData[0].sprite_id); // Set initial sprite ID
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
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

  const checkAnswer = async () => {
    const correctAnswer = num1 + num2;
    try {
      let updatedPet;
      if (parseInt(answer) === correctAnswer) {
        setScore((prevScore) => prevScore + 1);
        console.log(`Correct answer! Score: ${score + 1}`);
        // Update selected pet's mood to happy (mood_id = 3)
        updatedPet = await updateImageAndMood(userId, selectedPetId, 3);
        setMoodId(3); // Update mood state
        setCurrentPetImage(updatedPet.pet_image_url); // Update current image to happy
        setLastAnswerCorrect(true); // Track that the last answer was correct
      } else {
        console.log(`Incorrect answer! Correct answer was: ${correctAnswer}`);
        // Update selected pet's mood to angry (mood_id = 11)
        updatedPet = await updateImageAndMood(userId, selectedPetId, 11);
        setMoodId(11); // Update mood state
        setCurrentPetImage(updatedPet.pet_image_url); // Update current image to angry
        setLastAnswerCorrect(false); // Track that the last answer was incorrect
      }

      // Log updated pet data
      console.log('Updated Pet:', updatedPet);

      // Update the pet in the state with the new image URL
      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.id === updatedPet.id ? { ...pet, pet_image_url: updatedPet.pet_image_url } : pet
        )
      );

      generateProblem(); // Generate new problem
      setAnswer('');
    } catch (error) {
      console.error('Error updating pet mood:', error);
    }
  };

  const handleGameOver = () => {
    // Revert selected pet's image back to original
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === selectedPetId ? { ...pet, pet_image_url: originalPetImage } : pet
      )
    );
  };

  useEffect(() => {
    if (gameOver) {
      submitScore(userId, score); // Submit score when game is over
      handleGameOver(); // Revert pet's image
      console.log('Game over! Your score has been submitted:', score);
    }
  }, [gameOver, submitScore, userId, score, originalPetImage, selectedPetId]);

  // Find the selected pet
  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  return (
    <div>
      <h1>Math Game</h1>

      {/* Dropdown to select pet */}
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
                setOriginalPetImage(selectedPet.pet_image_url); // Set original image
                setCurrentPetImage(selectedPet.pet_image_url); // Set current image to original
                setMoodId(selectedPet.mood_id); // Set the current mood
                setCurrentSpriteId(selectedPet.sprite_id); // Set current sprite ID
                setLastAnswerCorrect(null); // Reset last answer correctness when selecting a new pet
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

      {/* Display selected pet */}
      {selectedPet && (
        <div>
          <h2>Your Pet: {selectedPet.name}</h2>
          <img
            src={lastAnswerCorrect === true ? 'happy-image-url' : lastAnswerCorrect === false ? 'angry-image-url' : currentPetImage} // Conditional src
            alt={selectedPet.name}
            style={{ width: '150px', height: '150px' }}
          />
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
