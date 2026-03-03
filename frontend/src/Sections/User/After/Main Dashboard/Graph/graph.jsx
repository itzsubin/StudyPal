import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
    { name: 'Aug', focus: 30, lackOfFocus: 70 },
    { name: 'Sep', focus: 90, lackOfFocus: 40 },
    { name: 'Week 8', focus: 75, lackOfFocus: 50 },
    { name: 'Oct', focus: 50, lackOfFocus: 80 },
    { name: 'Nov', focus: 20, lackOfFocus: 60 },
];

export function FocusingChart() {
    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">Study time</h2>
                    <p className="text-xs text-gray-500">Learning productivity analytics</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900 mb-1">5.2h</div>
                    <p className="text-xs text-gray-500">Avg. Daily</p>
                </div>
            </div>

            <div className="relative" style={{ height: '340px' }}>
                <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Line
                            type="monotone"
                            dataKey="focus"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="lackOfFocus"
                            stroke="#818CF8"
                            strokeWidth={2}
                            dot={(dotProps) => {
                                const { cx, cy, payload, index } = dotProps;
                                if (payload.name === 'Week 8') {
                                    return (
                                        <g key={`custom-dot-${index}`}>
                                            <circle cx={cx} cy={cy} r={6} fill="#818CF8" stroke="white" strokeWidth={2} />
                                            <text
                                                x={cx}
                                                y={cy - 20}
                                                textAnchor="middle"
                                                fill="#1F2937"
                                                fontSize={12}
                                                fontWeight={600}
                                            >
                                                Week 8
                                            </text>
                                            <text
                                                x={cx}
                                                y={cy - 8}
                                                textAnchor="middle"
                                                fill="#6B7280"
                                                fontSize={10}
                                            >
                                                Low focus
                                            </text>
                                        </g>
                                    );
                                }
                                return null;
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600">Peak study hours</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-400 rounded"></div>
                    <span className="text-gray-600">Distracted periods</span>
                </div>
            </div>
        </div>
    );
}