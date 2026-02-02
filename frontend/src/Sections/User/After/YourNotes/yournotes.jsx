import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Tag,
    Calendar,
    Trash2,
    Eye,
    Loader2,
    FolderOpen
} from 'lucide-react';

const YourNotes = () => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8787/notes');
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`http://localhost:8787/notes/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setNotes(notes.filter(note => note.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Notes</h1>
                    <p className="text-gray-500 mt-1">{notes.length} notes saved</p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery ? 'No notes found' : 'No notes yet'}
                    </h3>
                    <p className="text-gray-500">
                        {searchQuery
                            ? 'Try a different search term'
                            : 'Generate some Smart Notes and save them to see them here!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all group"
                        >
                            {/* Note Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="View note"
                                    >
                                        <Eye className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete note"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {note.title}
                            </h3>

                            {/* Tags */}
                            {note.tags && Array.isArray(note.tags) && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {note.tags.slice(0, 3).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tag === 'Flagged'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-blue-50 text-blue-700'
                                                }`}
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Date */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDate(note.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default YourNotes;
