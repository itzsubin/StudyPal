import React, { useState } from 'react'
import styles from './quizhome.module.css';
import {
    Upload,
    FileText,
    Sparkles,
    X,
    Check
} from 'lucide-react';
const QuizHome = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [text, setText] = useState('');
    const [quizGenerated, setQuizGenerated] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const generateQuiz = () => {
        setIsProcessing(true)
        // Simulate quiz generation
        setTimeout(() => {
            setIsProcessing(false);
            setQuizGenerated(true);
            setTimeout(() => setQuizGenerated(false), 2000);
        }, 2000);
    };

    const canGenerate = (activeTab === 'upload' && file) || (activeTab === 'text' && text.trim().length > 50);


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

            {/* Step 1 - Upload */}
            {currentStep === 1 && (
                <div className="flex justify-center items-center p-8">
                    <div className="max-w-3xl w-full">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h1 className="text-5xl font-extrabold text-gray-800 mb-2">
                                Smart Quiz Generator
                            </h1>
                            <p className="text-lg text-gray-600">
                                Upload your study material and let AI create custom quizzes for you
                            </p>
                        </div>
                        {/* Main Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            {/* Tab Selector */}
                            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'upload'
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Upload className="w-5 h-5 inline-block mr-2" />
                                    Upload PDF
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'text'
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <FileText className="w-5 h-5 inline-block mr-2" />
                                    Paste Text
                                </button>
                            </div>

                            {/* Upload Tab */}
                            {activeTab === 'upload' && (
                                <div>
                                    {!file ? (
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer"
                                        >
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
                                                    <Upload className="w-10 h-10 text-indigo-600" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                                    Drop your PDF here
                                                </h3>
                                                <p className="text-gray-500 mb-4">or click to browse</p>
                                                <div className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                                    Choose File
                                                </div>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-6 h-6 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{file.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removeFile}
                                                    className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Text Tab */}
                            {activeTab === 'text' && (
                                <div>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Paste your study notes, textbook content, or any educational material here..."
                                        className="w-full h-64 p-6 bg-white border-2 border-gray-200 rounded-2xl focus:border-indigo-400 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
                                    />
                                    <p className="bg-white text-sm text-gray-500 mt-2">
                                        {text.length} characters • Minimum 50 characters required
                                    </p>
                                </div>
                            )}

                            {/* Quiz Options */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    Quiz Settings
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Questions
                                        </label>
                                        <select className="bg-gray-50 text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                            <option>5 questions</option>
                                            <option>10 questions</option>
                                            <option>15 questions</option>
                                            <option>20 questions</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Difficulty Level
                                        </label>
                                        <select className="bg-gray-50 text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                            <option>Mixed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={isProcessing}
                                disabled={!isProcessing}
                                className={`w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${canGenerate && !generating
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02]'
                                    : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        Generating Your Quiz...
                                    </span>
                                ) : quizGenerated ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5" />
                                        Quiz Generated Successfully!
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Generate Smart Quiz
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default QuizHome;