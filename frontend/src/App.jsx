import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./Sections/HomePage/Navbar";
import Home from "./Sections/HomePage/Home";
import Info from "./Sections/HomePage/Info";
import Work from "./Sections/HomePage/Work";
import Visual from "./Sections/HomePage/Visual";
import Foter from "./Sections/HomePage/Footer";
import FlashCardGenerator from "./Sections/FlashCard";
import QuizGenerator from "./Sections/Quiz";
import Cursor from "./Sections/Common/cursor";

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

  return (
    <>
      <Navbar />
      {location.pathname === "/" && <Cursor />}
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