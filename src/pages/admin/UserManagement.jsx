import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { Link } from 'react-router-dom';
import { User, Mail, Store, ChevronRight, Loader2, ArrowUpRight, Ban, Trash2, ShieldCheck, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm)
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id, isBlocked) => {
        try {
            await api.patch(`/users/${id}/block`);
            toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
            fetchUsers();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will permanently delete the user and all their data.')) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <Layout title="User Management">
            {/* Search & Stats Bar */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="relative w-full sm:w-96 group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search partners..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:ring-[6px] focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-sm"
                    />
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-center sm:justify-start gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Partners</span>
                        <span className="text-xl font-black text-primary">{users.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 sm:px-8 py-4 sm:py-6">User / Shop</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Contact Info</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Provider</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Status</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Current Balance</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center"><Loader2 className="animate-spin inline text-primary" /></td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-medium italic">No partners found matching your search.</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="relative shrink-0">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 ${user.isBlocked ? 'border-slate-100' : 'border-primary/20'}`} />
                                                ) : (
                                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${user.isBlocked ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                                                        <Store size={20} className="sm:w-6 sm:h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-black text-sm sm:text-base truncate ${user.isBlocked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{user.shopName}</p>
                                                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider truncate">
                                                    <User size={10} /> {user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                <Mail size={12} className="text-slate-300" /> {user.email}
                                            </p>
                                            <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                <Phone size={12} className="text-slate-300" /> {user.phone || 'Not Provided'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border ${
                                            user.provider === 'google' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                            {user.provider === 'google' && <img src="https://www.google.com/favicon.ico" className="w-2.5 h-2.5" alt="G" />}
                                            {user.provider || 'local'}
                                        </span>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        {user.isBlocked ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-red-100">
                                                <Ban size={10} /> Blocked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                <ShieldCheck size={10} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <span className="font-black text-slate-900 text-base sm:text-lg">${user.currentBalance?.toLocaleString() || 0}</span>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                                            <Link 
                                                to={`/admin/users/${user._id}`}
                                                className="p-2 sm:p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                                                title="View Ledger"
                                            >
                                                <ArrowUpRight size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleBlock(user._id, user.isBlocked)}
                                                className={`p-2 sm:p-3 rounded-2xl transition-all ${user.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                                title={user.isBlocked ? 'Unblock' : 'Block'}
                                            >
                                                <Ban size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 sm:p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default UserManagement;
