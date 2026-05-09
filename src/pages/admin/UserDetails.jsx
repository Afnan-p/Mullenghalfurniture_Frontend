import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Plus, 
    TrendingUp, 
    TrendingDown, 
    History, 
    X, 
    Loader2, 
    Calendar,
    Wallet,
    User,
    Trash2,
    ArrowLeft,
    Edit2,
    Package,
    Download,
    FileText,
    Phone,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [editingTxId, setEditingTxId] = useState(null);
    
    // Transaction Form
    const [txForm, setTxForm] = useState({
        productName: '',
        quantity: 1,
        price: '',
        type: 'debit',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });
    
    // Previous Balance Form
    const [prevBalance, setPrevBalance] = useState('');

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const { data } = await api.get(`/users/${id}`);
            setData(data);
            setPrevBalance(data.user.previousBalance);
        } catch (error) {
            toast.error('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTxModal = (tx = null) => {
        if (tx) {
            setEditingTxId(tx._id);
            setTxForm({
                productName: tx.productName,
                quantity: tx.quantity,
                price: tx.price,
                type: tx.type,
                note: tx.note,
                date: new Date(tx.date).toISOString().split('T')[0]
            });
        } else {
            setEditingTxId(null);
            setTxForm({
                productName: '',
                quantity: 1,
                price: '',
                type: 'debit',
                note: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsTxModalOpen(true);
    };

    const [txErrors, setTxErrors] = useState({});
    const [submittingTx, setSubmittingTx] = useState(false);

    const validateTx = () => {
        const errors = {};
        if (!txForm.productName.trim()) errors.productName = 'Product name is required';
        if (!txForm.quantity || Number(txForm.quantity) <= 0) errors.quantity = 'Qty must be > 0';
        if (!txForm.price || Number(txForm.price) <= 0) errors.price = 'Price must be > 0';
        if (!txForm.note.trim()) errors.note = 'Note is required';
        setTxErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddOrUpdateTransaction = async (e) => {
        e.preventDefault();
        if (!validateTx()) return;

        setSubmittingTx(true);
        try {
            if (editingTxId) {
                await api.put(`/transactions/${editingTxId}`, txForm);
                toast.success('Transaction updated successfully');
            } else {
                await api.post('/transactions', { ...txForm, userId: id });
                toast.success('Transaction added successfully');
            }
            setIsTxModalOpen(false);
            fetchUserDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmittingTx(false);
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const { user, transactions, summary } = data;

        // Header
        doc.setFillColor(37, 99, 235); // Primary color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('ACCOUNT LEDGER REPORT', 20, 25);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 25);

        // Shop Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text('SHOP INFORMATION', 20, 55);
        doc.setLineWidth(0.5);
        doc.line(20, 57, 190, 57);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Shop Name: ${user.shopName}`, 20, 65);
        doc.text(`Owner: ${user.name}`, 20, 72);
        doc.text(`Email: ${user.email}`, 20, 79);

        // Financial Summary
        doc.setFont('helvetica', 'bold');
        doc.text('FINANCIAL SUMMARY', 120, 55);
        doc.setFont('helvetica', 'normal');
        doc.text(`Previous Balance: $${summary.previousBalance.toLocaleString()}`, 120, 65);
        doc.text(`Total Debit (+): $${summary.totalDebit.toLocaleString()}`, 120, 72);
        doc.text(`Total Credit (-): $${summary.totalCredit.toLocaleString()}`, 120, 79);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text(`Current Balance: $${summary.currentBalance.toLocaleString()}`, 120, 88);

        // Transactions Table
        autoTable(doc, {
            startY: 100,
            head: [['Date', 'Product / Item', 'Qty', 'Price', 'Type', 'Amount']],
            body: transactions.map(tx => [
                new Date(tx.date).toLocaleDateString(),
                tx.productName,
                tx.quantity,
                `$${tx.price}`,
                tx.type.toUpperCase(),
                `$${tx.amount.toLocaleString()}`
            ]),
            headStyles: { fillColor: [37, 99, 235], fontSize: 10, halign: 'center' },
            styles: { fontSize: 9, cellPadding: 4 },
            columnStyles: {
                4: { halign: 'center', fontStyle: 'bold' },
                5: { halign: 'right', fontStyle: 'bold' }
            }
        });

        doc.save(`${user.shopName}_Ledger_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('PDF Exported Successfully');
    };

    const handleUpdateBalance = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}/balance`, { previousBalance: Number(prevBalance) });
            toast.success('Previous balance updated');
            setIsBalanceModalOpen(false);
            fetchUserDetails();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDeleteTransaction = async (txId) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${txId}`);
            toast.success('Transaction deleted');
            fetchUserDetails();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <Layout><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div></Layout>;
    if (!data) return <Layout>User not found</Layout>;

    const { user, transactions, summary } = data;

    return (
        <Layout title={`${user.shopName} - Ledger`}>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Stats Header */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-premium border border-slate-100 relative overflow-hidden group">
                            <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase mb-1">Prev. Balance</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-800">${summary.previousBalance.toLocaleString()}</p>
                            <button 
                                onClick={() => setIsBalanceModalOpen(true)}
                                className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-premium border border-slate-100">
                            <p className="text-red-500 font-bold text-[10px] sm:text-xs uppercase mb-1">Total Debit (+)</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-800">${summary.totalDebit.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-premium border border-slate-100">
                            <p className="text-green-500 font-bold text-[10px] sm:text-xs uppercase mb-1">Total Credit (-)</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-800">${summary.totalCredit.toLocaleString()}</p>
                        </div>
                        <div className="bg-primary rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-premium text-white">
                            <p className="text-primary-100 font-bold text-[10px] sm:text-xs uppercase mb-1">Current Balance</p>
                            <p className="text-xl sm:text-2xl font-black">${summary.currentBalance.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Ledger Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                                 <History className="text-primary w-5 h-5 md:w-6 md:h-6" />
                                 Transaction History
                             </h3>
                             <div className="flex w-full sm:w-auto gap-3">
                                 <button 
                                     onClick={handleExportPDF}
                                     className="flex-1 sm:flex-none bg-white text-slate-600 border border-slate-200 px-4 md:px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                                 >
                                     <Download className="w-4 h-4 md:w-[18px] md:h-[18px]" /> <span className="whitespace-nowrap">Export PDF</span>
                                 </button>
                                 <button 
                                     onClick={() => handleOpenTxModal()}
                                     className="flex-1 sm:flex-none bg-primary text-white px-4 md:px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                 >
                                     <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" /> <span className="whitespace-nowrap">Add Entry</span>
                                 </button>
                             </div>
                         </div>
                         <div className="overflow-x-auto w-full">
                             <table className="w-full text-left min-w-[700px]">
                             <thead>
                                 <tr className="bg-slate-50 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                     <th className="px-4 md:px-8 py-3 md:py-4">Date</th>
                                     <th className="px-4 md:px-8 py-3 md:py-4">Product / Item</th>
                                     <th className="px-4 md:px-8 py-3 md:py-4">Qty</th>
                                     <th className="px-4 md:px-8 py-3 md:py-4">Price</th>
                                     <th className="px-4 md:px-8 py-3 md:py-4">Type</th>
                                     <th className="px-4 md:px-8 py-3 md:py-4">Total</th>
                                     <th className="px-4 md:px-8 py-3 md:py-4 text-right">Actions</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                 {transactions.length === 0 ? (
                                     <tr><td colSpan="7" className="px-8 py-10 text-center text-slate-400 italic">No transactions recorded yet</td></tr>
                                 ) : transactions.map((tx) => (
                                     <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                                         <td className="px-4 md:px-8 py-3 md:py-4">
                                             <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                 <Calendar size={14} className="text-slate-400" />
                                                 {new Date(tx.date).toLocaleDateString()}
                                             </div>
                                         </td>
                                         <td className="px-4 md:px-8 py-3 md:py-4">
                                             <p className="font-bold text-slate-800 text-sm">{tx.productName}</p>
                                             <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{tx.note}</p>
                                         </td>
                                         <td className="px-4 md:px-8 py-3 md:py-4 text-sm text-slate-600 font-bold">{tx.quantity}</td>
                                         <td className="px-4 md:px-8 py-3 md:py-4 text-sm text-slate-600">${tx.price}</td>
                                         <td className="px-4 md:px-8 py-3 md:py-4">
                                             <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                 tx.type === 'debit' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                             }`}>
                                                 {tx.type}
                                             </span>
                                         </td>
                                         <td className={`px-4 md:px-8 py-3 md:py-4 font-black text-sm ${tx.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                                             {tx.type === 'debit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                         </td>
                                         <td className="px-4 md:px-8 py-3 md:py-4 text-right">
                                             <div className="flex items-center justify-end gap-1">
                                                 <button 
                                                     onClick={() => handleOpenTxModal(tx)}
                                                     className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                 >
                                                     <Edit2 size={14} />
                                                 </button>
                                                 <button 
                                                     onClick={() => handleDeleteTransaction(tx._id)}
                                                     className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                                                 >
                                                     <Trash2 size={14} />
                                                 </button>
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                          </table>
                         </div>
                    </div>
                </div>

                 {/* Sidebar Info */}
                 <div className="w-full lg:w-80 space-y-6">
                     <div className="bg-white rounded-[2rem] p-8 shadow-premium border border-slate-100">
                         <h4 className="font-bold text-slate-800 mb-6">User Info</h4>
                         <div className="space-y-6">
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                     <Wallet size={20} />
                                 </div>
                                 <div className="min-w-0">
                                     <p className="text-xs font-bold text-slate-400 uppercase">Shop Name</p>
                                     <p className="text-sm font-bold text-slate-800 truncate">{user.shopName}</p>
                                 </div>
                             </div>
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                     <Phone size={20} />
                                 </div>
                                 <div className="min-w-0">
                                     <p className="text-xs font-bold text-slate-400 uppercase">Phone</p>
                                     <p className="text-sm font-bold text-slate-800 truncate">{user.phone || 'Not Provided'}</p>
                                 </div>
                             </div>
                             <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                     <Mail size={20} />
                                 </div>
                                 <div className="min-w-0">
                                     <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                                     <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>

             {/* Modals */}
             <AnimatePresence>
                 {isTxModalOpen && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTxModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
                             <h3 className="text-2xl font-bold text-slate-800 mb-8">{editingTxId ? 'Edit' : 'Add'} Ledger Entry</h3>
                             <form onSubmit={handleAddOrUpdateTransaction} className="space-y-5">
                                 <div className="flex bg-slate-100 p-1 rounded-xl">
                                     <button 
                                         type="button" 
                                         onClick={() => setTxForm({...txForm, type: 'debit'})}
                                         className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${txForm.type === 'debit' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                                     >
                                         Debit (Charge)
                                     </button>
                                     <button 
                                         type="button"
                                         onClick={() => setTxForm({...txForm, type: 'credit'})}
                                         className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${txForm.type === 'credit' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
                                     >
                                         Credit (Payment)
                                     </button>
                                 </div>
                                 <div>
                                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Product / Item Name</label>
                                     <input 
                                         type="text" 
                                         value={txForm.productName} 
                                         onChange={(e) => {
                                             setTxForm({...txForm, productName: e.target.value});
                                             if (txErrors.productName) setTxErrors({...txErrors, productName: null});
                                         }} 
                                         className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${
                                             txErrors.productName ? 'border-danger ring-2 ring-danger/10' : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                         }`}
                                         placeholder="Product name..." 
                                     />
                                     {txErrors.productName && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{txErrors.productName}</p>}
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                                         <input 
                                             type="number" 
                                             value={txForm.quantity} 
                                             onChange={(e) => {
                                                 setTxForm({...txForm, quantity: e.target.value});
                                                 if (txErrors.quantity) setTxErrors({...txErrors, quantity: null});
                                             }} 
                                             className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${
                                                 txErrors.quantity ? 'border-danger ring-2 ring-danger/10' : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                             }`}
                                         />
                                         {txErrors.quantity && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{txErrors.quantity}</p>}
                                     </div>
                                     <div>
                                         <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Price per Item ($)</label>
                                         <input 
                                             type="number" 
                                             value={txForm.price} 
                                             onChange={(e) => {
                                                 setTxForm({...txForm, price: e.target.value});
                                                 if (txErrors.price) setTxErrors({...txErrors, price: null});
                                             }} 
                                             className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${
                                                 txErrors.price ? 'border-danger ring-2 ring-danger/10' : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                             }`}
                                         />
                                         {txErrors.price && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{txErrors.price}</p>}
                                     </div>
                                 </div>
                                 
                                 <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
                                     <span className="text-xs font-bold text-primary/60 uppercase">Total Amount</span>
                                     <span className="text-xl font-black text-primary">${(Number(txForm.quantity || 0) * Number(txForm.price || 0)).toLocaleString()}</span>
                                 </div>
 
                                 <div>
                                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Note / Reference</label>
                                     <input 
                                         type="text" 
                                         value={txForm.note} 
                                         onChange={(e) => {
                                             setTxForm({...txForm, note: e.target.value});
                                             if (txErrors.note) setTxErrors({...txErrors, note: null});
                                         }} 
                                         className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${
                                             txErrors.note ? 'border-danger ring-2 ring-danger/10' : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                         }`}
                                         placeholder="Transaction details..." 
                                     />
                                     {txErrors.note && <p className="text-danger text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">{txErrors.note}</p>}
                                 </div>
                                 <div>
                                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Date</label>
                                     <input type="date" value={txForm.date} onChange={(e) => setTxForm({...txForm, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
                                 </div>
                                 <button 
                                     type="submit" 
                                     disabled={submittingTx}
                                     className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                                 >
                                     {submittingTx ? <Loader2 className="animate-spin" /> : (editingTxId ? 'Update Entry' : 'Add Entry')}
                                 </button>
                             </form>
                        </motion.div>
                    </div>
                )}

                {isBalanceModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBalanceModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-sm rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Update Prev. Balance</h3>
                            <form onSubmit={handleUpdateBalance} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Balance Amount ($)</label>
                                    <input type="number" required value={prevBalance} onChange={(e) => setPrevBalance(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all">Update Balance</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default UserDetails;
