import React, { useState, useEffect } from 'react';
import updatePetMood from '../helper/petUpdateMood';
import submitScore from '../helper/submitScore';
import '../styles/mathGame.scss'; // Make sure to import the SCSS file

const MathGame = ({ userId }) => {
  // State variables
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [originalPetImage, setOriginalPetImage] = useState('');
  const [currentPetImage, setCurrentPetImage] = useState('');
  const [originalMoodId, setOriginalMoodId] = useState(0);
  const [moodId, setMoodId] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-pets/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch pets data');
        const petsData = await response.json();
        setPets(petsData);

        if (petsData.length > 0) {
          const firstPet = petsData[0];
          setSelectedPetId(firstPet.id);
          setOriginalPetImage(firstPet.pet_image_url);
          setCurrentPetImage(firstPet.pet_image_url);
          setOriginalMoodId(firstPet.mood_id);
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
    let timer;

    if (gameStarted) {
      generateProblem();

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      const revertMoodAndImageOnExit = async () => {
        if (selectedPetId && originalMoodId) {
          await updatePetMood(userId, selectedPetId, originalMoodId);
          setCurrentPetImage(originalPetImage);
          setMoodId(originalMoodId);
        }
      };
      revertMoodAndImageOnExit();
    };
  }, [gameStarted, selectedPetId, originalMoodId, originalPetImage, userId]);

  const checkAnswer = async () => {
    const correctAnswer = num1 + num2;

    if (parseInt(answer) === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
      setFeedbackMessage('Correct!');

      let newMoodId = 3;
      if (streak + 1 >= 3) newMoodId = 8;

      const newImage = await updatePetMood(userId, selectedPetId, newMoodId);
      setCurrentPetImage(newImage);
      setMoodId(newMoodId);
    } else {
      setFeedbackMessage(`Wrong! The correct answer was ${correctAnswer}`);
      setStreak(0);
      const newImage = await updatePetMood(userId, selectedPetId, 11);
      setCurrentPetImage(newImage);
      setMoodId(11);
    }

    generateProblem();
    setAnswer('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !gameOver) { 
      checkAnswer();
    }
  };

  useEffect(() => {
    if (gameOver) {
      submitScore(userId, score);

      const revertMoodAndImage = async () => {
        await updatePetMood(userId, selectedPetId, originalMoodId);
        setCurrentPetImage(originalPetImage);
        setMoodId(originalMoodId);
      };

      revertMoodAndImage();
      setFeedbackMessage(`Game Over! You earned $${score * 10}.`);
    }
  }, [gameOver, submitScore, userId, score, originalMoodId, originalPetImage]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    generateProblem();
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
  };

  const handlePetSelect = (pet) => {
    setSelectedPetId(pet.id);
    setOriginalPetImage(pet.pet_image_url);
    setCurrentPetImage(pet.pet_image_url);
    setOriginalMoodId(pet.mood_id);
    setMoodId(pet.mood_id);
    setStreak(0);
  };

  return (
    <div className="math-game-wrapper">
      <h1>Math Game</h1>

      {!gameStarted ? (
        <div className="pet-selection">
          {pets.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => handlePetSelect(pet)}
                  className={`pet-card ${selectedPetId === pet.id ? 'selected-pet' : ''}`}
                >
                  <img
                    src={pet.pet_image_url}
                    alt={pet.name}
                  />
                  <h3>{pet.name}</h3>
                </div>
              ))}
            </div>
          )}
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div className="game-container">
          <img src={currentPetImage} alt="Your Pet" />
          <h2>
            {num1} + {num2} = ?
          </h2>
          {/* Conditionally render the input and button */}
          {!gameOver ? (
            <>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={checkAnswer}>Submit</button>
            </>
          ) : null}
          <p>Score: {score}</p>
          {!gameOver && <p>Time Left: {timeLeft}</p>}
          <p>{feedbackMessage}</p>
        </div>
      )}
    </div>
  );
};

export default MathGame;
