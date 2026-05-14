import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { Armchair, Mail, ArrowRight, Loader2, ArrowLeft, ShieldCheck, Timer, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
            setStep(2);
            setTimer(300); // 5 minutes
            toast.success('OTP sent to your email');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to send OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/verify-otp', { 
                email: email.trim().toLowerCase(), 
                otp: otpValue 
            });
            toast.success('OTP Verified Successfully');
            // Store reset token in state or localStorage for the next page
            sessionStorage.setItem('resetToken', response.data.resetToken);
            navigate('/reset-password');
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid or expired OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        
        setIsResending(true);
        try {
            await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
            setTimer(300);
            setOtp(['', '', '', '', '', '']);
            toast.success('New OTP sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="mb-10">
                                <h2 className="text-3xl font-serif text-slate-900 mb-3">Forgot Password?</h2>
                                <p className="text-slate-500 font-medium leading-relaxed">Enter your email address and we'll send you an OTP to reset your password.</p>
                            </div>

                            <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                                            <span>Send OTP</span>
                                            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-10 text-center">
                                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className="text-3xl font-serif text-slate-900 mb-3">Verify OTP</h2>
                                <p className="text-slate-500 font-medium leading-relaxed px-4">We've sent a 6-digit code to <span className="text-slate-900 font-bold">{email}</span></p>
                            </div>

                            <form onSubmit={handleOtpSubmit} className="space-y-8">
                                <div className="flex justify-between gap-2 sm:gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-full h-14 sm:h-16 text-center text-xl font-bold bg-white border border-slate-100 rounded-2xl focus:border-primary focus:ring-[6px] focus:ring-primary/5 outline-none transition-all shadow-sm"
                                        />
                                    ))}
                                </div>

                                {error && <p className="text-danger text-center text-[10px] font-bold uppercase tracking-wider">{error}</p>}

                                <div className="flex flex-col items-center gap-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                                    </button>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
                                            <Timer size={14} />
                                            <span>{timer > 0 ? formatTime(timer) : 'Expired'}</span>
                                        </div>
                                        
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={timer > 0 || isResending}
                                            className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest transition-colors ${
                                                timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-primary hover:underline underline-offset-4 decoration-2'
                                            }`}
                                        >
                                            {isResending ? <RefreshCw className="animate-spin" size={14} /> : 'Resend Code'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full py-4 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:text-slate-600 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Change Email
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

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
