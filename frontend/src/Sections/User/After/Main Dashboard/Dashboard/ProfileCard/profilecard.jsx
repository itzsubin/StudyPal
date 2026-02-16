import React from "react";

export default function ProfileCard() {
    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900">
                    Profile
                </h2>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-red-400 ring-offset-4">
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Subin Ghimire
                </h3>
            </div>
            <div className="flex justify-center">
                <p className="text-sm text-gray-500 mb-6">
                    subinghimire51@gmail.com
                </p>
            </div>
        </div>
    );
}