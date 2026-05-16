import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Search, Home, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

const NotFound = () => {
    return (
        <Layout>
            <SEO 
                title="Page Not Found"
                description="The page you are looking for does not exist. Please go back to the catalog or home page."
            />
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 animate-bounce">
                    <Search size={48} />
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4">404</h1>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 tracking-tight">Furniture Piece Missing!</h2>
                <p className="text-slate-500 text-lg max-w-md mb-12 font-medium">
                    It seems the page you're looking for has been moved or doesn't exist in our current collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        to="/home" 
                        className="px-10 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                        <Home size={20} />
                        BACK TO HOME
                    </Link>
                    <Link 
                        to="/products" 
                        className="px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <ArrowLeft size={20} />
                        BROWSE CATALOG
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default NotFound;
