import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { Armchair, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to reset password';
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

                <div className="mb-10">
                    <h2 className="text-3xl font-serif text-slate-900 mb-3">Reset Password</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Please enter your new secure password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error && error.includes('match') ? 'text-slate-300' : error ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className={`w-full pl-12 pr-12 py-4 bg-white border rounded-[1.5rem] outline-none transition-all duration-300 ${
                                    error && !error.includes('match') ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                } shadow-sm`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Confirm New Password</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error && error.includes('match') ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className={`w-full pl-12 pr-4 py-4 bg-white border rounded-[1.5rem] outline-none transition-all duration-300 ${
                                    error && error.includes('match') ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                } shadow-sm`}
                                placeholder="••••••••"
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
                                <span>Reset Password</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-slate-50 text-center text-sm font-medium text-slate-400">
                    Suddenly remembered? <Link to="/login" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Back to Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
