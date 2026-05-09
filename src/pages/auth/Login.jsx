import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { Armchair, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import loginSide from '../../assets/auth/login-side.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

    useEffect(() => {
        if (isExpired) {
            toast.error('Session expired. Please login again.', { id: 'session-expired' });
        }
    }, [isExpired]);

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!validate()) {
            toast.error('Please fill all required fields correctly');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { 
                email: trimmedEmail, 
                password: trimmedPassword 
            });
            login(data);
            toast.success('Welcome back to Mullenghal');
            navigate(data.role === 'admin' ? '/admin' : '/home');
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            if (error.response?.status === 401) {
                setErrors({ auth: message });
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen w-full flex bg-cream overflow-hidden">
            {/* Left Side: Visual Experience */}
            <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <img 
                        src={loginSide} 
                        alt="Luxury Interior" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'}
                    />
                </motion.div>

                {/* Glass Feature Card */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-20 glass p-12 rounded-[2.5rem] max-w-lg mx-12 text-white border-white/20"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block opacity-80">Established 1994</span>
                    <h1 className="text-5xl font-serif leading-tight mb-6">Redefining Luxury Wholesale for the Modern Age.</h1>
                    <p className="text-white/70 text-lg font-light leading-relaxed">Join thousands of interior designers and furniture retailers globally.</p>
                </motion.div>

                {/* Decorative Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-secondary/20 blur-[80px] rounded-full" />
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
                {/* Background Blobs for Mobile/Tablet */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-secondary/20 blur-[80px] rounded-full" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Armchair size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-serif font-black tracking-tight text-primary">MULLENGHAL</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-serif text-slate-900 mb-3">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Continue to your luxury business dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.email ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({...errors, email: null});
                                    }}
                                    className={`w-full pl-12 pr-4 py-4 bg-white border rounded-[1.5rem] outline-none transition-all duration-300 ${
                                        errors.email ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                    } shadow-sm group-hover:border-slate-200 focus:shadow-md`}
                                    placeholder="Enter your work email"
                                />
                            </div>
                            {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-danger text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.email}</motion.p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2.5 ml-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline decoration-2 underline-offset-4">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.password ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({...errors, password: null});
                                    }}
                                    className={`w-full pl-12 pr-12 py-4 bg-white border rounded-[1.5rem] outline-none transition-all duration-300 ${
                                        errors.password ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                    } shadow-sm group-hover:border-slate-200 focus:shadow-md`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-danger text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.password}</motion.p>}
                        </div>

                        <div className="flex items-center gap-3 ml-1">
                            <input type="checkbox" id="remember" className="w-5 h-5 rounded-md border-slate-200 text-primary focus:ring-primary/20 accent-primary" />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer">Remember device</label>
                        </div>

                        {errors.auth && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-danger/5 border border-danger/10 p-4 rounded-2xl">
                                <p className="text-danger text-xs font-bold text-center">{errors.auth}</p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>


                    <div className="mt-12 text-center">
                        <p className="text-slate-400 text-sm font-medium">
                            Don't have a partner account? {' '}
                            <Link to="/register" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Join Mullenghal</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
