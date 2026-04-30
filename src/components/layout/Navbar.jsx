import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    Armchair, 
    User, 
    LogOut, 
    Home as HomeIcon, 
    History,
    HelpCircle,
    Menu,
    X,
    ChevronDown,
    Phone,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/home', icon: HomeIcon },
        { name: 'Products', path: '/products', icon: Armchair },
        { name: 'About', path: '/about', icon: HelpCircle },
        { name: 'My Enquiries', path: '/enquiries', icon: History },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className={`fixed lg:relative top-0 left-0 right-0 lg:top-auto lg:left-auto lg:right-auto z-[60] transition-all duration-500 ${
                isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-premium py-4' : 'bg-white lg:bg-transparent py-4 lg:py-6'
            }`}>
                <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-3 group relative z-[70]">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                            <Armchair className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <span className="text-2xl md:text-3xl font-logo tracking-wide text-slate-900 leading-none">
                            MULLENGHAL<span className="text-primary tracking-[0.3em] font-sans text-[10px] md:text-xs uppercase mt-1 block font-black">furniture</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:text-primary group ${
                                    location.pathname === link.path ? 'text-primary' : 'text-slate-500'
                                }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-2 left-0 h-[2px] bg-primary transition-all duration-500 ${
                                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                }`} />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 relative z-[70]">
                        <div className="relative hidden lg:block">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 bg-white/50 backdrop-blur p-1.5 pr-4 rounded-2xl hover:bg-white transition-all border border-slate-100 shadow-sm group"
                            >
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary overflow-hidden group-hover:bg-primary group-hover:text-white transition-colors">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Partner</p>
                                    <p className="text-sm font-black text-slate-800 leading-none">{user?.name?.split(' ')[0]}</p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-[80] origin-top-right overflow-hidden"
                                    >
                                        <div className="px-5 py-6 bg-slate-50/80 backdrop-blur rounded-[1.5rem] mb-2 flex items-center gap-4 border border-white/50">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shrink-0 overflow-hidden shadow-sm">
                                                {user?.avatar ? (
                                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={28} />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base font-black text-slate-800 truncate leading-tight">{user?.name}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] truncate">{user?.shopName}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="px-3 py-3 space-y-2">
                                            <div className="flex items-center gap-4 px-4 py-3 text-xs font-bold text-slate-600 bg-slate-50/50 rounded-2xl border border-slate-50">
                                                <Mail size={14} className="text-slate-400" />
                                                <span className="truncate">{user?.email}</span>
                                            </div>
                                            {user?.phone && (
                                                <div className="flex items-center gap-4 px-4 py-3 text-xs font-bold text-slate-600 bg-slate-50/50 rounded-2xl border border-slate-50">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span className="truncate">{user.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-slate-50">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 px-5 py-4 text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                                            >
                                                <div className="w-9 h-9 bg-red-100/50 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                    <LogOut size={18} />
                                                </div>
                                                <span className="uppercase tracking-widest text-[11px]">SIGN OUT</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="lg:hidden p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-primary transition-all shadow-sm active:scale-95"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay System */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        {/* Darkened Backdrop Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />

                        {/* Menu Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-y-0 right-0 w-full max-w-[320px] bg-luxury-bg shadow-2xl flex flex-col border-l border-white/10"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-white">
                                <Link to="/home" className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                        <Armchair size={22} />
                                    </div>
                                    <span className="text-xl font-logo tracking-wide text-slate-900">
                                        MULLENGHAL<span className="text-primary tracking-[0.3em] font-sans text-[8px] uppercase block font-black -mt-0.5">furniture</span>
                                    </span>
                                </Link>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl active:scale-90 transition-transform"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Drawer Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8 custom-scrollbar">
                                {/* Profile Info */}
                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner overflow-hidden">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={28} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-black text-slate-800 leading-tight truncate">{user?.name}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate">{user?.shopName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 truncate">
                                            <Mail size={14} className="text-slate-300 shrink-0" /> {user?.email}
                                        </div>
                                        {user?.phone && (
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                                <Phone size={14} className="text-slate-300 shrink-0" /> {user.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-4">Main Navigation</p>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center justify-between p-4 rounded-[1.5rem] font-black transition-all group ${
                                                location.pathname === link.path 
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                                : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location.pathname === link.path ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-primary/10'}`}>
                                                    <link.icon size={18} />
                                                </div>
                                                <span className="uppercase text-[11px] tracking-widest">{link.name}</span>
                                            </div>
                                            <ChevronDown size={14} className="-rotate-90 opacity-40 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-black uppercase tracking-[0.2em] bg-red-50 rounded-2xl active:scale-[0.98] transition-all text-xs"
                                >
                                    <LogOut size={18} />
                                    Secure Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
