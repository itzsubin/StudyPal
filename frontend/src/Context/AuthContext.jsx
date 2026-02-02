import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../Services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const checkUser = () => {
    //         const currentUser = authService.getCurrentUser();
    //         setUser(currentUser);
    //         setLoading(false);
    //     };
    //     checkUser();
    // }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            // Mock login for UI development
            console.log('AuthContext: Mocking login success');
            const mockUser = { name: 'Test User', email: email || 'test@example.com' };
            setUser(mockUser);
            // Simulate a short delay if needed, or return immediately
            // await new Promise(resolve => setTimeout(resolve, 500)); 
            return mockUser;

            // Original code bypassed:
            // const data = await authService.login(email, password);
            // setUser(data);
            // return data;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.signup(userData);

            console.log('AuthContext: Signup success:', data);
            // Auto login after signup? or just return success
            return data;
        } catch (err) {
            setError(err.message || 'Signup failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
