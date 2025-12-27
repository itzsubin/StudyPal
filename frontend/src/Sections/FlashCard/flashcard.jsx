import React, { useState } from 'react';
import { Upload, FileText, Brain, BookOpen, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Sparkles, BrainCircuit, StickyNote, NotebookText, RefreshCw, Zap, CopyCheck, NotebookPen } from 'lucide-react';
import styles from './FlashStyles.module.css'; 

function FlashCard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [understood, setUnderstood] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const [cardlimit, setCardLimit] = useState(15);
   const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      // TODO: API CALL - Upload file
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(1);
      }, 2000);
    }
  }

  const handleTextGenerate = () => {

    setIsProcessing(true);
    // TODO: API CALL - Process text
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(2)}, 2000);
  };

  const selectMode = (mode) => {
    setSelectedMode(mode);

    const limit = mode === 'recall' ? 15 : 20;
    setCardLimit(limit);

// TODO: API CALL - Request flashcards with limit

    const mockCards = mode === 'recall' 
      ? Array(limit).fill(0).map((_, i) => ({
          id: i,
          question: i === 0 ? 'What is Big-O Notation?' : 
                    i === 1 ? 'What is a Binary Search Tree?' :
                    i === 2 ? 'What is Recursion?' :
                    `Sample Question ${i + 1}?`,
          answer: i === 0 ? 'Big-O notation describes the time or space complexity of an algorithm as input size grows. It helps developers understand how their code performs with larger datasets.' :
                  i === 1 ? 'A Binary Search Tree is a data structure where each node has at most two children, with left child smaller and right child larger than the parent.' :
                  i === 2 ? 'Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.' :
                  `This is the answer to question ${i + 1}. It provides detailed explanation of the concept.`
        }))
      : Array(Math.min(limit, 20)).fill(0).map((_, i) => ({
          id: i,
          title: i === 0 ? 'Big-O Notation' :
                 i === 1 ? 'Binary Search Tree' :
                 i === 2 ? 'Recursion' :
                 `Concept ${i + 1}`,
          important: i < 3,
          points: i === 0 ? [
              'Measures algorithm efficiency',
              'Focuses on worst-case scenario',
              'Common types: O(1), O(n), O(log n)',
              'Used in data structures & algorithms'
            ] : i === 1 ? [
              'Hierarchical data structure',
              'Left subtree < parent < right subtree',
              'Average search time: O(log n)',
              'Used for efficient searching and sorting'
            ] : [
              'Key point 1 about this concept',
              'Key point 2 with important details',
              'Key point 3 for better understanding',
              'Key point 4 to remember'
            ]
        }));
    
    setFlashcards(mockCards);
    setCurrentStep(4);
  };

  const nextCard = () => {
    if(currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if(currentCardIndex > 0){
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
        setIsFlipped(false);
      }
    }
  };

  const markAsUnderstood = (fromReview = false, cardID = null) => {
    let targetID;
    if (fromReview){
      targetID = cardID;
    
    } else {
      if (flashcards[currentCardIndex]) {
        targetID = flashcards[currentCardIndex].id;
      }
      else {
        targetID = null;
      }
    }

      if (!understood.includes(targetID)) {
      setUnderstood([...understood, targetID]);
      
      // TODO: API CALL - Save progress as understood
      // Example: saveProgress(targetId, 'understood')
    }

      if (fromReview) {
      setReviewCards(reviewCards.filter(id => id !== cardID));
      
      // TODO: API CALL - Remove from review list
      // Example: removeFromReview(cardId)
    } else {
      nextCard();
    }
  };
  
  const markForReview = () => {
      let cardID;
      if(flashcards[currentCardIndex]){
        cardID = flashcards[currentCardIndex].id;
      } else {
        cardID = undefined;
      }

      if(!reviewCards.includes(cardID)){
        setReviewCards([...reviewCards, cardID]);

      // TODO: API CALL - Mark card for review
      // Example: saveProgress(cardId, 'review')

      }

        nextCard();
  };

  const goToReviewSection = () => {
    setCurrentStep(5);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setSelectedMode(null);
    setCardLimit(15);
    setFlashcards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setUnderstood([]);
    setReviewCards([]);
  };

  const getReviewCardData = (cardId) => {
    return flashcards.find(card => card.id === cardId);
  };

  return (
    <div className = {styles.container}>

{/* Processing */}
  {isProcessing && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Analyzing your content...
          </h2>
          <p className="text-base text-gray-600 mb-4">
            Our AI is extracting key concepts and creating your study materials
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce delay-200"></div>
          </div>
      </div>
    </div>
  )}


      {/* Step 1 - upload*/}

      {!isProcessing && currentStep === 1 && (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8 ">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-12">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Upload your study material
              </h1>
              <p className="text-xl text-gray-600 mb-2 font-medium">
                PDF • Text • Notes
              </p>
              <p className="text-base text-gray-500">
                Study Pal will extract key concepts automatically
              </p>
            </div>

            <div className="mb-8">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center p-12 border-[3px] border-dashed border-gray-300 rounded-3xl bg-white cursor-pointer transition-all hover:border-blue-600 hover:bg-blue-50 w-[800px] h-[300px]"
              >
                <Upload className="w-16 h-16 text-blue-600 mb-4" />
                <span className="text-lg font-semibold text-gray-700 mb-2">
                  Click to upload or drag and drop
                </span>
                <span className="text-base text-gray-500">
                  PDF, TXT, DOC (Max 10MB)
                </span>
              </label>
            </div>

            <div className="text-center my-8 relative left-5">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
              <span className="bg-[image:var(--gradient-primary)] px-4 text-gray-500 font-medium relative">OR</span>
            </div>

            <div className="flex flex-col gap-5">
              <textarea
                placeholder="Paste your notes here..."
                className=" w-[800px] min-h-[250px] p-6 border-2 border-gray-300 rounded-2xl text-base resize-vertical bg-white text-black focus:outline-none focus:border-blue-600 transition"
              />
              <button 
                onClick={handleTextGenerate}
                className="w-[800px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition transform hover:scale-105"
              >
                Generate Flashcards
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Mode Selection */}

        {currentStep === 2 && (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              How do you want to study?
            </h1>
            <p className="text-xl font-bold text-gray-700 mb-12">
              Choose your learning style
            </p>

            <div className="grid md:grid-cols-2 gap-16 mb-8">
              <div 
                onClick={() => selectMode('recall')}
                className="bg-gradient-to-br from-indigo-50 to-blue-200 border-[1px] border-blue-400 rounded-3xl p-10 cursor-pointer text-left transition-all hover:border-blue-600 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                  <CopyCheck className=" w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                   Recall Cards
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  Test your memory with flip cards
                </p>
                <div className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Up to 15 cards
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-700">✓ Question & Answer format</span>
                  <span className="text-sm text-gray-700">✓ Active recall practice</span>
                  <span className="text-sm text-gray-700">✓ Memory reinforcement</span>
                </div>
              </div>

              <div 
                onClick={() => selectMode('notes')}
                className="bg-gradient-to-br from-teal-50 to-cyan-100 border-[1px] border-green-400 rounded-3xl p-10 cursor-pointer text-left transition-all hover:border-green-600 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
                  <NotebookPen className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Smart Notes
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  Quick revision of key concepts
                </p>
                <div className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Up to 20 notes
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-700">✓ Condensed bullet points</span>
                  <span className="text-sm text-gray-700">✓ Exam-ready summaries</span>
                  <span className="text-sm text-gray-700">✓ Fast review</span>
                </div>
              </div>
            </div>

            <button 
              onClick={resetFlow} 
              className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:border-gray-500 transition"
            >
              <ArrowLeft size={20} />
              Upload different file
            </button>
          </div>
        </div>
      )}


    </div>
  )
}

export default FlashCard;
