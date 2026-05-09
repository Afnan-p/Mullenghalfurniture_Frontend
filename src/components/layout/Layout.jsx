import React, { useContext, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Layout = ({ children, title }) => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {isAdmin ? (
                <div className="flex min-h-screen">
                    {/* Admin Sidebar - Mobile Toggle Overlay */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden"
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar Component */}
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    
                    {/* Main Admin Content */}
                    <main className="flex-1 lg:ml-72 p-4 md:p-6 transition-all duration-300 min-h-screen overflow-x-hidden">
                        {/* Mobile Header for Admin */}
                        <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Menu 
                                    className="text-slate-600 cursor-pointer" 
                                    onClick={() => setIsSidebarOpen(true)}
                                />
                                <h1 className="text-lg font-black text-slate-800 tracking-tighter">FURNI<span className="text-primary">ADMIN</span></h1>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto">
                            {title && (
                                <div className="mb-6 md:mb-8">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{title}</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-1 md:mt-2">Administrative Control Panel</p>
                                </div>
                            )}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {children}
                            </motion.div>
                        </div>
                    </main>
                </div>
            ) : (
                <>
                    <Navbar />
                    <main className="flex-1 pt-24 lg:pt-0 pb-20 px-4 md:px-12 lg:px-20 transition-all duration-300 overflow-x-hidden w-full max-w-full">
                        <div className="max-w-screen-2xl mx-auto w-full">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {children}
                            </motion.div>
                        </div>
                    </main>
                </>
            )}
        </div>
    );
};

export default Layout;
