import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div style={{ paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px', minHeight: '100vh' }}>
            {children}
        </div>
    );
};

export default DashboardLayout;
