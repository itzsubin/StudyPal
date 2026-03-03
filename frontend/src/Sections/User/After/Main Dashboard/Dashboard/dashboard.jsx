import React from "react";
import Header from "./Header/header";
import ProfileCard from "./ProfileCard/profilecard";
import ProgressCards from "./ProgressCard/progresscard";
import SavedNotes from "./SavedNotes/savednotes";
import TrackersConnected from "./Trackers/trackers";
import DevelopedAreas from "./Stats/stats";
import { FocusingChart } from "../Graph/graph";
import ApiStatus from "../API/api";

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
                                <TrackersConnected />
                            </div>
                        </div>
                        <FocusingChart />
                        <ApiStatus />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <SavedNotes />
                        <DevelopedAreas />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;   