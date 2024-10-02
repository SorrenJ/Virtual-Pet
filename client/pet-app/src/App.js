import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShopPage from './routes/shopPage';
import HomePage from './routes/homePage'; // Default home page
import AdoptPage from './routes/adoptPage'; // Default adopt page
import FeedPetPage from './routes/feedPetPage'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes> {/* Use Routes to create paths*/}
            <Route path="/" element={<HomePage />} /> {/* Home page */}
            <Route path="/shop" element={<ShopPage />} /> {/* Shop page */}
            <Route path="/adopt" element={<AdoptPage />} />
            <Route path="/feedPet" element={<FeedPetPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
