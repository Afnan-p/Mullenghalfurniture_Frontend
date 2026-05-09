import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Armchair, Mail, Lock, User, Store, ArrowRight, Loader2, Eye, EyeOff, Phone, CheckCircle2 } from 'lucide-react';

import registerSide from '../../assets/auth/register-side.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        shopName: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name || formData.name.trim().length < 3) newErrors.name = 'Full name is required';
        if (!formData.shopName) newErrors.shopName = 'Business/Shop name is required';
        if (!formData.email) newErrors.email = 'Work email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        
        if (!formData.phone) newErrors.phone = 'Phone number is required';

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!formData.password) newErrors.password = 'Password is required';
        else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Min 6 chars, 1 uppercase, 1 lowercase, 1 number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare trimmed data
        const trimmedData = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim(),
            shopName: formData.shopName.trim(),
            phone: formData.phone.trim()
        };

        if (!validate()) {
            toast.error('Please fill all required fields correctly');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', trimmedData);
            login(data);
            toast.success('Business account created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { title: "Wholesale Pricing", desc: "Access exclusive rates up to 40% off retail." },
        { title: "Trusted Suppliers", desc: "Curated collection of high-end global brands." },
        { title: "Fast Delivery", desc: "Priority logistics for B2B partners." },
        { title: "Dedicated Support", desc: "24/7 account management for your firm." }
    ];

    return (
        <div className="min-h-screen w-full flex bg-cream overflow-hidden">
            {/* Left Side: Onboarding Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-xl"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Armchair size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-serif font-black tracking-tight text-primary">FurniB2B</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-serif text-slate-900 mb-3">Partner with Us</h2>
                        <p className="text-slate-500 font-medium">Create your business account to unlock exclusive benefits.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Owner Full Name</label>
                                <div className="relative group">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.name ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-[1.25rem] outline-none transition-all duration-300 ${
                                            errors.name ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                {errors.name && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Business / Shop Name</label>
                                <div className="relative group">
                                    <Store className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.shopName ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-[1.25rem] outline-none transition-all duration-300 ${
                                            errors.shopName ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="Company name"
                                    />
                                </div>
                                {errors.shopName && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.shopName}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.email ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-[1.25rem] outline-none transition-all duration-300 ${
                                            errors.email ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="name@company.com"
                                    />
                                </div>
                                {errors.email && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.phone ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-[1.25rem] outline-none transition-all duration-300 ${
                                            errors.phone ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                {errors.phone && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.password ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-12 py-3.5 bg-white border rounded-[1.25rem] outline-none transition-all duration-300 ${
                                            errors.password ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.confirmPassword ? 'text-danger' : 'text-slate-300 group-focus-within:text-primary'}`} size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-[1.25rem] outline-none transition-all duration-300 ${
                                            errors.confirmPassword ? 'border-danger ring-4 ring-danger/5' : 'border-slate-100 focus:border-primary focus:ring-[6px] focus:ring-primary/5'
                                        } shadow-sm`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="flex items-start gap-3 ml-1 pt-2">
                            <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 rounded-md border-slate-200 text-primary focus:ring-primary/20 accent-primary" />
                            <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                                I agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span>Create Business Account</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center lg:text-left">
                        <p className="text-slate-400 text-sm font-medium">
                            Already part of our network? {' '}
                            <Link to="/login" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Sign In</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Visual & Features */}
            <div className="hidden lg:flex w-2/5 relative bg-slate-900 items-center justify-center overflow-hidden">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />
                    <img 
                        src={registerSide} 
                        alt="Luxury Showroom" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop'}
                    />
                </motion.div>

                <div className="relative z-20 w-full px-16">
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-12"
                    >
                        <div className="max-w-xs">
                            <h3 className="text-4xl font-serif text-white mb-4">The Standard of Excellence.</h3>
                            <div className="w-16 h-1 bg-primary rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {features.map((feature, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 + (idx * 0.1) }}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">{feature.title}</h4>
                                        <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
            </div>
        </div>
    );
};

export default Register;
