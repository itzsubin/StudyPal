import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  NotebookPen
} from 'lucide-react';
import styles from './FlashStyles.module.css';
import SmartNote from './Smart Notes/smartnote';
import RecallCards from './Recall Cards/recallcards';

const FlashCard = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showWithFile, setShowWithFile] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'checking', 'online', 'offline'
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  // Connect to API and check health on mount
  React.useEffect(() => {
    checkConnection();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setShowWithFile(true);
  };

  const handleGenerate = async () => {
    console.log('Generate button clicked!', { uploadedFile, inputText: inputText.substring(0, 100) });
    setIsProcessing(true);

    /*
     // MOCK: API disabled for frontend development
     setTimeout(() => {
       setExtractedText(inputText || "Mock extracted text from file...");
       setIsProcessing(false);
       setCurrentStep(2);
       console.log('Step set to 2');
     }, 1000);
     */
    try {
      let response;

      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
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
        setExtractedText(data.text);
        if (!uploadedFile) {
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
  };

  const selectMode = async (mode) => {
    setSelectedMode(mode);
    setCurrentStep(4);
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setSelectedMode(null);
    setExtractedText('');
    setInputText('');
  };

  const checkConnection = async () => {
    // MOCK: API disabled for frontend development
    /* setConnectionStatus('online');
     setIsTestingConnection(false);
     */
    setIsTestingConnection(true);
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
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

  // For frontend testing - always allow generation
  //const canGenerate = true;
  const canGenerate = uploadedFile || (inputText.trim().length > 0 && wordCount >= 100);

  return (
    <div className={styles.container}>
      {/* Processing - initial extraction */}
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

      {/* Step 4: Recall Cards */}
      {currentStep === 4 && selectedMode === 'recall' && (
        <RecallCards
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
                        'bg-blue-50 border-blue-200 text-blue-700'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-green-500 animate-pulse' :
                    connectionStatus === 'offline' ? 'bg-red-500' :
                      'bg-blue-400 animate-bounce'
                    }`} />
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
                    : 'border-gray-300 bg-white cursor-pointer hover:border-blue-600 hover:bg-blue-50'}`}
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
                  : 'bg-white text-black border-gray-300 focus:border-blue-600'}`}


            />
            <p className="text-sm text-gray-500 mt-2">
              {inputText.trim().split(/\s+/).filter(word => word.length > 0).length} words • Minimum 100 words required
            </p>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition
          ${canGenerate
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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
                  Up to 10 cards
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
                  Up to 10 notes
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

      <style>{`
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