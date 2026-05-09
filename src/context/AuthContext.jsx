import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const { data } = await api.get('/auth/me');
                const userData = { ...JSON.parse(userInfo), ...data };
                setUser(userData);
                localStorage.setItem('userInfo', JSON.stringify(userData));
            } catch (error) {
                console.error('Session verification failed:', error);
                localStorage.removeItem('userInfo');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
