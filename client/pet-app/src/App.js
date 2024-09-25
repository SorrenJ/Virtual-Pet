import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopPage from './routes/shopPage';
import HomePage from './routes/homePage'; // Create a simple HomePage component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Home page */}
            <Route path="/shop" element={<ShopPage />} /> {/* Shop page */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
