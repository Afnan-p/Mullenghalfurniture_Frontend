import React from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { 
    Users, 
    Globe, 
    Award, 
    ShieldCheck, 
    Target, 
    Zap,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const About = () => {
    const stats = [
        { label: 'Global Retailers', value: '500+', icon: Globe },
        { label: 'Luxury Pieces', value: '12k+', icon: Zap },
        { label: 'Countries Served', value: '40+', icon: Target },
        { label: 'Design Awards', value: '25+', icon: Award },
    ];

    const values = [
        {
            title: "Artisanal Excellence",
            desc: "We partner exclusively with verified master craftsmen who treat every piece of furniture as a functional sculpture.",
            icon: Users
        },
        {
            title: "Commercial Integrity",
            desc: "Our B2B platform is built on transparency, offering direct-from-source wholesale rates with no hidden retail markups.",
            icon: ShieldCheck
        },
        {
            title: "Sustainable Sourcing",
            desc: "Every timber used in our collections is ethically sourced from FSC-certified forests, ensuring luxury doesn't cost the earth.",
            icon: Globe
        }
    ];

    return (
        <Layout>
            <SEO 
                title="About Our Heritage"
                description="Learn about FurniB2B, the premier digital showroom for luxury furniture retailers. Our mission is to bridge the gap between world-class artisans and global showrooms."
                keywords="about furniture wholesale, furniture artisans, luxury showroom history, sustainable furniture sourcing"
            />
            {/* Page Header */}
            <section className="relative h-[350px] md:h-[450px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden mb-12 md:mb-20 shadow-2xl">
                <img 
                    src="/assets/images/about_showroom.png" 
                    alt="Luxury Showroom" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
                <div className="absolute inset-0 flex items-center px-6 md:px-20">
                    <div className="max-w-2xl">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight"
                        >
                            Our Heritage <br />
                            <span className="text-secondary italic font-light">& Future.</span>
                        </motion.h1>
                        <p className="text-base md:text-xl text-secondary/80 font-medium leading-relaxed">
                            Redefining the architecture of wholesale furniture through technology, transparency, and timeless design.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20 md:mb-32">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[3rem] shadow-premium border border-secondary/20 text-center"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-primary mx-auto mb-4 md:mb-6">
                            <stat.icon size={20} />
                        </div>
                        <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</div>
                        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content - 2 Column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6 block">The FurniB2B Story</span>
                    <h2 className="text-5xl font-black text-slate-900 mb-10 leading-tight">Beyond a Marketplace. <br />An Ecosystem.</h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                        Founded in 2018, FurniB2B was born out of a simple frustration: the disconnect between world-class furniture designers and the global retailers who need them.
                    </p>
                    <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                        We didn't just build a website; we built a bridge. By leveraging real-time inventory management and direct-to-artisan communication, we've eliminated the friction of international sourcing. Today, we empower over 500 showrooms to curate collections that inspire their local communities.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-secondary/30">
                            <h4 className="font-black text-primary mb-2">Verified Sourcing</h4>
                            <p className="text-sm text-slate-500">Every supplier is rigorously audited for quality and ethics.</p>
                        </div>
                        <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                            <h4 className="font-black text-primary mb-2">Global Logistics</h4>
                            <p className="text-sm text-slate-500">End-to-end shipping solutions optimized for bulk cargo.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                        <img 
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                            alt="Meeting" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-10 -right-10 bg-primary p-12 rounded-[3.5rem] shadow-2xl max-w-[300px]">
                        <h3 className="text-white text-2xl font-black mb-4">Join the Network.</h3>
                        <p className="text-secondary/80 text-sm mb-6 leading-relaxed">Become a verified B2B partner and unlock exclusive rates.</p>
                        <Link to="/register" className="flex items-center gap-2 text-white font-bold hover:gap-4 transition-all uppercase tracking-widest text-xs">
                            Get Started <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Our Values */}
            <section className="mb-20 md:mb-32">
                <div className="text-center mb-12 md:mb-20">
                    <span className="text-primary font-black uppercase tracking-widest text-[10px] md:text-xs mb-4 block">The Pillars of FurniB2B</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">What Drives Us</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="w-20 h-20 bg-secondary/20 rounded-[2rem] flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <v.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">{v.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Closing CTA */}
            <section className="bg-secondary/40 rounded-[3rem] md:rounded-[5rem] p-10 md:p-24 text-center mb-12 border border-secondary/50">
                <h2 className="text-3xl md:text-5xl font-black text-primary mb-6 md:mb-10 tracking-tighter">Ready to Partner With Us?</h2>
                <p className="text-base md:text-xl text-slate-600 mb-10 md:mb-14 max-w-2xl mx-auto font-medium">
                    Let's discuss how FurniB2B can help you scale your retail inventory with world-class furniture.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                    <Link to="/products" className="px-10 py-5 md:px-14 md:py-6 bg-primary text-white rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:shadow-2xl transition-all active:scale-95">
                        Browse Full Inventory
                    </Link>
                    <a href="mailto:partners@furnib2b.com" className="px-10 py-5 md:px-14 md:py-6 bg-white text-primary rounded-2xl md:rounded-3xl font-black text-lg md:text-xl border border-secondary hover:bg-secondary/10 transition-all active:scale-95">
                        Contact Partnerships
                    </a>
                </div>
            </section>
        </Layout>
    );
};

export default About;
