import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../Services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(email, password);
            console.log('AuthContext: Login success, setting user:', data);
            setUser(data);
            return data;
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
