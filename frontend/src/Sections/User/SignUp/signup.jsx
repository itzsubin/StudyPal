import React from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function SignUp({ formData, handleChange, handleSubmit }) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="space-y-5">
            {/* Name Field */}
            <div className="transform transition-all duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 text-black placeholder-gray-400 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Email Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="appearance-none w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 text-black placeholder-gray-400 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 text-black placeholder-gray-400 transition-all font-medium"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
                <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 cursor-pointer appearance-none bg-white border border-gray-300 rounded checked:bg-blue-600 checked:border-transparent focus:ring-2 focus:ring-blue-500 shrink-0 relative flex items-center justify-center checked:before:content-['✓'] checked:before:text-white checked:before:text-xs checked:before:font-bold checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:items-center checked:before:justify-center"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#terms" className="text-blue-600 hover:text-purple-600 font-medium">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="text-blue-600 hover:text-purple-600 font-medium">
                        Privacy Policy
                    </a>
                </label>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
