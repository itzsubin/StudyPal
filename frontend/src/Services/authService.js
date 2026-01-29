// Replace with your actual API URL
const API_URL = 'http://localhost:8787/auth/';

const authService = {
    login: async (email, password) => {
        try {
            console.log("Simulating 30s delay...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
            console.log('Sending login request to:', `${API_URL}login`);
            console.log('Payload:', { email, password });
            const response = await fetch(`${API_URL}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.token) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token); // Store token separately if needed
            }
            return data.user;
        } catch (error) {
            console.error("Login Service Error:", error);
            throw error;
        }
    },

    signup: async (userData) => {
        try {
            console.log('Sending signup request to:', `${API_URL}signup`);
            console.log('Payload:', userData);
            const response = await fetch(`${API_URL}signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log('Signup Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            return data;
        } catch (error) {
            console.error("Signup Service Error:", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
};

export default authService;
