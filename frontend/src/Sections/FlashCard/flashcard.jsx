import React, { useState } from 'react';
import {
  Upload,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Layers,
  NotebookPen
} from 'lucide-react';
import styles from './FlashStyles.module.css';
import SmartNote from './Smart Notes/smartnote';

const FormattedText = ({ text }) => {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <p className="text-base text-gray-800 leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);

          // Special handling for "Explanation:" label - just bold, no highlight
          if (content.trim().replace(/:$/, '').toLowerCase() === 'explanation') {
            return <strong key={index} className="font-bold text-gray-900">{content}</strong>;
          }

          // Highlight other bolded terms
          return (
            <span key={index} className="font-semibold bg-yellow-200 text-gray-900 px-1 rounded mx-0.5">
              {content}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};

const FlashCard = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showWithFile, setShowWithFile] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  // Connect to API and check health on mount
  React.useEffect(() => {
    checkConnection();
  }, []);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [understood, setUnderstood] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const [cardlimit, setCardLimit] = useState(15);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationText, setExplanationText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null); // 'checking', 'online', 'offline'
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setShowWithFile(true);

  };

  const handleGenerate = async () => {
    setIsProcessing(true);

    // MOCK: API disabled for frontend development
    setTimeout(() => {
      setExtractedText(inputText || "Mock extracted text from file...");
      setIsProcessing(false);
      setCurrentStep(2);
    }, 1000);

    /*
    try {
      let response;

      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        response = await fetch('http://localhost:8787/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:8787/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: inputText }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process content');
      }

      if (data.text) {
        if (uploadedFile) {
          setExtractedText(data.text);
        } else {
          setInputText(data.text);
        }
      }

      console.log('--- EXTRACTED TEXT ---', data.text);

      // Delay for better UX 
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(2);
      }, 500);

    } catch (error) {
      console.error('Generation error:', error);
      alert(error.message);
      setIsProcessing(false);
    }
    */
  };

  const selectMode = async (mode) => {
    setSelectedMode(mode);

    const limit = mode === 'recall' ? 15 : 20;
    setCardLimit(limit);

    if (mode === 'recall') {
      setIsProcessing(true);

      // MOCK: API disabled
      setTimeout(() => {
        setFlashcards([
          { id: 1, question: "Mock Q1: What is the main goal?", answer: "To verify frontend without backend." },
          { id: 2, question: "Mock Q2: Is the API active?", answer: "No, it is currently mocked." },
          { id: 3, question: "Mock Q3: Can I edit UI?", answer: "Yes, fully independent of server." }
        ]);
        setCurrentStep(4);
        setIsProcessing(false);
      }, 1000);

      /*
      try {
        const response = await fetch('http://localhost:8787/recall', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: uploadedFile ? extractedText : inputText,
            limit: limit
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate recall cards');
        }

        setFlashcards(data);
        setCurrentStep(4);
      } catch (error) {
        console.error("Error fetching recall cards:", error);
        if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
          alert("Quota Exceeded. Please wait about a minute and try again, or check your API usage at ai.google.dev.");
        } else {
          alert("Failed to generate cards: " + error.message);
        }
      } finally {
        setIsProcessing(false);
      }
      */
    } else if (mode === 'notes') {
      // Mock flow for Smart Notes UI development
      setIsProcessing(true);

      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(4);
      }, 800);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
      setShowExplanation(false);
      setHintText('');
      setExplanationText('');
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
      setShowExplanation(false);
      setHintText('');
      setExplanationText('');
    }
  };

  const markAsUnderstood = (fromReview = false, cardID = null) => {
    let targetID;
    if (fromReview) {
      targetID = cardID;
    } else {
      if (flashcards[currentCardIndex]) {
        targetID = flashcards[currentCardIndex].id;
      } else {
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
    if (flashcards[currentCardIndex]) {
      cardID = flashcards[currentCardIndex].id;
    } else {
      cardID = undefined;
    }

    if (!reviewCards.includes(cardID)) {
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

  const requestHint = async () => {
    if (showHint) {
      setShowHint(false);
      return;
    }

    setIsLoadingHint(true);
    setShowHint(true);

    // MOCK: API disabled
    setTimeout(() => {
      setHintText("This is a mock hint. Backend is disabled.");
      setIsLoadingHint(false);
    }, 500);

    /*
    try {
      const response = await fetch('http://localhost:8787/recall/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: flashcards[currentCardIndex].question
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate hint');
      }

      setHintText(data.hint);
    } catch (error) {
      console.error("Hint error:", error);
      setHintText("Sorry, I couldn't generate a hint right now. Please try again.");
    } finally {
      setIsLoadingHint(false);
    }
    */
  };

  const checkConnection = async () => {
    // MOCK: API disabled for frontend development
    setConnectionStatus('online');
    setIsTestingConnection(false);
    /*
    setIsTestingConnection(true);
    setConnectionStatus('checking');
    try {
      const response = await fetch('http://localhost:8787/health');
      const data = await response.json();
      if (response.ok && data.healthy) {
        setConnectionStatus('online');
      } else {
        setConnectionStatus('offline');
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus('offline');
    } finally {
      setIsTestingConnection(false);
    }
    */
  };

  const requestExplanation = async () => {
    if (showExplanation) {
      setShowExplanation(false);
      return;
    }

    setIsLoadingExplanation(true);
    setShowExplanation(true);

    // MOCK: API disabled
    setTimeout(() => {
      setExplanationText("This is a mock explanation. Backend is disabled.");
      setIsLoadingExplanation(false);
    }, 500);

    /*
    try {
      const response = await fetch('http://localhost:8787/recall/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: flashcards[currentCardIndex].question,
          answer: flashcards[currentCardIndex].answer,
          context: uploadedFile ? extractedText : inputText // Pass the appropriate context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate explanation');
      }

      setExplanationText(data.explanation);
    } catch (error) {
      console.error("Explanation error:", error);
      setExplanationText("Sorry, I couldn't generate an explanation right now. Please try again.");
    } finally {
      setIsLoadingExplanation(false);
    }
    */
  };

  const generateQuiz = () => {
    // TODO: API CALL - Generate quiz from flashcards
    // Example: generateQuiz(flashcards).then(quiz => { ... })
    alert('Generate Quiz - API integration pending');
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedText('');
    setShowWithFile(false);

    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  const canGenerate =
    uploadedFile ||
    (inputText.trim().length > 0 && wordCount >= 100);

  return (
    <div className={styles.container}>
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


      {/* Step 4: Smart Notes */}
      {currentStep === 4 && selectedMode === 'notes' && (
        <SmartNote
          onBack={resetFlow}
          extractedText={extractedText}
          fileName={uploadedFile?.name}
        />
      )}

      {/* Step 1 - Upload */}
      {currentStep === 1 && (
        <div className="flex justify-center items-center p-8">
          <div className="max-w-3xl w-full">

            {/* Header */}
            <div className="text-center mb-10">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                Upload your study material
              </h1>
              <p className="text-lg text-gray-600">
                PDF • Text • Notes — StudyPal extracts key concepts automatically
              </p>

              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  onClick={checkConnection}
                  disabled={isTestingConnection}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border shadow-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95
                    ${connectionStatus === 'online' ? 'bg-green-50 border-green-200 text-green-700' :
                      connectionStatus === 'offline' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-blue-50 border-blue-200 text-blue-700'}
                  `}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-green-500 animate-pulse' :
                    connectionStatus === 'offline' ? 'bg-red-500' :
                      'bg-blue-400 animate-bounce'
                    }`} />
                  {isTestingConnection ? 'Checking Connection...' :
                    connectionStatus === 'online' ? 'API Connected & Ready' :
                      connectionStatus === 'offline' ? 'API Connection Failed' :
                        'Test API Connection'}
                </button>
              </div>
            </div>

            {/* File Preview */}
            {uploadedFile && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-between animate-fadeIn">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    if (uploadedFile) {
                      const fileURL = URL.createObjectURL(uploadedFile);
                      window.open(fileURL, '_blank');
                    }
                  }}
                  title="Click to preview file"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 underline decoration-blue-300 decoration-2 underline-offset-2">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload Box */}
            <div className="mb-8">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={inputText.trim().length > 0}
              />

              <label
                htmlFor="file-upload"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (uploadedFile || inputText.trim().length > 0) return;

                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    const file = files[0];
                    if (file.type === 'application/pdf') {
                      // Simulate the event structure expected by handleFileUpload
                      const mockEvent = { target: { files: [file] } };
                      handleFileUpload(mockEvent);
                    } else {
                      alert("Please upload a PDF file.");
                    }
                  }
                }}
                className={`flex flex-col items-center justify-center p-12 border-[3px] border-dashed rounded-3xl transition-all
            ${uploadedFile
                    ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-gray-300 bg-white cursor-pointer hover:border-blue-600 hover:bg-blue-50'}
          `}
              >
                <Upload className="w-16 h-16 text-blue-600 mb-4" />
                <span className="text-lg font-semibold text-gray-700">
                  Click to upload or drag & drop
                </span>
                <span className="text-sm text-gray-500">
                  PDF (Max 10MB)
                </span>
              </label>
            </div>

            {/* OR Divider */}
            <div className="text-center my-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
              <span className="bg-white px-4 text-gray-500 relative font-medium">
                OR
              </span>
            </div>

            {/* Text Input */}
            <textarea
              placeholder={
                uploadedFile
                  ? 'Text input disabled — remove file to type notes'
                  : 'Paste your notes here (minimum 100 words)'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!!uploadedFile}
              className={`w-full min-h-[220px] p-6 border-2 rounded-2xl text-base resize-vertical transition mb-6
    ${uploadedFile
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-black border-gray-300 focus:border-blue-600'}
            `}
            />

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={canGenerate}
              className={`w-full px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition
          ${canGenerate
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
            >
              Generate Flashcards
              <ArrowRight size={20} />
            </button>

          </div>
        </div>
      )}


      {/* Step 2: Mode Selection */}
      {currentStep === 2 && (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-8">
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
                  <Layers className="w-8 h-8 text-blue-700" />
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

      {/* Step 4: Recall Cards */}
      {currentStep === 4 && selectedMode === 'recall' && (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
          <div className="max-w-3xl w-full">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="font-bold text-blue-900">Recall Cards</span>
              </div>
              {reviewCards.length > 0 && (
                <button
                  onClick={goToReviewSection}
                  className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-yellow-200 transition"
                >
                  <RotateCcw size={16} />
                  Review ({reviewCards.length})
                </button>
              )}
            </div>

            <div
              onClick={() => !showHint && !showExplanation && setIsFlipped(!isFlipped)}
              className="w-full perspective-1000 cursor-pointer mb-8"
            >
              <div className={`relative w-full min-h-[400px] transition-transform duration-600 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front of card */}
                <div className="absolute w-full backface-hidden rounded-2xl bg-white border-2 border-gray-200 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-indigo-300 to-blue-600 px-8 py-2 text-white">
                    <div className="text-sm font-semibold opacity-90 mb-1">QUESTION</div>
                    <div className="text-base font-semibold text-gray-900">
                      {currentCardIndex + 1} / {flashcards.length}
                    </div>
                  </div>
                  <div className="p-10 flex flex-col items-center justify-center min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 leading-snug">
                      {flashcards[currentCardIndex]?.question}
                    </h2>
                    <div className="flex items-center mb-4 gap-2 text-gray-500 text-sm">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <ArrowRight size={16} />
                      </div>
                      <span className="font-medium">Tap to reveal answer</span>
                    </div>
                  </div>
                  {/* Hint Button - Only on Front */}
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requestHint();
                      }}
                      className={`absolute bottom-4 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition focus:outline-none ${showHint
                        ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-800'
                        : 'bg-yellow-50 border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                      <Lightbulb size={20} />
                      {isLoadingHint ? 'Loading...' : showHint ? 'Hide Hint' : 'Need a Hint?'}
                    </button>
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute w-full backface-hidden rounded-2xl bg-white border-2 border-gray-200 shadow-xl overflow-hidden rotate-y-180">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-6 text-white">
                    <div className="text-sm font-semibold opacity-90 mb-1">ANSWER</div>
                  </div>
                  <div className="p-10 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                    <p className="text-xl text-gray-800 leading-relaxed">
                      {flashcards[currentCardIndex]?.answer}
                    </p>
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requestExplanation();
                      }}
                      className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition ${showExplanation
                        ? 'bg-blue-100 border-2 border-blue-400 text-blue-800'
                        : 'bg-blue-50 border-2 border-blue-300 text-blue-700 hover:bg-blue-100'
                        }`}
                    >
                      <MessageSquare size={20} />
                      {isLoadingExplanation ? 'Loading...' : showExplanation ? 'Hide Explanation' : 'Explain'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showHint && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <p className="text-base text-gray-800 leading-relaxed">{hintText}</p>
                </div>
              </div>
            )}

            {showExplanation && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <FormattedText text={explanationText} />
                </div>
              </div>
            )}

            {isFlipped && !showHint && !showExplanation && (
              <div className="flex gap-4 mb-8">
                <button
                  onClick={markForReview}
                  className="flex-1 py-4 rounded-xl text-lg font-semibold border-2 border-yellow-400 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                >
                  <AlertCircle size={20} />
                  Review Again
                </button>
                <button
                  onClick={() => markAsUnderstood(false)}
                  className="flex-1 py-4 rounded-xl text-lg font-semibold border-2 border-green-400 flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 transition"
                >
                  <CheckCircle size={20} />
                  I Know This
                </button>
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="flex-1 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button
                onClick={nextCard}
                disabled={currentCardIndex === flashcards.length - 1}
                className="flex-1 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>{understood.length} understood</span>
              <span>{reviewCards.length} to review</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review Section */}
      {currentStep === 5 && (
        <div className="flex justify-center items-start min-h-[calc(100vh-5rem)] p-8">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Review Cards</h1>
              <div className="w-10"></div>
            </div>

            {reviewCards.length === 0 ? (
              <div className="text-center py-20">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  All caught up!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  You have no cards marked for review.
                </p>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
                >
                  Back to Study
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-gray-600 mb-6">
                  You have <span className="font-bold text-yellow-700">{reviewCards.length} card(s)</span> marked for review. Mark them as understood to remove from this list.
                </p>

                {reviewCards.map((cardId) => {
                  const card = getReviewCardData(cardId);
                  if (!card) return null;

                  return (
                    <div key={cardId} className="bg-white border-2 border-yellow-400 rounded-2xl p-8 shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {selectedMode === 'recall' ? card.question : card.title}
                          </h3>
                          {selectedMode === 'recall' ? (
                            <p className="text-base text-gray-700 leading-relaxed">
                              {card.answer}
                            </p>
                          ) : (
                            <ul className="list-none p-0">
                              {card.points.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3 py-2 text-base text-gray-700">
                                  <span className="text-green-600 text-xl leading-none">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => markAsUnderstood(true, cardId)}
                          className="flex-1 py-3 rounded-xl font-semibold border-2 border-green-400 flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 transition"
                        >
                          <CheckCircle size={20} />
                          Mark as Understood
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {currentStep === 5 && selectMode === 'smart' && (
            <SmartNote />
          )}
        </div>
      )}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .border-3 {
          border-width: 3px;
        }
        .duration-600 {
          transition-duration: 0.6s;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }

      `}</style>
    </div>
  );
}

export default FlashCard;