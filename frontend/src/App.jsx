import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './Context/AuthContext';
import Navbar from "./Sections/HomePage/Navbar";
import Home from "./Sections/HomePage/Home";
import Info from "./Sections/HomePage/Info";
import Work from "./Sections/HomePage/Work";
import Visual from "./Sections/HomePage/Visual";
import Foter from "./Sections/HomePage/Footer";
import FlashCardGenerator from "./Sections/FlashCard";
import QuizGenerator from "./Sections/Quiz";
import Cursor from "./Sections/Common/cursor";
import AuthModal from "./Sections/User/Before/AuthModal";
import AfterLogin from "./Sections/User/After";
import Dashboard from "./Sections/User/After/Main Dashboard/Dashboard/dashboard";

const HomePage = ({ onStartClick, user }) => {
  return (
    <>
      <Home onStartClick={onStartClick} user={user} />
      <Info />
      <Work />
      <Visual />
      <Foter />
    </>
  );
}

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const isAfterLoginPage = location.pathname.startsWith("/Menu") || location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isAfterLoginPage && (
        <Navbar
          onLoginClick={() => openAuth('login')}
          onSignupClick={() => openAuth('signup')}
          user={user}
        />
      )}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
      {location.pathname === "/" && !isAuthOpen && <Cursor />}
      <Routes>
        <Route path="/" element={<HomePage onStartClick={() => openAuth('signup')} user={user} />} />
        <Route path="/flashcard" element={<FlashCardGenerator />} />
        <Route path="/quiz" element={<QuizGenerator />} />
        <Route path="/Menu" element={
          <ProtectedRoute user={user}>
            <AfterLogin userName={user?.name} />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <Dashboard />
          </ProtectedRoute>
        } />
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