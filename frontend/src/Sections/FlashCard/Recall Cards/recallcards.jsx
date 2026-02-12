import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    ArrowLeft,
    RotateCcw,
    CheckCircle,
    AlertCircle,
    Lightbulb,
    MessageSquare
} from 'lucide-react';

const FormattedText = ({ text }) => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
        <p className="text-base text-gray-800 leading-relaxed">
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);

                    const lowerContent = content.trim().replace(/:$/, '').toLowerCase();
                    if (lowerContent === 'explanation' || lowerContent === 'hint') {
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

const RecallCards = ({ onBack, extractedText, fileName }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [understood, setUnderstood] = useState([]);
    const [reviewCards, setReviewCards] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [isLoadingHint, setIsLoadingHint] = useState(false);
    const [hintText, setHintText] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanationText, setExplanationText] = useState('');
    const [currentStep, setCurrentStep] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const hasRequested = React.useRef(false);

    useEffect(() => {
        if (!hasRequested.current) {
            generateRecallCards();
            hasRequested.current = true;
        }
    }, []);

    const generateRecallCards = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/recall`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: extractedText,
                    limit: 15
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate recall cards');
            }

            setFlashcards(data);
        } catch (error) {
            console.error("Error fetching recall cards:", error);
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
                alert("Rate Limit Exceeded. OpenRouter's free tier has a limit of 20 requests per minute. Please wait about a minute and try again.");
            } else {
                alert("Failed to generate cards: " + error.message);
            }
            onBack(); // Go back to upload stage on failure
        } finally {
            setIsLoading(false);
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
        }

        if (fromReview) {
            setReviewCards(reviewCards.filter(id => id !== cardID));
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
        }
        nextCard();
    };

    const goToReviewSection = () => {
        setCurrentStep(5);
        setCurrentCardIndex(0);
        setIsFlipped(false);
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

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/recall/hint`, {
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
    };

    const requestExplanation = async () => {
        if (showExplanation) {
            setShowExplanation(false);
            return;
        }

        setIsLoadingExplanation(true);
        setShowExplanation(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/recall/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: flashcards[currentCardIndex].question,
                    answer: flashcards[currentCardIndex].answer,
                    context: extractedText
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
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 text-center">
                        <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Generating Recall Cards...
                        </h2>
                        <p className="text-base text-gray-600 mb-4">
                            Our AI is creating question-answer pairs for active recall practice
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (flashcards.length === 0) {
        return null;
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
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

            {/* Step 4: Recall Cards */}
            {currentStep === 4 && (
                <div className="max-w-3xl w-full">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={onBack}
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
                                <div className="px-10 pt-10 pb-[80px] flex flex-col items-center justify-center min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
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
                                <div className="px-10 pt-10 pb-24 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
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
                                <FormattedText text={hintText} />
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
                            style={{ width: `${flashcards.length > 0 ? ((currentCardIndex + 1) / flashcards.length) * 100 : 0}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                        <span>{understood.length} understood</span>
                        <span>{reviewCards.length} to review</span>
                    </div>
                </div>
            )}

            {/* Step 5: Review Section */}
            {currentStep === 5 && (
                <div className="max-w-4xl w-full">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setCurrentStep(4)}
                            className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Cards for Review</h1>
                        <div className="w-10"></div>
                    </div>

                    {reviewCards.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 shadow-sm animate-fadeIn">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">You're all caught up!</h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto px-4">
                                You've reviewed all your flagged cards. Great job reinforcing your memory with active recall!
                            </p>
                            <button
                                onClick={() => setCurrentStep(4)}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition active:scale-95"
                            >
                                <ArrowLeft size={20} />
                                Back to Study
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviewCards.map(cardId => {
                                const card = getReviewCardData(cardId);
                                if (!card) return null;
                                return (
                                    <div key={cardId} className="bg-white border-2 border-yellow-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="mb-4">
                                            <div className="text-xs font-bold text-yellow-600 uppercase mb-1">Question</div>
                                            <div className="text-lg font-bold text-gray-900 leading-snug">
                                                {card.question}
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <div className="text-xs font-bold text-green-600 uppercase mb-1">Answer</div>
                                            <div className="text-gray-700 leading-relaxed">
                                                {card.answer}
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
            )}
        </div>
    );
};

export default RecallCards;
