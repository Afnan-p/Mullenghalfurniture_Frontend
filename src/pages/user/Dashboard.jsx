import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/layout/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { 
    Package, 
    MessageSquare, 
    Clock, 
    CheckCircle, 
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/enquiries/my');
                const counts = {
                    pending: data.filter(e => e.status === 'pending').length,
                    confirmed: data.filter(e => e.status === 'confirmed').length,
                    completed: data.filter(e => e.status === 'completed').length
                };
                setStats(counts);
            } catch (error) {
                console.error('Stats error', error);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Pending Enquiries', value: stats.pending, icon: Clock, color: 'text-primary', bg: 'bg-secondary/40' },
        { label: 'Confirmed Orders', value: stats.confirmed, icon: CheckCircle, color: 'text-primary', bg: 'bg-secondary/40' },
        { label: 'Completed Deals', value: stats.completed, icon: ShoppingBag, color: 'text-primary', bg: 'bg-secondary/40' },
    ];

    return (
        <Layout title={`Greetings, ${user?.name.split(' ')[0]}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-premium flex items-center justify-between group hover:shadow-2xl transition-all duration-500 border border-secondary/20">
                        <div>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{card.label}</p>
                            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{card.value}</p>
                        </div>
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            <card.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                <div className="bg-primary rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                    <div className="relative z-10">
                        <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Scale Your Business</span>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tighter">Grow your inventory <br /><span className="text-secondary italic font-light">with ease.</span></h3>
                        <p className="text-secondary/80 mb-10 md:mb-12 max-w-sm font-medium text-base md:text-lg leading-relaxed">Discover curated contemporary pieces engineered for the modern showroom. Secure exclusive wholesale rates today.</p>
                        <Link to="/products" className="inline-flex items-center gap-3 bg-secondary text-primary px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-white transition-all shadow-xl active:scale-95">
                            Browse Collection
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                    <ShoppingBag className="absolute right-[-40px] bottom-[-40px] text-white/5 group-hover:scale-110 transition-transform duration-[2s] hidden md:block" size={350} />
                </div>

                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-premium border border-secondary/20 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Support Center</span>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Need Expert <br />Assistance?</h3>
                    <p className="text-slate-500 mb-8 md:mb-10 text-base md:text-lg font-medium leading-relaxed">Our dedicated account managers are ready to assist with bulk logistics and personalized pricing strategies.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-6 bg-secondary/10 rounded-[2rem] border border-secondary/20 group hover:bg-secondary/20 transition-all cursor-pointer">
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact Method</p>
                                <p className="text-lg font-black text-slate-800">Direct Partner Chat</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserDashboard;
