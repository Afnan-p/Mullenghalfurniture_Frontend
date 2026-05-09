import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { Armchair, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
            setSubmitted(true);
            toast.success('Reset link sent to your email');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to send reset link';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-cream overflow-hidden items-center justify-center p-6">
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/10 blur-[100px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-premium p-8 lg:p-12 border border-slate-100"
            >
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Armchair size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-serif font-black tracking-tight text-primary">MULLENGHAL</span>
                </div>

                {!submitted ? (
                    <>
                        <div className="mb-10">
                            <h2 className="text-3xl font-serif text-slate-900 mb-3">Forgot Password?</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">Enter your email address and we'll send you a secure link to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                        }}
                                        className={`w-full pl-12 pr-4 py-4 bg-white border rounded-[1.5rem] outline-none transition-all duration-300 ${
                                            error ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {error && <p className="text-danger text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-3xl font-serif text-slate-900 mb-4">Check Your Email</h2>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">We've sent a password reset link to <span className="text-slate-900 font-bold">{email}</span>. Please check your inbox and spam folder.</p>
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="text-primary font-black uppercase text-xs tracking-widest hover:underline decoration-2 underline-offset-4"
                        >
                            Didn't receive it? Try again
                        </button>
                    </div>
                )}

                <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-primary transition-colors text-sm group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
