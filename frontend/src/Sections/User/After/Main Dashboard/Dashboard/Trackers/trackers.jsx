import { MoreHorizontal } from 'lucide-react';

export default function TrackersConnected() {
    return (
        <div className="bg-white rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Study tools connected</h3>
            <p className="text-xs text-gray-500 mb-4">3 active integrations</p>

            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M5 3h10l3 3v11H2V6l3-3z" fill="#4285F4" />
                        <path d="M5 3v3h10V3" fill="#A4C2F4" />
                    </svg>
                </div>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <rect x="3" y="3" width="14" height="14" fill="#0ACF83" rx="3" />
                        <path d="M7 10h6M10 7v6" stroke="white" strokeWidth="2" />
                    </svg>
                </div>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="7" fill="#FF6B6B" />
                        <text x="10" y="13" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Q</text>
                    </svg>
                </div>
                <button className="w-8 h-8 hover:bg-white rounded-lg flex items-center justify-center">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}