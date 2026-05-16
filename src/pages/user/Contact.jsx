import React from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Send,
    MessageSquare,
    Globe
} from 'lucide-react';
import SEO from '../../components/common/SEO';

const Contact = () => {
    const contactInfo = [
        { 
            title: 'Our Showroom', 
            details: 'Mullenghal Building, Calicut, Kerala 673001', 
            icon: MapPin, 
            color: 'bg-blue-50 text-blue-600' 
        },
        { 
            title: 'Call Us', 
            details: '+91 98765 43210', 
            icon: Phone, 
            color: 'bg-green-50 text-green-600' 
        },
        { 
            title: 'Email Us', 
            details: 'partners@mullenghalfurniture.com', 
            icon: Mail, 
            color: 'bg-amber-50 text-amber-600' 
        },
        { 
            title: 'Business Hours', 
            details: 'Mon - Sat: 9:00 AM - 8:00 PM', 
            icon: Clock, 
            color: 'bg-purple-50 text-purple-600' 
        },
    ];

    return (
        <Layout>
            <SEO 
                title="Contact Our Kerala Showroom"
                description="Get in touch with Mullenghal Furniture. Visit our luxury showroom in Calicut or contact us for wholesale furniture enquiries across Kerala."
                keywords="contact furniture wholesale, furniture showroom calicut, kerala furniture supplier, wholesale furniture enquiry"
            />

            {/* Header */}
            <div className="mb-12 md:mb-20 text-center max-w-3xl mx-auto mt-10">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">Connect With Us</span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Let's Discuss Your <br /><span className="text-primary italic font-light">Inventory Needs.</span></h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                    Our dedicated account managers are ready to assist with bulk logistics, personalized pricing, and showroom curation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start mb-20 md:mb-32">
                {/* Contact Info & Map */}
                <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {contactInfo.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 flex flex-col gap-6 group hover:shadow-2xl transition-all"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg mb-1">{item.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.details}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Placeholder for Map */}
                    <div className="h-[400px] w-full rounded-[3rem] bg-slate-200 overflow-hidden relative shadow-premium border border-white">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-100">
                            <MapPin size={48} className="text-primary/20 mb-4" />
                            <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">Interactive Map</h4>
                            <p className="text-slate-400 text-sm mt-2">Mullenghal Showroom, Calicut, Kerala</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Direct Enquiry</h3>
                    <form className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                                <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject</label>
                            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold appearance-none">
                                <option>Wholesale Partnership</option>
                                <option>Bulk Order Quote</option>
                                <option>Logistics Query</option>
                                <option>Showroom Visit</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Message</label>
                            <textarea rows="5" placeholder="Tell us about your requirements..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold resize-none"></textarea>
                        </div>

                        <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-95 group">
                            <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            SEND MESSAGE
                        </button>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Contact;
