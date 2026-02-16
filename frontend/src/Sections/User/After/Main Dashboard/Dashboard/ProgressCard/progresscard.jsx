export default function ProgressCards() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-200 via-orange-200 to-red-400 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-medium text-gray-900">Quizzes<br />completed</h3>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-1">87%</div>
                <p className="text-xs text-gray-800">Avg. Score</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-200 via-blue-300 to-blue-500 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-medium text-gray-900">Recall<br />cards</h3>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-1">64%</div>
                <p className="text-xs text-gray-800">Mastered</p>
            </div>
        </div>
    );
}