import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { Clock, CheckCircle2, XCircle, Package, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '../../components/common/SafeImage';

const EnquiryHistory = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/enquiries/my');
            setEnquiries(data);
        } catch (error) {
            toast.error('Failed to load enquiry history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning/10 text-warning';
            case 'confirmed': return 'bg-info/10 text-info';
            case 'rejected': return 'bg-danger/10 text-danger';
            case 'completed': return 'bg-success/10 text-success';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <Layout title="Enquiry History">
            {loading ? (
                <div className="flex justify-center py-20">
                    <Clock className="animate-spin text-primary" size={40} />
                </div>
            ) : enquiries.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 md:p-20 text-center shadow-premium border border-secondary/20">
                    <Package size={64} className="text-slate-200 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-slate-800">No enquiries found</h3>
                    <p className="text-slate-500 mt-2 font-medium">You haven't submitted any furniture enquiries yet.</p>
                </div>
            ) : (
                <div className="grid gap-10">
                    {enquiries.map((enquiry, i) => (
                        <motion.div 
                            key={enquiry._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[3rem] shadow-premium p-8 md:p-10 border border-secondary/30 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Status Accent Strip */}
                            <div className={`absolute top-0 left-0 w-2 h-full ${
                                enquiry.status === 'completed' ? 'bg-primary' : 
                                enquiry.status === 'rejected' ? 'bg-red-400' : 
                                'bg-secondary'
                            }`} />

                            <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                                        enquiry.status === 'completed' ? 'bg-primary/10 text-primary' : 
                                        enquiry.status === 'rejected' ? 'bg-red-50 text-red-500' : 
                                        'bg-secondary/40 text-primary'
                                    }`}>
                                        {enquiry.status === 'pending' && <Clock size={28} />}
                                        {enquiry.status === 'confirmed' && <CheckCircle2 size={28} />}
                                        {enquiry.status === 'rejected' && <XCircle size={28} />}
                                        {enquiry.status === 'completed' && <CheckCircle2 size={28} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">ENQ-{enquiry._id.slice(-6)}</span>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                enquiry.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                                enquiry.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {enquiry.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Calendar size={12} className="text-primary" />
                                            {new Date(enquiry.createdAt || enquiry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Items</p>
                                    <p className="text-2xl font-black text-primary">{enquiry.products.length}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Package size={14} className="text-primary" /> Requested Inventory
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {enquiry.products.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group/item hover:border-primary/30 transition-all">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                                                <SafeImage 
                                                    src={item.productId?.images?.[0] || item.productId?.image} 
                                                    alt="Product" 
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-800 truncate mb-0.5">{item.productId?.name || 'Bespoke Item'}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">${item.productId?.price?.toLocaleString() || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {enquiry.note && (
                                <div className="mt-8 relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary rounded-full" />
                                    <div className="pl-8 py-2">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                            <MessageSquare size={12} /> Partner Feedback
                                        </p>
                                        <p className="text-lg text-slate-600 font-medium italic leading-relaxed">
                                            "{enquiry.note}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default EnquiryHistory;
