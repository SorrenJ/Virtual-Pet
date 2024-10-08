import React, { useState } from 'react';
import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

// Function to analyze sentiment
const analyzeSentiment = (text) => {
  const result = sentimentAnalyzer.analyze(text);
  if (result.score > 0) {
    return 'happy';
  } else if (result.score < 0) {
    return 'angry';
  } else {
    return 'neutral';
  }
};

// Function to simulate chatbot response
const getChatResponse = (input) => {
  const responses = {
    happy: 'I’m so glad you’re happy! 😊',
    angry: 'Why are you angry? 😞',
    neutral: 'I see. Tell me more.',
  };
  const sentiment = analyzeSentiment(input);
  return responses[sentiment] || 'Hmm, I don’t quite understand that.';
};

// Function to display dog emotion
const getDogEmotion = (sentiment) => {
  if (sentiment === 'happy') {
    return '🐕😊'; // Happy dog
  } else if (sentiment === 'angry') {
    return '🐕😡'; // Sad dog
  } else {
    return '🐕😐'; // Neutral dog
  }
};

// Main Chatbot Component
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [dogEmotion, setDogEmotion] = useState('🐕😐');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const sentiment = analyzeSentiment(input);
    const response = getChatResponse(input);
    const emotion = getDogEmotion(sentiment);

    setMessages([...messages, { user: input, bot: response }]);
    setDogEmotion(emotion);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      {/* Dog Emotion */}
      <div className="dog-emotion" style={{ fontSize: '48px' }}>
        {dogEmotion}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="user-message">You: {msg.user}</div>
            <div className="bot-message">Bot: {msg.bot}</div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;