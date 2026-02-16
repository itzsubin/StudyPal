import { User, Calendar } from "lucide-react";

export default function Header() {
    return (
        <div className="flex pt-24 justify-start w-full mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Welcome, Subin</h1>
                    <p className="text-sm text-gray-500">Your Personal AI Study Dashboard</p>
                </div>
            </div>
        </div>
    )
}