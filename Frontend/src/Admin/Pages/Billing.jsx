import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
    FiDownload,
    FiFilter,
    FiSearch,
    FiMoreVertical,
    FiCreditCard,
    FiFileText,
    FiTrendingUp,
    FiPlus
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

const Billing = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders");
                // Only show shop bills
                const shopOrders = (res.data || []).filter(order => !order.order_type || order.order_type === 'Shop');
                setInvoices(shopOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Paid": return "bg-emerald-100 text-emerald-700";
            case "Delivered": return "bg-blue-100 text-blue-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Overdue": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Shop Bills</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage all bills created in-store</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <FiFileText /> Generate Report
                    </button>
                    <button 
                        onClick={() => navigate("/admin/billing/create")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100">
                        <FiPlus /> New Bill
                    </button>
                </div>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Total Revenue</p>
                        <h2 className="text-4xl font-black text-slate-800">₹128,430</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <FiTrendingUp /> ↑ 12% from last month
                    </div>
                </div>
                <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-100 flex flex-col justify-between text-white">
                    <div>
                        <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-4">Pending Payouts</p>
                        <h2 className="text-4xl font-black">₹12,850</h2>
                    </div>
                    <p className="mt-6 text-xs font-bold opacity-80 uppercase tracking-widest">Available to withdraw</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Unpaid Invoices</p>
                        <h2 className="text-4xl font-black text-slate-800">14</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-red-500 font-bold text-sm">
                        Total ₹3,420 overdue
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-slate-800">Recent Invoices</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Invoice ID..."
                                className="pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm w-full md:w-64"
                            />
                        </div>
                        <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-500 rounded-xl border border-gray-100 transition-all">
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-10 font-bold text-gray-400">Loading bills...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 font-bold text-gray-400">No shop bills found</td></tr>
                            ) : invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-slate-800">{inv.order_id}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 font-bold text-slate-700">{inv.customer_name}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <FiCreditCard /> {inv.payment_method || 'Cash'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(inv.status)}`}>
                                            {inv.status || 'Paid'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-800">₹{parseFloat(inv.total_amount).toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all" title="Download">
                                                <FiDownload size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all">
                                                <FiMoreVertical size={16} />
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
    );
};

export default Billing;
