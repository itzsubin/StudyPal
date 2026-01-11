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

                    const lowerContent = content.trim().replace(/:$/, '').toLowerCase();
                    if (lowerContent === 'explanation' || lowerContent === 'hint') {
                        return <strong key={index} className="font-bold text-gray-900">{content}</strong>;
                    }

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
    const hasRequested = React.useRef(false);

    useEffect(() => {
        if (!hasRequested.current) {
            generateSmartNotes();
            hasRequested.current = true;
        }
    }, []);

    const generateSmartNotes = async () => {
        setIsProcessing(true);

        try {
            // Simulated delay for UI/UX testing
            await new Promise(resolve => setTimeout(resolve, 800));

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
                            text: "Why Preprocess?"
                        },
                        {
                            type: "paragraph",
                            text: "Real-world data is often incomplete, inconsistent, and noisy. **Preprocessing** is vital for model accuracy."
                        },
                        {
                            type: "heading",
                            text: "Common Techniques"
                        },
                        {
                            type: "bullet",
                            text: "**Handling Missing Values**: Imputation (mean/median) or removing rows"
                        },
                        {
                            type: "bullet",
                            text: "**Feature Scaling**: Normalization or standardization"
                        },
                        {
                            type: "bullet",
                            text: "**Encoding Categorical Data**: One-hot encoding or label encoding"
                        },
                        {
                            type: "paragraph",
                            text: "⚠️ Never normalize using statistics from the entire dataset - this causes **data leakage**. Always fit on training data only!"
                        }
                    ]
                }
            ]);
        } catch (error) {
            console.error("Error generating notes:", error);
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
                alert("Rate Limit Exceeded. OpenRouter's free tier has a limit of 20 requests per minute. Please wait about a minute and try again.");
            } else {
                alert("Failed to generate smart notes: " + error.message);
            }
            onBack();
        } finally {
            setIsProcessing(false);
        }
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

    const toggleReviewLater = () => {
        const currentNoteId = notes[currentNoteIndex].id;
        if (reviewLater.includes(currentNoteId)) {
            setReviewLater(reviewLater.filter(id => id !== currentNoteId));
        } else {
            setReviewLater([...reviewLater, currentNoteId]);
        }
    };

    const requestExplanation = async () => {
        if (showExplanation) {
            setShowExplanation(false);
            return;
        }

        setIsLoadingExplanation(true);
        setShowExplanation(true);

        // Simulating API call
        setTimeout(() => {
            setExplanationText("This is an **AI-generated explanation** for the current topic. It provides deeper context and clarifies complex terms used in the summary.");
            setIsLoadingExplanation(false);
        }, 800);
    };

    const handleEditTitle = () => {
        setEditedTitle(notes[currentNoteIndex].title);
        setIsEditingTitle(true);
    };

    const handleSaveTitle = () => {
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex].title = editedTitle;
        setNotes(updatedNotes);
        setIsEditingTitle(false);
    };

    const handleEditContent = () => {
        setEditedContent(JSON.parse(JSON.stringify(notes[currentNoteIndex].content)));
        setIsEditingContent(true);
    };

    const handleSaveContent = () => {
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex].content = editedContent;
        setNotes(updatedNotes);
        setIsEditingContent(false);
    };

    const handleContentChange = (index, value) => {
        const newContent = [...editedContent];
        newContent[index].text = value;
        setEditedContent(newContent);
    };

    if (isProcessing) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
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
            </div>
        );
    }

    if (notes.length === 0) {
        return null;
    }

    if (showReviewSection) {
        const reviewedNotes = notes.filter(n => reviewLater.includes(n.id));
        return (
            <div className="max-w-4xl w-full mx-auto p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setShowReviewSection(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Flag className="w-6 h-6 text-orange-500" />
                        Flagged for Review ({reviewedNotes.length})
                    </h1>
                    <div className="w-10" />
                </div>

                {reviewedNotes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 shadow-sm animate-fadeIn max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">All caught up!</h2>
                        <p className="text-lg text-gray-600 mb-8 px-4">
                            You've reviewed all your flagged notes. Your knowledge is now more secure than ever!
                        </p>
                        <button
                            onClick={() => setShowReviewSection(false)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition active:scale-95"
                        >
                            <ArrowLeft size={20} />
                            Back to Study
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviewedNotes.map(note => (
                            <div key={note.id} className="bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{note.title}</h3>
                                <div className="space-y-3">
                                    {note.content.map((item, idx) => (
                                        <div key={idx} className={item.type === 'heading' ? 'font-bold text-gray-800 mt-4' : 'text-gray-600'}>
                                            {item.type === 'bullet' && '• '}
                                            <FormattedText text={item.text} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const currentNote = notes[currentNoteIndex];
    if (!currentNote) return null;

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] p-8">
            <div className="max-w-4xl w-full">
                {/* Header Controls */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-600 transition shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex gap-3">
                        <div className="bg-green-50 border-2 border-green-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                            <span className="font-bold text-green-900 flex items-center gap-2">
                                Smart Notes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] border-2 border-gray-100 shadow-2xl overflow-hidden min-h-[500px] flex flex-col transition-all duration-300 hover:border-green-100">
                    {/* Note Header */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 px-8 py-6 border-b-2 border-gray-100 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-100 px-2 py-1 rounded">
                                    TOPIC SUMMARY
                                </span>
                                <span className="text-xs font-bold text-gray-400">
                                    {currentNoteIndex + 1} OF {notes.length}
                                </span>
                            </div>
                            {isEditingTitle ? (
                                <div className="flex gap-2">
                                    <input
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="text-2xl font-bold text-gray-900 bg-white border-2 border-green-200 rounded-lg px-3 py-1 w-full focus:outline-none focus:border-green-500"
                                    />
                                    <button onClick={handleSaveTitle} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        <Save size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-left">
                                        {currentNote.title}
                                    </h2>
                                    <button onClick={handleEditTitle} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                        <Edit3 size={18} />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {currentNote.topics.map((topic, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 text-teal-800 text-xs font-bold border border-teal-200 uppercase tracking-wide">
                                            <Tag size={12} />
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {!isEditingContent && (
                            <button
                                onClick={handleEditContent}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600 bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-green-200 transition shadow-sm ml-4 whitespace-nowrap"
                            >
                                <Edit3 size={16} />
                                Edit Notes
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex-1 relative min-h-[350px]">
                        {isEditingContent ? (
                            <div className="space-y-4">
                                {editedContent.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="flex-1">
                                            <textarea
                                                value={item.text}
                                                onChange={(e) => handleContentChange(idx, e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 transition-all focus:outline-none bg-white
                                                    ${item.type === 'heading' ? 'font-bold text-gray-800 text-lg !bg-gray-50 ' : 'text-gray-600'}
                                                    ${item.type === 'heading' ? 'border-gray-200 focus:border-green-300' : 'border-gray-100 focus:border-green-200'}
                                                `}
                                                rows={item.type === 'paragraph' ? 3 : 1}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-3 justify-end pt-4">
                                    <button onClick={() => setIsEditingContent(false)} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button onClick={handleSaveContent} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg flex items-center gap-2">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 max-w-none text-left prose prose-green prose-lg pb-20">
                                <div className="flex justify-end -py-[1] ">
                                    <button
                                        onClick={toggleReviewLater}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm
                                        ${reviewLater.includes(currentNote.id)
                                                ? 'bg-orange-500 text-white border border-orange-400'
                                                : 'bg-white/40 text-teal-900 border border-white/60 hover:bg-white/60 hover:border-red-600'
                                            }`}
                                        title="Flag for review."
                                    >
                                        <Flag size={14} className={reviewLater.includes(currentNote.id) ? "fill-white" : ""} />
                                        {reviewLater.includes(currentNote.id) ? "FLAGGED" : "FLAG FOR REVIEW"}
                                    </button>
                                </div>
                                {/* Dynamic Content Items */}
                                <div className="space-y-6">
                                    {currentNote.content.map((item, idx) => {
                                        if (item.type === 'heading') {
                                            return <h4 key={idx} className="text-xl font-bold text-gray-800 border-l-4 border-green-500 pl-4 py-1">{item.text}</h4>;
                                        }
                                        if (item.type === 'paragraph') {
                                            return (
                                                <div key={idx} className="text-lg text-gray-600 leading-relaxed text-left pl-5">
                                                    <FormattedText text={item.text} />
                                                </div>
                                            );
                                        }
                                        if (item.type === 'bullet') {
                                            return (
                                                <div key={idx} className="flex items-start gap-3 pl-5">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0" />
                                                    <div className="text-lg text-gray-600 leading-relaxed text-left">
                                                        <FormattedText text={item.text} />
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}

                        {/* AI Action Button */}
                        {!isEditingContent && (
                            <div className="absolute right-8 bottom-10 flex flex-col items-end gap-3">
                                <button
                                    onClick={requestExplanation}
                                    className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-green-700 hover:scale-110 active:scale-95 border-4 border-green-500/20"
                                    title="Explain this note"
                                >
                                    <Lightbulb size={24} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* AI Explanation */}
                    {showExplanation && (
                        <div className="bg-green-50 border-t-2 border-green-100 p-8 animate-slideDown text-left">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <MessageSquare className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-green-900 mb-2">Deep Dive Explanation</h4>
                                    {isLoadingExplanation ? (
                                        <div className="flex items-center gap-2 py-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    ) : (
                                        <div className="text-green-800 text-lg leading-relaxed">
                                            <FormattedText text={explanationText} />
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setShowExplanation(false)} className="text-green-400 hover:text-green-600">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex items-center justify-between">
                    <div className="flex gap-4 flex-1">
                        <button
                            onClick={prevNote}
                            disabled={currentNoteIndex === 0}
                            className="bg-white border-2 border-gray-300 px-8 py-3 rounded-xl font-bold text-gray-700 flex items-center gap-2 hover:border-green-600 hover:text-green-600 transition shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft size={20} />
                            Prev Topic
                        </button>
                        <button
                            onClick={nextNote}
                            disabled={currentNoteIndex === notes.length - 1}
                            className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-lg hover:scale-105 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            Next Topic
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-400 uppercase">Progress</span>
                            <span className="text-sm font-bold text-gray-700">{Math.round(((currentNoteIndex + 1) / notes.length) * 100)}%</span>
                        </div>
                        <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500 ease-out"
                                style={{ width: `${((currentNoteIndex + 1) / notes.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>
        </div>
    );
};

export default SmartNote;
