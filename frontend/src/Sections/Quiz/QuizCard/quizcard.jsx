import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCcw, ChevronLeft } from 'lucide-react';
import styles from './quizcard.module.css';

export default function QuizCard({ text, numQuestions, difficulty, onBack, onReset }) {
    const [quiz, setQuiz] = useState(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const generateQuiz = async () => {
            setIsGenerating(true);
            try {
                // Determine effective question count (default to 5 if missing)
                const count = numQuestions || 5;
                const diff = difficulty || 'medium';

                console.log("Generating Quiz with:", { count, diff, textLength: text.length });

                /* 
                // COMPLETED: Real Backend Integration
                const response = await fetch('http://localhost:8787/quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        text, 
                        numQuestions: parseInt(count), 
                        difficulty: diff 
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate quiz');
                }

                const quizData = await response.json();
                setQuiz(quizData);
                setIsGenerating(false);
                */

                // --- MOCK API CALL (Active for Testing) ---
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

                const mockQuizData = {
                    title: `Generated Quiz (${diff})`,
                    questions: Array.from({ length: parseInt(count) }, (_, i) => ({
                        id: i + 1,
                        question: `Generated Question ${i + 1} based on text?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: "Option A"
                    }))
                };

                setQuiz(mockQuizData);
                setIsGenerating(false);

            } catch (err) {
                console.error("Quiz generation failed:", err);
                setError(err.message || "Failed to generate quiz. Please try again.");
                setIsGenerating(false);
            }
        };

        if (text) {
            generateQuiz();
        } else {
            // Fallback for dev testing without props
            // setIsGenerating(false);
            // setQuiz({ ...default mock ... })
            generateQuiz();
        }
    }, [text, numQuestions, difficulty]);

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        const newAnswers = {
            ...selectedAnswers,
            [questionIndex]: answerIndex
        };
        setSelectedAnswers(newAnswers);

        // Update progress based on unique answered questions
        const uniqueAnswered = Object.keys(newAnswers).length;
        setAnsweredCount(uniqueAnswered);
        const newProgress = (uniqueAnswered / quiz.questions.length) * 100;
        setProgress(newProgress);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        } else {
            setShowResults(true);
        }
    };
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(curr => curr - 1);
        }
    };

    const calculateScore = () => {
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            // Note: In the mock data, correctAnswer is "Option A", but we need the index.
            // Assuming the mock data structure: options: [...], correctAnswer: "Option A"
            // We need to match the string value of the selected option to the correct answer string.
            // OR checks generic index if we change the mock data schema.
            // Based on mock data: correctAnswer is value string.
            const selectedOptIndex = selectedAnswers[idx];
            if (selectedOptIndex !== undefined) {
                const selectedOptValue = q.options[selectedOptIndex];
                if (selectedOptValue === q.correctAnswer) {
                    score++;
                }
            }
        });
        return score;
    };

    const restartQuiz = () => {
        setShowResults(false);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setAnsweredCount(0);
        setProgress(0);
        // Optionally re-generate:
        // setIsGenerating(true); 
        // generateQuiz();
    };
    const restartQuizdifferentupload = () => {
        // Reset local state (optional, but good for cleanup)
        setShowResults(false);
        setQuiz(null);

        // Navigate back to upload screen with full reset
        if (onReset) onReset();
    }


    if (isGenerating) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 text-center">
                    <div className="w-20 h-20 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Generating your unique quiz...
                    </h2>
                    <p className="text-base text-gray-600 mb-4">
                        Our AI is crafting questions based on your specific difficulty settings
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center max-w-md">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Error</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Try Again</button>
                </div>
            </div>
        );
    }

    if (!quiz) return null;

    const question = quiz.questions[currentQuestion];

    if (showResults) {
        const score = calculateScore();
        const percentage = (score / quiz.questions.length) * 100;

        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                                }`}>
                                <span className={`text-4xl font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                            <p className="text-gray-600 text-lg">
                                You got {score} out of {quiz.questions.length} questions correct
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {quiz.questions.map((q, idx) => {
                                const selectedIdx = selectedAnswers[idx];
                                const isCorrect = q.options[selectedIdx] === q.correctAnswer;
                                const wasAnswered = selectedIdx !== undefined;

                                return (
                                    <div key={q.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100' : wasAnswered ? 'bg-red-100' : 'bg-gray-200'
                                                }`}>
                                                {isCorrect ? (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                ) : wasAnswered ? (
                                                    <X className="w-5 h-5 text-red-600" />
                                                ) : (
                                                    <span className="text-gray-500 text-sm">-</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 mb-3">
                                                    {idx + 1}. {q.question}
                                                </h4>
                                                <div className="space-y-2">
                                                    {q.options.map((opt, optIdx) => {
                                                        const isSelected = selectedIdx === optIdx;
                                                        const isCorrectAnswer = opt === q.correctAnswer;

                                                        return (
                                                            <div
                                                                key={optIdx}
                                                                className={`px-4 py-2 rounded-lg text-sm ${isCorrectAnswer
                                                                    ? 'bg-green-100 border-2 border-green-500 text-green-800 font-medium'
                                                                    : isSelected
                                                                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                                                                        : 'bg-white border border-gray-300 text-gray-600'
                                                                    }`}
                                                            >
                                                                {opt}
                                                                {isCorrectAnswer && (
                                                                    <span className="ml-2 text-xs">(Correct)</span>
                                                                )}
                                                                {isSelected && !isCorrectAnswer && (
                                                                    <span className="ml-2 text-xs">(Your answer)</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4 justify-between">
                            <button
                                onClick={restartQuiz}
                                className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Create New Quiz
                            </button>
                            <button
                                onClick={restartQuizdifferentupload}
                                className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Create New Quiz with different upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                                title="Back to content upload"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-left text-xl font-bold text-gray-800">{quiz.title}</h2>
                                <p className="text-left text-sm text-gray-500">
                                    Question {currentQuestion + 1} of {quiz.questions.length}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Progress</p>
                            <p className="text-2xl font-bold text-indigo-600">{answeredCount}/{quiz.questions.length}</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-6 transition-all duration-300">
                    <div className="mb-8">
                        <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm mb-4">
                            Question {currentQuestion + 1}
                        </div>
                        <h3 className="text-left text-2xl font-bold text-gray-800 leading-relaxed">
                            {question.question}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isSelected = selectedAnswers[currentQuestion] === index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-gray-700 ${isSelected
                                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                                        : "border-gray-100 hover:border-indigo-500 hover:bg-indigo-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                                            ? 'border-indigo-500 bg-indigo-500'
                                            : 'border-gray-300'
                                            }`}>
                                            {isSelected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'
                                            }`}>
                                            {option}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${currentQuestion === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous Question
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${selectedAnswers[currentQuestion] !== undefined
                            ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>

        </div>
    );
}