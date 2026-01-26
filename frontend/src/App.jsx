import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./Sections/HomePage/Navbar";
import Home from "./Sections/HomePage/Home";
import Info from "./Sections/HomePage/Info";
import Work from "./Sections/HomePage/Work";
import Visual from "./Sections/HomePage/Visual";
import Foter from "./Sections/HomePage/Footer";
import FlashCardGenerator from "./Sections/FlashCard";
import QuizGenerator from "./Sections/Quiz";
import Cursor from "./Sections/Common/cursor";
import AuthModal from "./Sections/User/AuthModal";

function HomePage() {
  return (
    <>
      <Home />
      <Info />
      <Work />
      <Visual />
      <Foter />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <Navbar
        onLoginClick={() => openAuth('login')}
        onSignupClick={() => openAuth('signup')}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
      {location.pathname === "/" && !isAuthOpen && <Cursor />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcard" element={<FlashCardGenerator />} />
        <Route path="/quiz" element={<QuizGenerator />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App