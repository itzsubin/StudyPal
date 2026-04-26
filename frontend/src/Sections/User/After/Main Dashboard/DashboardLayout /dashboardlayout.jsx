import React from 'react';
import Menu from '../../Menu/menu';

const DashboardLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-gray-50">
            <div className="fixed top-0 right-0 h-[96px] flex items-center pr-[3rem] z-[9999] pointer-events-none">
                <div className="relative w-[100px] h-[50px] pointer-events-auto">
                    <Menu />
                </div>
            </div>
            <main className="w-full relative z-0">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
