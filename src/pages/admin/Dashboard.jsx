import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { 
    Users, 
    Package, 
    MessageSquare, 
    Activity,
    CheckCircle2
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalEnquiries: 0,
        completedEnquiries: 0,
        totalDebit: 0,
        totalCredit: 0,
        totalPreviousBalance: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/transactions/stats');
                setStats(data);
            } catch (error) {
                console.error('Stats error', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Completed', value: stats.completedEnquiries, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <Layout title="Admin Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-premium border border-slate-100 flex flex-col justify-between">
                        <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{card.label}</p>
                            <p className="text-3xl font-black text-slate-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="text-primary" size={24} />
                            Financial Summary
                        </h3>
                    </div>
                    
                    <div className="h-[300px] w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="credit" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorCredit)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="debit" 
                                    stroke="#ef4444" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorDebit)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 p-6 bg-slate-900 rounded-3xl text-white">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Outstanding</p>
                            <p className="text-2xl font-black">${(stats.totalPreviousBalance + stats.totalDebit - stats.totalCredit).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4 px-6 border border-slate-100 rounded-3xl">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-xs font-bold text-slate-500 uppercase">Received</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-xs font-bold text-slate-500 uppercase">Billed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {['Products', 'Enquiries', 'Users', 'Accounting'].map((link) => (
                            <button key={link} className="p-6 bg-slate-50 rounded-2xl text-left hover:bg-primary hover:text-white transition-all group">
                                <p className="font-bold text-slate-800 group-hover:text-white">{link}</p>
                                <p className="text-xs text-slate-500 group-hover:text-primary-100">Manage all {link.toLowerCase()}</p>
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <Users size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800">New Updates Coming</h4>
                        <p className="text-sm text-slate-500">Enhanced reporting and data exports will be available soon.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
