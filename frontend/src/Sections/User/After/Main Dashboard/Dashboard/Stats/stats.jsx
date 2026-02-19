import { BookOpen, CheckCircle, Clock, Flame } from 'lucide-react';

const stats = [
    {
        name: 'Notes Saved',
        value: '156',
        change: '+12 this week',
        icon: BookOpen,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        name: 'Quizzes Completed',
        value: '48',
        change: '+5 this week',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-600'
    },
    {
        name: 'Focus Time',
        value: '24h 30m',
        change: '+3h this week',
        icon: Clock,
        color: 'bg-purple-100 text-purple-600'
    },
    {
        name: 'Streak',
        value: '15 days',
        change: 'Keep it up!',
        icon: Flame,
        color: 'bg-orange-100 text-orange-600'
    },
];

export default function DevelopedAreas() {
    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Study Stats</h2>
                <p className="text-xs text-gray-500">Your learning progress</p>
            </div>

            <div className="space-y-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-600 mb-0.5">{stat.name}</div>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{stat.change}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}