import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    Star, 
    Shield, 
    Truck, 
    Armchair, 
    ChevronRight,
    ShoppingBag,
    Gem,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from '../../components/common/SafeImage';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeHero, setActiveHero] = useState(0);

    const heroImages = [
        '/assets/images/hero.png',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920',
        '/assets/images/about_showroom.png'
    ];

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/products');
                setFeaturedProducts(data.slice(0, 8));
            } catch (error) {
                console.error('Error fetching products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();

        const timer = setInterval(() => {
            setActiveHero((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        { title: 'Quality Assurance', desc: 'Sourced from premium artisans.', icon: Gem, color: 'text-primary' },
        { title: 'Bulk Pricing', desc: 'Exclusive rates for B2B partners.', icon: Shield, color: 'text-primary' },
        { title: 'Express Logistics', desc: 'Fast shipping for retail stock.', icon: Truck, color: 'text-primary' },
        { title: 'Dedicated Support', desc: '24/7 account management.', icon: Clock, color: 'text-primary' },
    ];

    const categories = [
        { name: 'Living Room', image: '/assets/images/cat_living.png', count: 12 },
        { name: 'Office', image: '/assets/images/cat_office.png', count: 8 },
        { name: 'Bedroom', image: '/assets/images/cat_bedroom.png', count: 15 },
        { name: 'Dining', image: '/assets/images/cat_dining.png', count: 6 }
    ];

    return (
        <Layout>
            {/* Hero Section - Full Width */}
            <section className="relative min-h-[500px] md:min-h-[650px] flex items-center rounded-[2rem] md:rounded-[3.5rem] overflow-hidden mb-10 md:mb-20 group shadow-2xl">
                <div className="absolute inset-0 bg-slate-900">
                    <AnimatePresence mode="wait">
                        {heroImages.map((img, idx) => activeHero === idx && (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <img src={img} alt="Luxury Interior" className="w-full h-full object-cover" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent z-10" />
                </div>
                
                <div className="relative z-20 px-6 md:px-12 lg:px-20 max-w-4xl mt-20 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="h-[2px] w-8 md:w-12 bg-secondary" />
                            <span className="text-secondary font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs">Exquisite Wholesale Furniture</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-10 leading-[0.9] tracking-tighter">
                            Elevate Your <br />
                            <span className="text-secondary italic font-light">Showroom</span> Style
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-secondary/90 mb-8 md:mb-14 leading-relaxed max-w-xl font-medium">
                            Join our exclusive network of 500+ global retailers. Discover curated contemporary pieces engineered for the modern workspace and home.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                            <Link to="/products" className="px-8 py-4 md:px-12 md:py-6 bg-secondary text-primary rounded-2xl font-black text-base md:text-lg hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                Explore Collection <ArrowRight size={22} />
                            </Link>
                            <Link to="/enquiries" className="px-8 py-4 md:px-12 md:py-6 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-base md:text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center active:scale-95">
                                My Enquiries
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Bar - Soft Green Background */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20 md:mb-32">
                {features.map((f, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 md:p-10 bg-secondary/40 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] border border-secondary shadow-sm hover:shadow-premium transition-all"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${f.color} shadow-sm mb-6`}>
                            <f.icon size={28} />
                        </div>
                        <h3 className="font-black text-primary text-xl mb-3 tracking-tight">{f.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Shop by Category - Modern Grid */}
            <section className="mb-20 md:mb-32">
                <div className="flex flex-col items-center text-center mb-10 md:mb-16 px-4">
                    <span className="text-primary font-black uppercase tracking-widest text-[10px] md:text-xs mb-3 md:mb-4">Curated Selections</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Discover by Category</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {categories.map((cat, i) => (
                        <Link 
                            key={i}
                            to={`/products?category=${cat.name}`}
                            className="relative h-[350px] md:h-[450px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-premium"
                        >
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute inset-0 border-[12px] border-transparent group-hover:border-white/20 transition-all duration-700 rounded-[3rem]" />
                            
                            <div className="absolute bottom-10 left-10 text-white">
                                <h3 className="text-3xl font-black mb-1">{cat.name}</h3>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{cat.count} High-End Items</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* About FurniB2B Section - Premium Trust Builder */}
            <section className="mb-20 md:mb-32 bg-secondary/20 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-primary font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs mb-4 md:mb-6 block">Our Heritage</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 md:mb-10 leading-tight">Modernizing <br />Wholesale Commerce.</h2>
                    <p className="text-base md:text-xl text-slate-600 mb-8 md:mb-12 leading-relaxed font-medium">
                        FurniB2B is the premier digital showroom for luxury retailers. We bridge the gap between world-class artisans and global showrooms, providing a seamless, high-fidelity sourcing experience.
                    </p>
                    
                    <div className="space-y-6 mb-12">
                        {[
                            { title: 'Trusted Suppliers', desc: 'Direct access to verified premium furniture makers.' },
                            { title: 'Bulk Pricing', desc: 'Algorithmic wholesale rates optimized for retail margins.' },
                            { title: 'Quality Assurance', desc: 'Every piece is inspected by our in-house design experts.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-5 group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                    <ChevronRight size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg">{item.title}</h4>
                                    <p className="text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white">
                        <img src="/assets/images/about_showroom.png" alt="Showroom" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-premium max-w-[280px] hidden md:block">
                        <div className="text-5xl font-black text-primary mb-2">500+</div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs leading-relaxed">Partnered Showrooms Across 40 Countries</p>
                    </div>
                </motion.div>
            </section>

            {/* Featured Grid - Luxury Layout */}
            <section className="mb-20 md:mb-32">
                <div className="flex items-end justify-between mb-10 md:mb-16">
                    <div>
                        <span className="text-primary font-black uppercase tracking-widest text-[10px] md:text-xs mb-3 md:mb-4 block">New Arrivals</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The Trending Collection</h2>
                    </div>
                    <Link to="/products" className="hidden md:flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs hover:gap-5 transition-all">
                        View Full Inventory <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse space-y-4 md:space-y-6">
                                <div className="aspect-[3/4] bg-secondary/20 rounded-[2rem] md:rounded-[3rem]" />
                                <div className="h-8 bg-secondary/20 rounded-xl w-2/3" />
                                <div className="h-6 bg-secondary/20 rounded-xl w-1/3" />
                            </div>
                        ))
                    ) : (
                        featuredProducts.map((p, i) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group"
                            >
                                <Link to={`/products/${p._id}`} className="block">
                                    <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-6 md:mb-8 bg-white shadow-premium relative border border-secondary/20 group-hover:shadow-2xl transition-all duration-500">
                                        <div className="w-full h-full transform transition-transform duration-1000 group-hover:scale-110">
                                            <SafeImage src={(p.images && p.images.length > 0) ? p.images : p.image} alt={p.name} className="w-full h-full" />
                                        </div>
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500" />
                                        
                                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-5 py-2 rounded-2xl text-[10px] font-black uppercase text-primary tracking-[0.2em] shadow-sm">
                                            {p.category}
                                        </div>
                                        
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-10 group-hover:translate-y-0">
                                            <div className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-sm whitespace-nowrap shadow-2xl flex items-center gap-3">
                                                VIEW DETAILS <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-xl font-black text-slate-800 mb-2 truncate group-hover:text-primary transition-colors">{p.name}</h3>
                                        <p className="text-primary font-black text-2xl tracking-tighter">${p.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* CTA Section - Reseda Green */}
            <section className="bg-primary rounded-[2rem] md:rounded-[5rem] p-10 md:p-24 relative overflow-hidden text-center mb-12 shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
                
                <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <ShoppingBag className="text-secondary/30 mx-auto mb-6 md:mb-10 w-16 h-16 md:w-20 md:h-20" />
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-10 tracking-tighter leading-tight">Scale Your Inventory <br />With Confidence.</h2>
                        <p className="text-secondary/80 text-base md:text-xl mb-8 md:mb-14 font-medium leading-relaxed">Join the world's most elite B2B furniture network. Get instant access to verified artisans and wholesale logistics.</p>
                        <Link to="/products" className="inline-block px-8 py-5 md:px-14 md:py-7 bg-white text-primary rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl hover:bg-secondary hover:shadow-2xl transition-all active:scale-95">
                            Start Sourcing Now
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
