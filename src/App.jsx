import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Home from './pages/user/Home';
import About from './pages/user/About';
import UserDashboard from './pages/user/Dashboard';
import ProductList from './pages/user/ProductList';
import ProductDetails from './pages/user/ProductDetails';
import EnquiryHistory from './pages/user/EnquiryHistory';
import Contact from './pages/user/Contact';
import NotFound from './pages/user/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import EnquiryManagement from './pages/admin/EnquiryManagement';
import UserManagement from './pages/admin/UserManagement';
import UserDetails from './pages/admin/UserDetails';

import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
        </div>
    );

    if (!user) {
        // Redirect to login but save the current location to come back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Allow Admin to access User pages, but keep Admin pages restricted to Admin only
    if (role === 'admin' && user.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

// Component to handle routes that should only be accessible when logged out (e.g., Login/Register)
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null;
    
    if (user) {
        // If already logged in, redirect away from auth pages
        const destination = user.role === 'admin' ? '/admin/dashboard' : '/home';
        return <Navigate to={destination} replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes - PublicOnly */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            {/* Public Global Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:slug" element={<ProductDetails />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/enquiries" element={<ProtectedRoute><EnquiryHistory /></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute role="admin"><ProductManagement /></ProtectedRoute>} />
            <Route path="/admin/enquiries" element={<ProtectedRoute role="admin"><EnquiryManagement /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/users/:id" element={<ProtectedRoute role="admin"><UserDetails /></ProtectedRoute>} />
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                    <Toaster position="top-right" />
                </Router>
            </AuthProvider>
        </HelmetProvider>
    );
}

export default App;
