import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ShopPage from './routes/shopPage';
import HomePage from './routes/homePage'; // Default home page
import AdoptPage from './routes/adoptPage'; // Default adopt page
import FeedPetPage from './routes/feedPetPage'; 
import PlayPetPage from './routes/playPetPage'; 
import CleanPetPage from './routes/cleanPetPage'; 
import HomeTesterPage from './routes/homeTesterPage'; 
import HomeTesterPage2 from './routes/homeTesterPage2'; 
import MoodTesterPage from './routes/moodTesterPage'; 
import NavBar from './routes/navBar';
import './App.css';
import PetPage from './routes/petPage';
import FrontPage from './routes/frontPage';


function App() {
  const location = useLocation(); // Get the current location

  return (
    <div className="App">
      {/* Render NavBar only if not on the FrontPage */}
      {location.pathname !== '/' && (
        <header className="NavBar">
          <NavBar />
        </header>

      )}
      <main> {/* Use <main> instead of <body> for semantic HTML */}
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/home" element={<HomePage />} /> {/* Home page */}
          <Route path="/shop" element={<ShopPage />} /> {/* Shop page */}
          <Route path="/adopt" element={<AdoptPage />} />
          <Route path="/playPet" element={<PlayPetPage />} />
          <Route path="/feedPet" element={<FeedPetPage />} />
          <Route path="/cleanPet" element={<CleanPetPage />} />
          <Route path="/homeTester" element={<HomeTesterPage />} />
          <Route path="/homeTester2" element={<HomeTesterPage2 />} />
          <Route path="/sprites" element={<PetPage />} />
          <Route path="/mood" element={<MoodTesterPage />} />
         
        </Routes>
      </main>
    </div>

  );
}

// Wrap App in Router to use useLocation
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
