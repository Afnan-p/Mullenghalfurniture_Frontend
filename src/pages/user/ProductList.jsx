import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { ShoppingBag, ShoppingCart, Search, Filter, Loader2, Package, Plus, Minus, Trash2 } from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [note, setNote] = useState('');
    const [productQuantities, setProductQuantities] = useState({});

    // Helper to get local quantity for a product
    const getProductQty = (productId) => productQuantities[productId] || 1;

    // Helper to update local quantity
    const updateProductQty = (productId, delta) => {
        setProductQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta)
        }));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product, qty) => {
        const exists = cart.find(item => item.productId === product._id);
        if (exists) {
            setCart(cart.map(item => 
                item.productId === product._id 
                ? { ...item, quantity: item.quantity + qty } 
                : item
            ));
        } else {
            setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity: qty }]);
        }
        toast.success(`${product.name} added to enquiry list`);
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const submitEnquiry = async () => {
        if (cart.length === 0) {
            return toast.error('Your enquiry list is empty. Please add some products first.');
        }
        
        setSubmitting(true);
        try {
            await api.post('/enquiries', {
                products: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
                note: note.trim()
            });
            toast.success('Enquiry submitted successfully! Our team will contact you soon.');
            setCart([]);
            setNote('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout title="Furniture Catalog">
            <SEO 
                title="Furniture Catalog" 
                description="Browse our extensive collection of premium wholesale furniture. From modern sofas to luxury dining sets, find the perfect pieces for your showroom."
                keywords="furniture wholesale, luxury furniture kerala, modern sofa collections, wholesale furniture supplier"
            />
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Catalog */}
                <div className="flex-1 w-full min-w-0">
                    <div className="flex gap-4 mb-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search furniture..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-[2.5rem] p-4 shadow-premium border border-slate-100 animate-pulse">
                                    <div className="h-48 bg-slate-100 rounded-3xl mb-4" />
                                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                                    <div className="h-6 bg-slate-100 rounded w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <motion.div 
                                    key={product._id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[2.5rem] p-4 shadow-premium group border border-slate-100 hover:border-primary/20 transition-all flex flex-col"
                                >
                                <Link to={`/products/${product.slug}`} className="block">
                                        <div className="h-56 rounded-3xl overflow-hidden relative mb-6">
                                            <SafeImage src={(product.images && product.images.length > 0) ? product.images[0].url : product.image} alt={product.name} className="w-full h-full" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary">
                                                {product.category}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="px-2 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <Link to={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                                                <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">{product.name}</h3>
                                            </Link>
                                            <p className="text-3xl font-black text-slate-900">${product.price}</p>
                                        </div>

                                        <div className="mt-auto space-y-3">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                                <span className="pl-2 sm:pl-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</span>
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateProductQty(product._id, -1);
                                                        }}
                                                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 hover:text-primary shadow-sm border border-slate-100"
                                                    >
                                                        <span className="text-lg leading-none">-</span>
                                                    </button>
                                                    <span className="w-8 text-center font-black text-slate-800">
                                                        {getProductQty(product._id)}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateProductQty(product._id, 1);
                                                        }}
                                                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 hover:text-primary shadow-sm border border-slate-100"
                                                    >
                                                        <span className="text-lg leading-none">+</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Link 
                                                    to={`/products/${product.slug}`}
                                                    className="bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center hover:bg-slate-200 transition-all"
                                                >
                                                    Details
                                                </Link>
                                                <button
                                                    onClick={() => addToCart(product, getProductQty(product._id))}
                                                    className="bg-primary text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 active:scale-95"
                                                >
                                                    <ShoppingCart size={14} />
                                                    Enquiry
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enquiry Sidebar */}
                <div className="w-full lg:w-90 lg:shrink-0">
                    <div className="bg-white rounded-3xl shadow-premium p-6 lg:sticky lg:top-[100px]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <ShoppingCart className="text-primary" size={24} />
                            Enquiry List
                        </h2>

                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                            {cart.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">Your list is empty</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.productId} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 truncate text-xl">{item.name}</p>
                                            <p className="text-xxl text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-slate-400 hover:text-danger p-1"
                                        >
                                               <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Note to Admin</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
                                        placeholder="Specific requests..."
                                    />
                                </div>
                                <button
                                    onClick={submitEnquiry}
                                    disabled={submitting}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : 'Submit Enquiry'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductList;
