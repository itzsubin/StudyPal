import React, { useState } from 'react';
import DashboardLayout from './Layout';
import Dashboard from './Dashboard';
import YourNotes from './YourNotes';
import TimedSession from './TimedSession';

const AfterLogin = ({ onSignOut, userName }) => {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleSignOut = () => {
        if (onSignOut) {
            onSignOut();
        } else {
            // Default behavior: redirect to home
            window.location.href = '/';
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard userName={userName} onNavigate={handleNavigate} />;
            case 'your-notes':
                return <YourNotes />;
            case 'timed-session':
                return <TimedSession />;
            default:
                return <Dashboard userName={userName} onNavigate={handleNavigate} />;
        }
    };

    return (
        <DashboardLayout
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
            userName={userName}
        >
            {renderPage()}
        </DashboardLayout>
    );
};

export default AfterLogin;
