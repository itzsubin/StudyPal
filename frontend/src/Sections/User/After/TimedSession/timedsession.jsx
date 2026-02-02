import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    Clock,
    CheckCircle,
    Coffee,
    Zap
} from 'lucide-react';

const TimedSession = () => {
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
    const [isRunning, setIsRunning] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const intervalRef = useRef(null);

    const presetDurations = [
        { label: '15 min', value: 15, icon: Coffee, description: 'Quick review' },
        { label: '25 min', value: 25, icon: Clock, description: 'Pomodoro' },
        { label: '45 min', value: 45, icon: Zap, description: 'Deep focus' },
    ];

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setSessionComplete(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
        setSessionComplete(false);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(duration * 60);
        setSessionComplete(false);
    };

    const handleDurationChange = (newDuration) => {
        if (!isRunning) {
            setDuration(newDuration);
            setTimeLeft(newDuration * 60);
            setSessionComplete(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Time-based Session</h1>
                <p className="text-gray-500 mt-1">Focus on your studies with timed sessions</p>
            </div>

            {/* Timer Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-100">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-8 md:p-12">
                    {/* Timer Display */}
                    <div className="text-center mb-8">
                        {sessionComplete ? (
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Session Complete! 🎉</h2>
                                <p className="text-gray-500">Great job staying focused!</p>
                            </div>
                        ) : (
                            <div
                                className={`text-7xl md:text-8xl font-mono font-bold tracking-tight ${isRunning ? 'text-blue-600' : 'text-gray-900'
                                    }`}
                            >
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {!sessionComplete && (
                            <>
                                <button
                                    onClick={isRunning ? handlePause : handleStart}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isRunning
                                            ? 'bg-orange-500 hover:bg-orange-600'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                        }`}
                                >
                                    {isRunning ? (
                                        <Pause className="w-7 h-7" />
                                    ) : (
                                        <Play className="w-7 h-7 ml-1" />
                                    )}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                                >
                                    <RotateCcw className="w-5 h-5 text-gray-600" />
                                </button>
                            </>
                        )}
                        {sessionComplete && (
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                Start New Session
                            </button>
                        )}
                    </div>

                    {/* Duration Presets */}
                    {!isRunning && !sessionComplete && (
                        <div>
                            <p className="text-sm text-gray-500 text-center mb-4">Select duration</p>
                            <div className="grid grid-cols-3 gap-3">
                                {presetDurations.map((preset) => {
                                    const Icon = preset.icon;
                                    const isSelected = duration === preset.value;
                                    return (
                                        <button
                                            key={preset.value}
                                            onClick={() => handleDurationChange(preset.value)}
                                            className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <p className={`font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {preset.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Study Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Close distracting apps and tabs during your session</li>
                    <li>• Take a 5-minute break after each session</li>
                    <li>• Stay hydrated and keep snacks nearby</li>
                </ul>
            </div>

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default TimedSession;
