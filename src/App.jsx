import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/user/Home';
import About from './pages/user/About';
import UserDashboard from './pages/user/Dashboard';
import ProductList from './pages/user/ProductList';
import ProductDetails from './pages/user/ProductDetails';
import EnquiryHistory from './pages/user/EnquiryHistory';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import EnquiryManagement from './pages/admin/EnquiryManagement';
import UserManagement from './pages/admin/UserManagement';
import UserDetails from './pages/admin/UserDetails';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    // Allow Admin to access User pages, but keep Admin pages restricted to Admin only
    if (role === 'admin' && user.role !== 'admin') {
        return <Navigate to="/home" />;
    }

    return children;
};

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/home'} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />

            {/* User & Global Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/enquiries" element={<ProtectedRoute><EnquiryHistory /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute role="admin"><ProductManagement /></ProtectedRoute>} />
            <Route path="/admin/enquiries" element={<ProtectedRoute role="admin"><EnquiryManagement /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/users/:id" element={<ProtectedRoute role="admin"><UserDetails /></ProtectedRoute>} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
                <Toaster position="top-right" />
            </Router>
        </AuthProvider>
    );
}

export default App;
