import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    BookOpen,
    Brain,
    Lightbulb,
    MessageSquare,
    Edit3,
    Save,
    X,
    Flag,
    Tag
} from 'lucide-react';

const FormattedText = ({ text }) => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
        <span className="text-base text-gray-800 leading-relaxed">
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return (
                        <span key={index} className="font-semibold bg-yellow-200 text-gray-900 px-1 rounded mx-0.5">
                            {content}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

const SmartNote = ({ onBack, extractedText, fileName }) => {
    const [notes, setNotes] = useState([]);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [reviewLater, setReviewLater] = useState([]);
    const [isProcessing, setIsProcessing] = useState(true);
    const [showReviewSection, setShowReviewSection] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [explanationText, setExplanationText] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [editedContent, setEditedContent] = useState([]);

    useEffect(() => {
        generateSmartNotes();
    }, []);

    const generateSmartNotes = async () => {
        setIsProcessing(true);

        setTimeout(() => {
            setNotes([
                {
                    id: 1,
                    title: "Neural Networks Fundamentals",
                    topics: ["Neural Networks", "Deep Learning", "AI Architecture"],
                    content: [
                        {
                            type: "heading",
                            text: "What are Neural Networks?"
                        },
                        {
                            type: "paragraph",
                            text: "Neural networks are **computational models** inspired by the human brain's structure and function."
                        },
                        {
                            type: "heading",
                            text: "Core Components"
                        },
                        {
                            type: "bullet",
                            text: "**Neurons (Nodes)**: Basic processing units that receive inputs and produce outputs"
                        },
                        {
                            type: "bullet",
                            text: "**Layers**: Input layer, hidden layers, and output layer work together"
                        },
                        {
                            type: "bullet",
                            text: "**Weights & Biases**: Parameters that adjust during training to improve accuracy"
                        },
                        {
                            type: "heading",
                            text: "Common Types"
                        },
                        {
                            type: "bullet",
                            text: "**CNNs (Convolutional Neural Networks)**: Best for image recognition"
                        },
                        {
                            type: "bullet",
                            text: "**RNNs (Recurrent Neural Networks)**: Handle sequential data like text"
                        },
                        {
                            type: "bullet",
                            text: "**Transformers**: Modern architecture powering ChatGPT and similar models"
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Gradient Descent Algorithm",
                    topics: ["Optimization", "Machine Learning", "Training Process"],
                    content: [
                        {
                            type: "heading",
                            text: "Purpose"
                        },
                        {
                            type: "paragraph",
                            text: "Gradient descent is an **optimization algorithm** used to minimize the loss function and find optimal model parameters."
                        },
                        {
                            type: "heading",
                            text: "The Formula"
                        },
                        {
                            type: "paragraph",
                            text: "**θ = θ - α∇J(θ)**"
                        },
                        {
                            type: "bullet",
                            text: "**θ (theta)**: Model parameters being optimized"
                        },
                        {
                            type: "bullet",
                            text: "**α (alpha)**: Learning rate - controls step size"
                        },
                        {
                            type: "bullet",
                            text: "**∇J(θ)**: Gradient of the loss function"
                        },
                        {
                            type: "heading",
                            text: "Key Insight"
                        },
                        {
                            type: "paragraph",
                            text: "The algorithm moves in the direction of steepest descent, gradually converging to the minimum loss."
                        }
                    ]
                },
                {
                    id: 3,
                    title: "Data Preprocessing Best Practices",
                    topics: ["Data Science", "Preprocessing", "Model Performance"],
                    content: [
                        {
                            type: "heading",
                            text: "Why Preprocessing Matters"
                        },
                        {
                            type: "paragraph",
                            text: "**Clean data = Better models**. Poor preprocessing is the #1 reason models fail in production."
                        },
                        {
                            type: "heading",
                            text: "Essential Steps"
                        },
                        {
                            type: "bullet",
                            text: "**Normalization/Standardization**: Scale features to similar ranges (0-1 or mean=0, std=1)"
                        },
                        {
                            type: "bullet",
                            text: "**Handle Missing Values**: Use imputation (mean/median/mode) or remove rows strategically"
                        },
                        {
                            type: "bullet",
                            text: "**Train-Test Split**: Always separate data (typically 80/20 or 70/30)"
                        },
                        {
                            type: "bullet",
                            text: "**Data Augmentation**: Create variations when dataset is small (rotation, flipping for images)"
                        },
                        {
                            type: "heading",
                            text: "Common Mistake"
                        },
                        {
                            type: "paragraph",
                            text: "⚠️ Never normalize using statistics from the entire dataset - this causes **data leakage**. Always fit on training data only!"
                        }
                    ]
                }
            ]);
            setIsProcessing(false);
        }, 1500);
    };

    const nextNote = () => {
        if (currentNoteIndex < notes.length - 1) {
            setCurrentNoteIndex(currentNoteIndex + 1);
            setShowExplanation(false);
            setExplanationText('');
            setIsEditingTitle(false);
            setIsEditingContent(false);
        }
    };

    const prevNote = () => {
        if (currentNoteIndex > 0) {
            setCurrentNoteIndex(currentNoteIndex - 1);
            setShowExplanation(false);
            setExplanationText('');
            setIsEditingTitle(false);
            setIsEditingContent(false);
        }
    };

    const toggleReviewLater = (noteId) => {
        if (reviewLater.includes(noteId)) {
            setReviewLater(reviewLater.filter(id => id !== noteId));
        } else {
            setReviewLater([...reviewLater, noteId]);
        }
    };

    const removeFromReview = (noteId) => {
        setReviewLater(reviewLater.filter(id => id !== noteId));
    };

    const requestExplanation = async () => {
        if (showExplanation) {
            setShowExplanation(false);
            return;
        }

        setIsLoadingExplanation(true);
        setShowExplanation(true);

        setTimeout(() => {
            setExplanationText("**Extended Context:** This concept builds on fundamental principles you've already learned. The key is to understand how each component interacts with others in the system. **Real-World Application:** In practice, this is used daily by data scientists and ML engineers to improve model performance. Companies like Google, Netflix, and Tesla rely on these principles. **Study Tip:** Try explaining this concept to someone else - teaching is one of the best ways to solidify your understanding.");
            setIsLoadingExplanation(false);
        }, 800);
    };

    const startEditingTitle = () => {
        setEditedTitle(notes[currentNoteIndex].title);
        setIsEditingTitle(true);
    };

    const saveTitle = () => {
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex].title = editedTitle;
        setNotes(updatedNotes);
        setIsEditingTitle(false);
    };

    const cancelTitleEdit = () => {
        setIsEditingTitle(false);
        setEditedTitle('');
    };

    const startEditingContent = () => {
        setEditedContent([...notes[currentNoteIndex].content]);
        setIsEditingContent(true);
    };

    const saveContent = () => {
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex].content = editedContent;
        setNotes(updatedNotes);
        setIsEditingContent(false);
    };

    const cancelContentEdit = () => {
        setIsEditingContent(false);
        setEditedContent([]);
    };

    const updateContentItem = (index, newText) => {
        const updated = [...editedContent];
        updated[index].text = newText;
        setEditedContent(updated);
    };

    const currentNote = notes[currentNoteIndex];
    const isInReview = currentNote ? reviewLater.includes(currentNote.id) : false;

    if (isProcessing) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 text-center">
                    <div className="w-20 h-20 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Generating Smart Notes...
                    </h2>
                    <p className="text-base text-gray-600 mb-4">
                        Our AI is condensing your content into structured study material
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (showReviewSection) {
        return (
            <div className="flex justify-center items-start min-h-[calc(100vh-5rem)] p-8">
                <div className="max-w-4xl w-full">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setShowReviewSection(false)}
                            className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-600 transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Review Later</h1>
                        <div className="w-10"></div>
                    </div>

                    {reviewLater.length === 0 ? (
                        <div className="text-center py-20">
                            <Flag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                No notes flagged yet
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Flag important notes to review them later from your dashboard
                            </p>
                            <button
                                onClick={() => setShowReviewSection(false)}
                                className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
                            >
                                Back to Notes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-lg text-gray-600 mb-6">
                                You have <span className="font-bold text-orange-700">{reviewLater.length} note(s)</span> flagged for later review.
                            </p>
                            <p className="text-sm text-blue-600 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                💡 <strong>Coming Soon:</strong> After you set up authentication, these notes will be saved to your dashboard where you can organize them by topics and create study plans!
                            </p>

                            {reviewLater.map((noteId) => {
                                const note = notes.find(n => n.id === noteId);
                                if (!note) return null;

                                return (
                                    <div key={noteId} className="bg-white border-2 border-orange-400 rounded-2xl p-8 shadow-lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Flag className="w-5 h-5 text-orange-600" />
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {note.title}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {note.topics.map((topic, idx) => (
                                                        <span key={idx} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-300">
                                                            <Tag size={14} />
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="space-y-2">
                                                    {note.content.map((item, idx) => {
                                                        if (item.type === 'heading') {
                                                            return <h4 key={idx} className="font-bold text-gray-900 mt-4 mb-2">{item.text}</h4>;
                                                        }
                                                        if (item.type === 'paragraph') {
                                                            return <p key={idx} className="text-gray-700"><FormattedText text={item.text} /></p>;
                                                        }
                                                        if (item.type === 'bullet') {
                                                            return (
                                                                <div key={idx} className="flex items-start gap-3">
                                                                    <span className="text-green-600 text-xl leading-none mt-1">•</span>
                                                                    <span className="text-gray-700 flex-1"><FormattedText text={item.text} /></span>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={() => removeFromReview(noteId)}
                                                className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-400 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                            >
                                                <X size={20} />
                                                Remove Flag
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
            <div className="max-w-4xl w-full">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-600 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 px-5 py-2 rounded-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-700" />
                        <span className="font-bold text-green-900">Smart Notes</span>
                    </div>

                    {reviewLater.length > 0 && (
                        <button
                            onClick={() => setShowReviewSection(true)}
                            className="bg-orange-100 border-2 border-orange-400 text-orange-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-orange-200 transition"
                        >
                            <Flag size={16} />
                            Review ({reviewLater.length})
                        </button>
                    )}
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 px-8 py-6">
                        <div className="flex items-center justify-between text-white mb-3">
                            <div className="flex items-center gap-3">
                                <Brain className="w-6 h-6" />
                                <span className="text-sm font-semibold opacity-90">SMART NOTE</span>
                            </div>
                            <span className="text-base font-bold">
                                {currentNoteIndex + 1} / {notes.length}
                            </span>
                        </div>

                        {isEditingTitle ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg text-xl font-bold text-gray-900 border-2 border-white focus:outline-none"
                                    autoFocus
                                />
                                <button
                                    onClick={saveTitle}
                                    className="p-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition"
                                >
                                    <Save size={20} />
                                </button>
                                <button
                                    onClick={cancelTitleEdit}
                                    className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <h2 className="text-2xl font-bold text-white text-left">
                                    {currentNote?.title}
                                </h2>
                                <button
                                    onClick={startEditingTitle}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition border border-white/30"
                                >
                                    <Edit3 size={18} className="text-white" />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                            {currentNote?.topics.map((topic, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                                    <Tag size={14} />
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-8">
                        {isEditingContent ? (
                            <div className="space-y-4">
                                {editedContent.map((item, idx) => (
                                    <div key={idx}>
                                        {item.type === 'heading' && (
                                            <input
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => updateContentItem(idx, e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-green-300 rounded-lg font-bold text-gray-900 text-left focus:border-green-500 focus:outline-none mb-2"
                                            />
                                        )}
                                        {item.type === 'paragraph' && (
                                            <textarea
                                                value={item.text}
                                                onChange={(e) => updateContentItem(idx, e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-gray-700 text-left focus:border-green-500 focus:outline-none resize-none"
                                                rows={2}
                                            />
                                        )}
                                        {item.type === 'bullet' && (
                                            <div className="flex items-start justify-start w-full gap-3">
                                                <span className="text-green-600 text-xl leading-none mt-2">•</span>
                                                <textarea
                                                    value={item.text}
                                                    onChange={(e) => updateContentItem(idx, e.target.value)}
                                                    className="flex-1 px-3 py-2 border-2 border-green-300 rounded-lg text-gray-700 text-left focus:border-green-500 focus:outline-none resize-none"
                                                    rows={1}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="flex gap-3 mt-6 pt-4 border-t-2 border-gray-200">
                                    <button
                                        onClick={saveContent}
                                        className="flex-1 py-3 rounded-xl font-semibold border-2 border-green-500 flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 transition"
                                    >
                                        <Save size={20} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={cancelContentEdit}
                                        className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-400 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                    >
                                        <X size={20} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {currentNote?.content.map((item, idx) => {
                                        if (item.type === 'heading') {
                                            return (
                                                <h3 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2 text-left">
                                                    {item.text}
                                                </h3>
                                            );
                                        }
                                        if (item.type === 'paragraph') {
                                            return (
                                                <p key={idx} className="text-base text-gray-700 leading-relaxed text-left">
                                                    <FormattedText text={item.text} />
                                                </p>
                                            );
                                        }
                                        if (item.type === 'bullet') {
                                            return (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-green-600 text-sm">•</span>
                                                    </div>
                                                    <span className="text-base text-gray-700 leading-relaxed flex-1 text-left">
                                                        <FormattedText text={item.text} />
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                                    <button
                                        onClick={startEditingContent}
                                        className="flex-1 py-3 rounded-xl font-semibold border-2 border-blue-300 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                    >
                                        <Edit3 size={20} />
                                        Edit Note
                                    </button>
                                    <button
                                        onClick={requestExplanation}
                                        className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${showExplanation
                                            ? 'bg-purple-100 border-2 border-purple-400 text-purple-800'
                                            : 'bg-purple-50 border-2 border-purple-300 text-purple-700 hover:bg-purple-100'
                                            }`}
                                    >
                                        <MessageSquare size={20} />
                                        {isLoadingExplanation ? 'Loading...' : showExplanation ? 'Hide Details' : 'More Details'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {showExplanation && !isEditingContent && (
                    <div className="mb-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="font-bold text-purple-900 mb-2">Extended Details</h4>
                                <FormattedText text={explanationText} />
                            </div>
                        </div>
                    </div>
                )}

                {!isEditingContent && (
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => toggleReviewLater(currentNote?.id)}
                            className={`flex-1 py-4 rounded-xl text-lg font-semibold border-2 flex items-center justify-center gap-2 transition ${isInReview
                                ? 'border-orange-500 bg-orange-100 text-orange-700 hover:bg-orange-200'
                                : 'border-orange-400 bg-orange-50 text-orange-600 hover:bg-orange-100'
                                }`}
                        >
                            <Flag size={20} className={isInReview ? 'fill-current' : ''} />
                            {isInReview ? 'Flagged for Review' : 'Flag for Later'}
                        </button>
                    </div>
                )}

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={prevNote}
                        disabled={currentNoteIndex === 0}
                        className="flex-1 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-2 hover:border-green-600 hover:text-green-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={20} />
                        Previous
                    </button>
                    <button
                        onClick={nextNote}
                        disabled={currentNoteIndex === notes.length - 1}
                        className="flex-1 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 flex items-center justify-center gap-2 hover:border-green-600 hover:text-green-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 transition-all duration-300"
                        style={{ width: `${((currentNoteIndex + 1) / notes.length) * 100}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>{reviewLater.length} flagged for review</span>
                    <span>{notes.length - reviewLater.length} remaining</span>
                </div>
            </div>

            <style>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
        </div >
    );
};

export default SmartNote;
