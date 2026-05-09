import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Package, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '../../components/common/SafeImage';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

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

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category,
                stock: product.stock,
                description: product.description || ''
            });
            setPreviews(product.images ? product.images.map(img => img.url) : (product.image ? [product.image] : []));
            setSelectedFiles([]);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', category: '', stock: '', description: '' });
            setPreviews([]);
            setSelectedFiles([]);
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(files);
            
            // Generate previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        // At least one image required for new products
        if (!editingProduct && selectedFiles.length === 0) {
            newErrors.images = 'At least one product image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock || 0);
        data.append('description', formData.description);
        
        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <Layout title="Product Management">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <p className="text-slate-500 text-sm sm:text-base">Manage your furniture catalog and inventory</p>
                <button 
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>Add New Product</span>
                </button>
            </div>

            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Product</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Category</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Price</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6">Stock</th>
                                <th className="px-6 sm:px-8 py-4 sm:py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin inline text-primary" /></td></tr>
                            ) : products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                                                <SafeImage src={(product.images && product.images.length > 0) ? product.images[0].url : product.image} alt={product.name} className="w-full h-full" />
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm sm:text-base">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6 font-black text-slate-900 text-base sm:text-lg">${product.price}</td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6">
                                        <span className={`font-bold text-sm ${product.stock < 10 ? 'text-danger' : 'text-slate-600'}`}>{product.stock} units</span>
                                    </td>
                                    <td className="px-6 sm:px-8 py-4 sm:py-6 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2 sm:p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 sm:p-3 text-slate-400 hover:text-danger hover:bg-danger/5 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({...errors, name: null});
                                        }}
                                        className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
                                            errors.name ? 'border-danger ring-2 ring-danger/10' : 'border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                        }`}
                                        placeholder="Modern Sofa"
                                    />
                                    {errors.name && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Price ($)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => {
                                                setFormData({ ...formData, price: e.target.value });
                                                if (errors.price) setErrors({...errors, price: null});
                                            }}
                                            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
                                                errors.price ? 'border-danger ring-2 ring-danger/10' : 'border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                            }`}
                                            placeholder="299"
                                        />
                                        {errors.price && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Stock</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => {
                                            setFormData({ ...formData, category: e.target.value });
                                            if (errors.category) setErrors({...errors, category: null});
                                        }}
                                        className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
                                            errors.category ? 'border-danger ring-2 ring-danger/10' : 'border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                        }`}
                                        placeholder="Living Room"
                                    />
                                    {errors.category && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Product Images (Max 5)</label>
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleFileChange(e);
                                                if (errors.images) setErrors({...errors, images: null});
                                            }}
                                            className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 ${
                                                errors.images ? 'ring-2 ring-danger/20 rounded-full' : ''
                                            }`}
                                        />
                                        {errors.images && <p className="text-danger text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">{errors.images}</p>}
                                        
                                        {previews.length > 0 && (
                                            <div className="flex flex-wrap gap-3">
                                                {previews.map((preview, index) => (
                                                    <div key={index} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 relative group">
                                                        <SafeImage src={preview} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Package size={16} className="text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => {
                                            setFormData({ ...formData, description: e.target.value });
                                            if (errors.description) setErrors({...errors, description: null});
                                        }}
                                        className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all h-32 resize-none ${
                                            errors.description ? 'border-danger ring-2 ring-danger/10' : 'border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                        }`}
                                        placeholder="Describe the product details..."
                                    />
                                    {errors.description && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{errors.description}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Saving...
                                        </>
                                    ) : (
                                        editingProduct ? 'Update Product' : 'Create Product'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ProductManagement;
