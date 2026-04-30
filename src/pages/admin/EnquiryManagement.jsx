import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    User, 
    Calendar,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const EnquiryManagement = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/enquiries');
            setEnquiries(data.reverse());
        } catch (error) {
            toast.error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/enquiries/${id}/status`, { status });
            toast.success(`Enquiry marked as ${status}`);
            fetchEnquiries();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning/10 text-warning';
            case 'confirmed': return 'bg-info/10 text-info';
            case 'rejected': return 'bg-danger/10 text-danger';
            case 'completed': return 'bg-success/10 text-success';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <Layout title="Enquiry Management">
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : enquiries.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-premium">
                    <MessageSquare size={64} className="text-slate-200 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-slate-800">All clear!</h3>
                    <p className="text-slate-500">No new enquiries at the moment.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {enquiries.map((enquiry) => (
                        <motion.div 
                            key={enquiry._id}
                            layout
                            className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-primary">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{enquiry.userId?.name}</h3>
                                            <p className="text-slate-500 font-medium">{enquiry.userId?.shopName || 'Shop Owner'}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(enquiry.status)}`}>
                                                    {enquiry.status}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(enquiry.date).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => updateStatus(enquiry._id, 'confirmed')}
                                            className="px-5 py-2.5 bg-info/10 text-info rounded-xl font-bold text-sm hover:bg-info hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Confirm
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(enquiry._id, 'rejected')}
                                            className="px-5 py-2.5 bg-danger/10 text-danger rounded-xl font-bold text-sm hover:bg-danger hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(enquiry._id, 'completed')}
                                            className="px-5 py-2.5 bg-success/10 text-success rounded-xl font-bold text-sm hover:bg-success hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Complete
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-[2rem] p-6 mb-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Requested Products</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {enquiry.products.map((item, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center">
                                                        <Clock size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{item.productId?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-500">${item.productId?.price}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black">
                                                    × {item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {enquiry.note && (
                                    <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl">
                                        <p className="text-xs font-bold text-primary uppercase mb-2">User Note</p>
                                        <p className="text-slate-600 italic">"{enquiry.note}"</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default EnquiryManagement;
