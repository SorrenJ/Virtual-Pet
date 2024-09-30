import React, { useState, useEffect, useCallback } from 'react';

const MathGame = ({ userId }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // Time limit of 20 seconds
  const [gameOver, setGameOver] = useState(false);
  
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

  const checkAnswer = () => {
    if (parseInt(answer) === num1 + num2) {
      setScore((prevScore) => prevScore + 1);
    }
    generateProblem();
  };

  // Function to submit score to the server
  const submitScore = useCallback(async () => {
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
      alert(`Game Over! You earned $${moneyEarned}. Your new balance is $${result.money}`);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('There was an error submitting your score. Please try again.');
    }
  }, [userId, score]);

  useEffect(() => {
    if (gameOver) {
      submitScore(); // Submit the score when the game is over
    }
  }, [gameOver, submitScore]);

  return (
    <div>
      <h1>Math Game</h1>
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
