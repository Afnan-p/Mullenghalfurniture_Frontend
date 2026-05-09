import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { 
    Users, 
    Package, 
    MessageSquare, 
    Activity,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowUpRight,
    Clock,
    ShoppingCart,
    ShieldCheck,
    AlertCircle,
    Loader2
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
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalEnquiries: 0,
        pendingEnquiries: 0,
        completedEnquiries: 0,
        totalDebit: 0,
        totalCredit: 0,
        totalPreviousBalance: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        trends: { users: 0, products: 0, enquiries: 0, revenue: 0 },
        recentEnquiries: [],
        activities: [],
        chartData: []
    });
    const [period, setPeriod] = useState('weekly');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            const { data } = await api.get(`/transactions/stats?period=${period}`);
            setStats(data);
        } catch (error) {
            console.error('Stats error', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { 
            label: 'Total Partners', 
            value: stats.totalUsers, 
            icon: Users, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            trend: stats.trends.users,
            link: '/admin/users'
        },
        { 
            label: 'Product Catalog', 
            value: stats.totalProducts, 
            icon: Package, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            trend: stats.trends.products,
            link: '/admin/products'
        },
        { 
            label: 'Active Enquiries', 
            value: stats.totalEnquiries, 
            icon: MessageSquare, 
            color: 'text-orange-600', 
            bg: 'bg-orange-50',
            trend: stats.trends.enquiries,
            link: '/admin/enquiries'
        },
        { 
            label: 'Growth Revenue', 
            value: `$${stats.monthlyRevenue.toLocaleString()}`, 
            icon: TrendingUp, 
            color: 'text-green-600', 
            bg: 'bg-green-50',
            trend: stats.trends.revenue,
            link: '/admin/users'
        },
    ];

    if (loading && stats.chartData.length === 0) {
        return (
            <Layout title="Admin Overview">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Admin Overview">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                {statCards.map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-[2rem] p-6 shadow-premium border border-slate-100 group hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary" />
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{card.label}</p>
                            <div className="flex items-end gap-3">
                                <h4 className="text-3xl font-black text-slate-800 tracking-tight">{card.value}</h4>
                                <div className={`flex items-center gap-0.5 mb-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${card.trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {card.trend >= 0 ? <Plus size={8} /> : <TrendingDown size={10} />}
                                    {Math.abs(card.trend)}%
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 sm:mb-12">
                {/* Financial Summary & Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-premium border border-slate-100"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <Activity className="text-primary" size={28} />
                                Revenue Analytics
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">Real-time financial performance overview</p>
                        </div>
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                            <button 
                                onClick={() => setPeriod('weekly')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${period === 'weekly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Weekly
                            </button>
                            <button 
                                onClick={() => setPeriod('monthly')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${period === 'monthly' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-[350px] w-full mb-10">
                        {stats.chartData.length > 0 ? (
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
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '20px', 
                                            border: '1px solid #f1f5f9', 
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="credit" 
                                        stroke="#10b981" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorCredit)" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="debit" 
                                        stroke="#ef4444" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorDebit)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
                                <AlertCircle size={48} className="text-slate-200 mb-4" />
                                <h4 className="font-bold text-slate-800">No Data Available</h4>
                                <p className="text-sm text-slate-400">Transactions for this period are not yet available.</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Today Revenue</p>
                            <p className="text-2xl font-black">${stats.todayRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-primary rounded-[2rem] text-white">
                            <p className="text-primary-100 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Monthly Peak</p>
                            <p className="text-2xl font-black">${stats.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col justify-center">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Active Accounts</p>
                            <p className="text-2xl font-black text-slate-800">{stats.totalUsers}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity Log */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-premium border border-slate-100"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">System Activity</h3>
                        <Link to="/admin/users" className="text-xs font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View All</Link>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                        {stats.activities.length > 0 ? stats.activities.map((act, idx) => (
                            <div key={idx} className="relative pl-10">
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                                    act.type === 'user' ? 'bg-blue-500' : 
                                    act.type === 'product' ? 'bg-purple-500' :
                                    act.type === 'enquiry' ? 'bg-orange-500' : 'bg-green-500'
                                }`}>
                                    {act.type === 'user' ? <Users size={10} className="text-white" /> : 
                                     act.type === 'product' ? <Package size={10} className="text-white" /> :
                                     act.type === 'enquiry' ? <MessageSquare size={10} className="text-white" /> : <TrendingUp size={10} className="text-white" />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 leading-tight">{act.action}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-black">{act.target}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-widest">
                                        <Clock size={10} />
                                        {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center">
                                <Activity size={32} className="text-slate-100 mx-auto mb-4" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent activity</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Enquiries Preview */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-premium border border-slate-100"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Latest Enquiries</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{stats.pendingEnquiries} Pending attention</p>
                        </div>
                        <Link to="/admin/enquiries" className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all">
                            <Plus size={20} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentEnquiries.length > 0 ? stats.recentEnquiries.map((enq, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {enq.userId?.avatar ? (
                                            <img src={enq.userId.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                                        ) : (
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                                                <Users size={20} />
                                            </div>
                                        )}
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                                            enq.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'
                                        }`}>
                                            {enq.status === 'pending' ? <Clock size={8} className="text-white" /> : <ShieldCheck size={8} className="text-white" />}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{enq.userId?.shopName || enq.userId?.name || 'Guest Partner'}</h5>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{enq.products?.length || 0} Products Requested</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">${(enq.totalAmount || 0).toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{new Date(enq.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center bg-slate-50/30 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                <MessageSquare size={48} className="text-slate-100 mx-auto mb-4" />
                                <h4 className="font-bold text-slate-800">Queue is Empty</h4>
                                <p className="text-sm text-slate-400">All enquiries have been processed.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions (Enhanced) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-premium border border-slate-100 flex flex-col"
                >
                    <h3 className="text-xl font-bold text-slate-800 mb-8">Quick Management</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[
                            { name: 'Products', sub: 'Catalog', icon: Package, link: '/admin/products' },
                            { name: 'Enquiries', sub: 'Active', icon: MessageSquare, link: '/admin/enquiries' },
                            { name: 'Users', sub: 'Partners', icon: Users, link: '/admin/users' },
                            { name: 'Ledger', sub: 'Accounting', icon: TrendingUp, link: '/admin/users' }
                        ].map((action, idx) => (
                            <Link 
                                key={idx} 
                                to={action.link}
                                className="p-5 bg-slate-50 rounded-[2rem] text-left hover:bg-slate-900 hover:text-white transition-all group relative overflow-hidden"
                            >
                                <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all">
                                    <action.icon size={64} />
                                </div>
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary mb-4 transition-colors">
                                    <action.icon size={20} />
                                </div>
                                <p className="font-black text-slate-800 group-hover:text-white text-sm tracking-tight">{action.name}</p>
                                <p className="text-[10px] text-slate-400 group-hover:text-slate-500 font-bold uppercase tracking-widest">{action.sub}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-auto p-8 bg-primary rounded-[2.5rem] text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-primary/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-2xl font-serif leading-tight mb-4 relative z-10">Generate Business Report</h4>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl hover:bg-white hover:text-primary transition-all relative z-10">
                            Download Now <ArrowUpRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
