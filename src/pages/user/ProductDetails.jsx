import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import {
    ShoppingCart,
    ArrowLeft,
    Plus,
    Minus,
    Star,
    ShieldCheck,
    Truck,
    Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '../../components/common/SafeImage';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                toast.error('Product not found');
                navigate('/products');
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleQuantity = (type) => {
        if (type === 'inc') setQuantity(prev => prev + 1);
        if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
    };

    const addToEnquiry = async () => {
        try {
            await api.post('/enquiries', {
                products: [{ productId: product._id, quantity }],
                note: `Added from details page: ${product.name}`
            });
            toast.success('Added to enquiry history!');
        } catch (error) {
            toast.error('Failed to add enquiry');
        }
    };

    if (loading) return <Layout><div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div></Layout>;

    // Prepare images array
    // Prepare images array and handle auto-repair for split Base64
    let allImages = [];
    if (product.images && product.images.length > 0) {
        allImages = product.images.map(img => typeof img === 'string' ? img : img.url);
    } else if (product.image) {
        allImages = [product.image];
    }

    // Check if the entire array is actually one split Base64 image
    if (allImages.length >= 2 && typeof allImages[0] === 'string' && allImages[0].startsWith('data:') && !allImages[1].startsWith('data:')) {
        allImages = [allImages.join(',')];
    }

    return (
        <Layout>
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 md:mb-10 font-bold group px-2"
            >
                <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="uppercase text-xs tracking-widest">Back to Catalog</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-16 items-start">
                {/* Image Gallery */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square w-full bg-white rounded-[2rem] md:rounded-[4rem] shadow-premium overflow-hidden border border-slate-100"
                    >
                        <SafeImage src={allImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                    </motion.div>

                    {allImages.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl overflow-hidden border-4 transition-all flex-shrink-0 ${activeImage === idx ? 'border-primary shadow-xl scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <SafeImage src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Panel with Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col p-6 md:p-12 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] border border-white/50 shadow-premium lg:min-h-[700px]"
                >
                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star size={12} fill="currentColor" />
                                <span className="text-[10px] font-black text-slate-400">4.9 (B2B Rated)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
                            {product.name}
                        </h1>

                        <p className="text-4xl md:text-5xl font-black text-primary mb-8 tracking-tighter">
                            ${product.price?.toLocaleString()}
                        </p>

                        <div className="bg-white/50 p-6 md:p-8 rounded-3xl border border-white/60 mb-10">
                            <p className="text-slate-500 font-medium text-lg leading-relaxed italic">
                                "{product.description || 'Experience ultimate luxury with our meticulously crafted commercial-grade furniture piece, designed for modern professional environments.'}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/60 backdrop-blur p-5 rounded-3xl border border-white shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Shipping</p>
                                    <p className="text-sm font-black text-slate-800 uppercase">Global B2B</p>
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur p-5 rounded-3xl border border-white shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Warranty</p>
                                    <p className="text-sm font-black text-slate-800 uppercase">2 Year Commercial</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-slate-100/50 space-y-8">
                        <div className="flex flex-col sm:flex-row items-stretch gap-6">
                            <div className="flex items-center justify-between bg-white/80 backdrop-blur p-2 rounded-2xl border border-white shadow-inner sm:w-48">
                                <button
                                    onClick={() => handleQuantity('dec')}
                                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white text-slate-600 rounded-xl hover:text-primary transition-all shadow-sm active:scale-90"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="text-2xl font-black text-slate-800">{quantity}</span>
                                <button
                                    onClick={() => handleQuantity('inc')}
                                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white text-slate-600 rounded-xl hover:text-primary transition-all shadow-sm active:scale-90"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <button
                                onClick={addToEnquiry}
                                className="flex-1 h-16 md:h-16 py-5 mb-5 bg-primary text-white rounded-2xl md:rounded-[1.5rem] font-black text-base md:text-lg flex items-center justify-center gap-4 hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-95 group"
                            >
                                <ShoppingCart size={24} className="group-hover:-translate-y-1 transition-transform" />
                                <span className="uppercase tracking-widest">Add to Enquiry</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-3 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Package size={16} className="text-primary" />
                            Stock Level: <span className={product.stock > 10 ? 'text-green-500' : 'text-amber-500'}>{product.stock > 0 ? `${product.stock} units available` : 'Bespoke Order Only'}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
