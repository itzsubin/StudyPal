
// In-memory user store (Replaced with DB in production)
const users = new Map([
    ['subin@gmail.com', {
        id: 'default-mock-user',
        name: 'Subin',
        email: 'subin@gmail.com',
        password: '1234',
        createdAt: new Date().toISOString()
    }]
]);

export const AuthService = {
    signup: async (name: string, email: string, password: string) => {
        if (users.has(email)) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password, // In real app, hash this!
            createdAt: new Date().toISOString()
        };

        users.set(email, newUser);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        return {
            user: userWithoutPassword,
            token: "mock-jwt-token-" + newUser.id
        };
    },

    login: async (email: string, password: string) => {
        const user = users.get(email);

        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token: "mock-jwt-token-" + user.id
        };
    }
};
