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
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'confirmed':
                return 'bg-blue-100 text-blue-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <Layout title="Enquiry Management">
            <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 lg:px-0">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : enquiries.length === 0 ? (
                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-20 text-center shadow-premium">
                        <MessageSquare
                            size={64}
                            className="text-slate-200 mx-auto mb-6"
                        />
                        <h3 className="text-xl font-bold text-slate-800">
                            All clear!
                        </h3>
                        <p className="text-slate-500">
                            No new enquiries at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5 sm:space-y-6">
                        {enquiries.map((enquiry) => (
                            <motion.div
                                key={enquiry._id}
                                layout
                                className="bg-white rounded-[2rem] sm:rounded-3xl shadow-premium border border-slate-100 overflow-hidden"
                            >
                                <div className="p-4 sm:p-6 lg:p-8">
                                    {/* Header */}
                                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-8">
                                        {/* User Info */}
                                        <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                                                <User size={28} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                                                    {enquiry.userId?.name}
                                                </h3>

                                                <p className="text-slate-500 font-medium text-sm sm:text-base break-words">
                                                    {enquiry.userId?.shopName || 'Shop Owner'}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                                    <span
                                                        className={`px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase ${getStatusBadge(
                                                            enquiry.status
                                                        )}`}
                                                    >
                                                        {enquiry.status}
                                                    </span>

                                                    <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 break-all">
                                                        <Calendar size={12} />
                                                        {new Date(
                                                            enquiry.date
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="w-full xl:w-auto overflow-x-auto">
                                            <div className="flex items-center gap-3 min-w-max pb-2">
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            enquiry._id,
                                                            'confirmed'
                                                        )
                                                    }
                                                    className="flex-none px-4 sm:px-5 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Confirm
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            enquiry._id,
                                                            'rejected'
                                                        )
                                                    }
                                                    className="flex-none px-4 sm:px-5 py-2.5 bg-red-100 text-red-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            enquiry._id,
                                                            'completed'
                                                        )
                                                    }
                                                    className="flex-none px-4 sm:px-5 py-2.5 bg-green-100 text-green-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Complete
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 mb-6 overflow-hidden">
                                        <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                            Requested Products
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                            {enquiry.products.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm border border-slate-100 min-w-0"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Clock size={20} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 text-sm truncate">
                                                                {item.productId?.name ||
                                                                    'Unknown'}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                $
                                                                {item.productId?.price}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black flex-shrink-0">
                                                        × {item.quantity}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Note */}
                                    {enquiry.note && (
                                        <div className="p-4 sm:p-5 bg-primary/5 border border-primary/10 rounded-2xl break-words">
                                            <p className="text-xs font-bold text-primary uppercase mb-2">
                                                User Note
                                            </p>

                                            <p className="text-slate-600 italic text-sm sm:text-base">
                                                "{enquiry.note}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default EnquiryManagement;