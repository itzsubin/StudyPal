import { FileText, ExternalLink, ChevronRight } from "lucide-react";
const notes = [
    {
        date: 'Mon, 10 Feb',
        subject: 'Data Structures',
        title: 'Binary Trees & Traversal',
        pages: 8,
        starred: true,
        color: 'blue'
    },
    {
        date: 'Tue, 11 Feb',
        subject: 'Algorithms',
        title: 'Dynamic Programming',
        pages: 12,
        starred: false,
        color: 'purple'
    },
    {
        date: 'Wed, 12 Feb',
        subject: 'Web Dev',
        title: 'React Hooks Deep Dive',
        pages: 6,
        starred: true,
        color: 'cyan'
    },
    {
        date: 'Thu, 13 Feb',
        subject: 'Database',
        title: 'SQL Joins & Optimization',
        pages: 10,
        starred: false,
        color: 'green'
    }
];

export default function SavedNotes() {
    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-md font-bold text-gray-900">Saved Notes</h4>
                <FileText className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
                {notes.map((note, index) => (
                    <div key={index} className="flex items-start justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-lg">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{note.date}</div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">{note.title}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-900">{note.subject}</span>
                                <span className="text-xs text-gray-500">• {note.pages} cards</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded">
                                <ExternalLink className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 mt-4 group">
                See all notes
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>

    );
}
