import React from "react";
import Header from "./Header/header";
import ProfileCard from "./ProfileCard/profilecard";
import ProgressCards from "./ProgressCard/progresscard";

const Dashboard = () => {
    return (
        <div className="min-h-screen p-6">
            <div className="w-full">
                <Header />
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="col-span-2 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <ProfileCard />
                            <div className="col-span-2 space-y-4">
                                <ProgressCards />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;