import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Sections/HomePage/Navbar";
import Home from "./Sections/HomePage/Home";
import Info from "./Sections/HomePage/Info";
import Work from "./Sections/HomePage/Work";
import Visual from "./Sections/HomePage/Visual";
import Foter from "./Sections/HomePage/Footer";
import FlashCardGenerator from "./Sections/FlashCard";
import QuizGenerator from "./Sections/Quiz";

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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcard" element={<FlashCardGenerator />} />
        <Route path="/quiz" element={<QuizGenerator />} />
      </Routes>
    </Router>

  );
}

export default App