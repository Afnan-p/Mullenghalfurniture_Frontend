import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    MessageSquare, 
    Users, 
    LogOut, 
    ChevronRight,
    Armchair,
    History
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

import { Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    const userLinks = [
        { name: 'Home', path: '/home', icon: LayoutDashboard },
        { name: 'Browse Furniture', path: '/products', icon: Armchair },
        { name: 'My Enquiries', path: '/enquiries', icon: History },
    ];

    const links = user?.role === 'admin' ? adminLinks : userLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 flex flex-col shadow-2xl z-[60] transition-transform duration-500 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-2xl">
                            <Armchair className="text-primary" size={28} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">FURNI<span className="text-primary">ADMIN</span></h1>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-400"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-4">Management Menu</p>
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => 
                                `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' 
                                    : 'text-slate-500 hover:bg-secondary/20 hover:text-primary'
                                }`
                            }
                        >
                            <div className="flex items-center gap-4">
                                <link.icon size={22} className="transition-transform group-hover:scale-110" />
                                <span className="font-bold text-sm tracking-tight">{link.name}</span>
                            </div>
                            <ChevronRight size={16} className={`transition-opacity ${isOpen ? 'opacity-40' : 'opacity-0 group-hover:opacity-40'}`} />
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-secondary/20 p-5 rounded-3xl border border-secondary/30 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={20} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Admin</p>
                                <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
                            </div>
                        </div>
                        <div className="border-t border-secondary/30 pt-3 flex flex-col gap-1">
                             <p className="text-[11px] text-slate-600 font-bold truncate opacity-80">
                                {user?.email}
                            </p>
                            <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic">
                                {user?.role === 'admin' ? 'Strategic Administrator' : user?.shopName}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-6 py-4 w-full text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 font-bold group"
                    >
                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
