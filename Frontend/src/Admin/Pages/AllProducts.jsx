import React, { useState, useEffect, useContext } from "react";
import { useAdmin } from "../../PrivateRouter/AdminContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast, Toaster } from "react-hot-toast";
import { FaRupeeSign } from "react-icons/fa";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiBox,
    FiGrid,
    FiList,
    FiChevronRight,
    FiPackage,
    FiLayout,
    FiDatabase
} from "react-icons/fi";

const AllProducts = () => {
    const navigate = useNavigate();
    const { productsCache, setProductsCached } = useAdmin();

    const [searchTerm, setSearchTerm] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const currentCacheKey = JSON.stringify({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: showLowStockOnly ? "Low Stock" : "All"
    });

    const pageData = productsCache[currentCacheKey];
    const [products, setProducts] = useState(pageData?.products || []);
    const [loading, setLoading] = useState(!pageData);
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

    // Stock Update Modal State
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newStock, setNewStock] = useState("");
    const [updatingStock, setUpdatingStock] = useState(false);

    const [pagination, setPagination] = useState(pageData?.pagination || { total: 0, totalPages: 1 });
    const [stats, setStats] = useState(pageData?.stats || { total: 0, active: 0, lowStock: 0, outOfStock: 0 });

    // Rapid Add Modal
    const [isRapidAddOpen, setIsRapidAddOpen] = useState(false);
    const [rapidSaving, setRapidSaving] = useState(false);
    const [rapidProd, setRapidProd] = useState({ name: "", mrp: "", status: "Active" });

    const handleRapidAdd = async (e, shouldContinue = false) => {
        if (e) e.preventDefault();
        if (!rapidProd.name || !rapidProd.mrp) return toast.error("Essentials missing!");

        setRapidSaving(true);
        try {
            await api.post("/products", {
                ...rapidProd,
                category: "Groceries",
                total_stock: "0",
                variants: []
            });
            toast.success("Boutique addition live!");
            if (shouldContinue) {
                setRapidProd({ name: "", mrp: "", status: "Active" });
            } else {
                setIsRapidAddOpen(false);
                setRapidProd({ name: "", mrp: "", status: "Active" });
            }
            fetchProducts();
        } catch (error) {
            toast.error("Process failed.");
        } finally {
            setRapidSaving(false);
        }
    };

    const fetchProducts = async () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
            status: showLowStockOnly ? "Low Stock" : "All"
        };
        const cacheKey = JSON.stringify(params);
        if (!productsCache[cacheKey]) setLoading(true);

        try {
            const response = await api.get("/products", { params });
            const data = response.data;
            let finalData = {};
            if (Array.isArray(data)) {
                const computeStats = (arr) => ({
                    total: arr.length,
                    active: arr.filter(p => (p.status || "Active") === "Active").length,
                    lowStock: arr.filter(p => {
                        const s = p.total_stock ?? p.stock ?? 0;
                        return s > 0 && s < 10;
                    }).length,
                    outOfStock: arr.filter(p => (p.total_stock ?? p.stock ?? 0) <= 0).length,
                });
                finalData = {
                    products: data,
                    pagination: { total: data.length, totalPages: 1 },
                    stats: computeStats(data)
                };
            } else {
                finalData = {
                    products: Array.isArray(data.products) ? data.products : [],
                    pagination: data.pagination || { total: 0, totalPages: 1 },
                    stats: data.stats || { total: 0, active: 0, lowStock: 0, outOfStock: 0 }
                };
            }
            setProducts(finalData.products);
            setPagination(finalData.pagination);
            setStats(finalData.stats);
            setProductsCached(prev => ({ ...prev, [cacheKey]: finalData }));
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timeout);
    }, [currentPage, searchTerm, showLowStockOnly]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product removed from vault.");
            fetchProducts();
        } catch (error) {
            toast.error("Deletion failed.");
            console.error("Error deleting product:", error);
        }
    };

    const handleStockUpdate = async (e) => {
        e.preventDefault();
        if (!currentProduct || newStock === "") return;

        setUpdatingStock(true);
        try {
            // Send partial update - most backends handle this if we send just what changed, 
            // but for ours we might need to send all or use a specific endpoint.
            // Assuming current backend needs a full update based on our previous look.
            const updatedProduct = { ...currentProduct, total_stock: parseInt(newStock) };
            await api.put(`/products/${currentProduct.id}`, updatedProduct);

            toast.success("Stock updated instantly!");
            setProducts(products.map(p => p.id === currentProduct.id ? { ...p, total_stock: parseInt(newStock), status: parseInt(newStock) === 0 ? 'Out of Stock' : parseInt(newStock) < 10 ? 'Low Stock' : 'Active' } : p));
            setCurrentProduct(null);
        } catch (error) {
            toast.error("Failed to update stock");
        } finally {
            setUpdatingStock(false);
        }
    };


    const getStatusStyle = (status) => {
        switch (status) {
            case "Active": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Low Stock": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Out of Stock": return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    // Simplified Pagination (Handled by backend)
    const totalPages = pagination.totalPages;
    const currentItems = products;

    // Reset to page 1 when search/filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, showLowStockOnly]);

    const getProductImage = (product) => {
        let imgUrl = null;
        try {
            const processUrl = (url) => {
                if (!url || typeof url !== 'string') return null;
                if (url.startsWith('http') || url.startsWith('data:')) return url;
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                const cleanPath = url.startsWith('/') ? url : `/${url}`;
                return `${backendUrl}${cleanPath}`;
            };

            // 1. Try thumbnail first
            if (product.thumbnail_image) {
                imgUrl = product.thumbnail_image;
            }

            // 2. Try product_images array
            if (!imgUrl && product.product_images) {
                const imgs = typeof product.product_images === 'string' ? JSON.parse(product.product_images) : product.product_images;
                if (Array.isArray(imgs) && imgs.length > 0) imgUrl = imgs[0];
            }

            const finalUrl = processUrl(imgUrl);
            if (finalUrl) return finalUrl;
        } catch (e) {
            console.error("Error getting product image:", e);
        }

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'P')}&background=random`;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen pb-20">

            

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading products...</p>
                </div>
            ) : (
                <>
                    {/* ── Premium Stats Cards ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                label: "Total Products",
                                value: stats.total,
                                sub: "In catalog",
                                icon: <FiBox size={20} />,
                                gradient: "from-blue-500 to-blue-600",
                                ring: "ring-blue-100",
                                pct: 100,
                                barColor: "bg-blue-400"
                            },
                            {
                                label: "Active",
                                value: stats.active,
                                sub: stats.total > 0 ? `${Math.round((stats.active/stats.total)*100)}% of catalog` : "0%",
                                icon: <FiCheckCircle size={20} />,
                                gradient: "from-emerald-500 to-emerald-600",
                                ring: "ring-emerald-100",
                                pct: stats.total > 0 ? (stats.active/stats.total)*100 : 0,
                                barColor: "bg-emerald-400"
                            },
                            {
                                label: "Low Stock",
                                value: stats.lowStock,
                                sub: "Need restocking",
                                icon: <FiAlertCircle size={20} />,
                                gradient: "from-amber-400 to-amber-500",
                                ring: "ring-amber-100",
                                pct: stats.total > 0 ? (stats.lowStock/stats.total)*100 : 0,
                                barColor: "bg-amber-400"
                            },
                            {
                                label: "Out of Stock",
                                value: stats.outOfStock,
                                sub: "Urgent attention",
                                icon: <FiXCircle size={20} />,
                                gradient: "from-rose-500 to-rose-600",
                                ring: "ring-rose-100",
                                pct: stats.total > 0 ? (stats.outOfStock/stats.total)*100 : 0,
                                barColor: "bg-rose-400"
                            },
                        ].map((stat, i) => (
                            <div key={i} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                                <div className="p-5 md:p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ring-4 ${stat.ring} group-hover:scale-110 transition-transform duration-300`}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                                            {stat.pct.toFixed(0)}%
                                        </span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-800 leading-none tabular-nums">{stat.value}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
                                    <p className="text-[10px] text-gray-300 font-bold mt-0.5">{stat.sub}</p>
                                </div>
                                {/* Progress bar at bottom */}
                                <div className="h-1 bg-gray-50">
                                    <div className={`h-full ${stat.barColor} transition-all duration-700 rounded-full`} style={{width: `${stat.pct}%`}} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Controls ── */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full md:max-w-lg group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={16}/>
                            <input
                                type="text"
                                placeholder="Search products by name, SKU or code..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all text-xs font-bold text-slate-700 placeholder:text-gray-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                            <button
                                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                    showLowStockOnly
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100'
                                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-white hover:text-slate-700'
                                }`}
                            >
                                <FiFilter size={13}/> {showLowStockOnly ? "Low Stock" : "All"}
                            </button>
                            <select className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none hover:bg-white hover:border-gray-200 transition-all cursor-pointer whitespace-nowrap">
                                <option>Newest First</option>
                                <option>Price: Low → High</option>
                                <option>Price: High → Low</option>
                                <option>Stock: Low → High</option>
                            </select>
                        </div>
                         <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-all text-sm ${viewMode === "table" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-slate-600"}`}>
                            <FiList size={16}/>
                        </button>
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all text-sm ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-slate-600"}`}>
                            <FiGrid size={16}/>
                        </button>
                    </div>
                    <button
                        onClick={() => navigate("/admin/products/add")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <FiPlus size={14}/> New Product
                    </button>
                </div>
                    </div>

                    {viewMode === "table" ? (
                        /* Modern Table View */
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse block md:table">
                                    <thead className="hidden md:table-header-group">
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Name</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stock Count</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="block md:table-row-group md:divide-y divide-gray-50/50 p-4 md:p-0">
                                        {currentItems.map((product) => (
                                            <tr key={product.id} className="hover:bg-blue-50/20 transition-colors group block md:table-row bg-white md:bg-transparent border border-gray-100 md:border-0 rounded-2xl md:rounded-none mb-4 md:mb-0 shadow-sm md:shadow-none">
                                                <td className="px-4 py-5 md:px-8 md:py-6 block md:table-cell border-b border-gray-50 md:border-b-0">
                                                    <div className="flex flex-col md:block w-full gap-3 md:gap-0">
                                                        <span className="md:hidden text-[11px] font-black text-gray-400 uppercase tracking-widest">Product Name</span>
                                                        <div className="flex items-center gap-4 md:gap-5 text-left w-full min-w-0">
                                                            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                                 <img
                                                                    src={getProductImage(product)}
                                                                    alt={product.name}
                                                                    loading="lazy"
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Image'}
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1 md:flex-none">
                                                                <p className="text-sm font-black text-slate-800 break-words whitespace-normal leading-tight md:truncate md:whitespace-nowrap md:max-w-[200px] lg:max-w-xs">{product.name}</p>
                                                                <div className="flex flex-wrap md:flex-nowrap items-center justify-start gap-2 mt-1.5">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                                        {product.product_code || `PRD-${product.id}`}
                                                                    </span>
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                                                                        {product.category}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 md:px-8 md:py-6 block md:table-cell border-b border-gray-50 md:border-b-0">
                                                    <div className="flex flex-col md:block w-full gap-3 md:gap-0">
                                                        <span className="md:hidden text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                                                        <div>
                                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(product.status)}`}>
                                                                {product.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 md:px-8 md:py-6 block md:table-cell border-b border-gray-50 md:border-b-0">
                                                    <div className="flex flex-col md:block w-full gap-3 md:gap-0">
                                                        <span className="md:hidden text-[11px] font-black text-gray-400 uppercase tracking-widest">Stock Count</span>
                                                        <div className="flex items-center justify-start gap-2 cursor-pointer group/stock" onClick={() => { setCurrentProduct(product); setNewStock(product.total_stock || "0"); }}>
                                                            <FiPackage className="text-gray-300 group-hover/stock:text-blue-500 transition-colors" size={14} />
                                                            <span className="text-sm font-black text-slate-700 underline decoration-dotted decoration-gray-200 group-hover/stock:text-blue-600 transition-colors">{product.total_stock ?? product.stock ?? 0}</span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Units</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 md:px-8 md:py-6 block md:table-cell border-b border-gray-50 md:border-b-0">
                                                    <div className="flex flex-col md:block w-full gap-3 md:gap-0">
                                                        <span className="md:hidden text-[11px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-base font-black text-slate-800 tracking-tighter">₹{parseFloat(product.offer_price || product.discount_price || 0).toLocaleString()}</span>
                                                            <span className="text-[10px] text-gray-400 line-through font-bold">MRP: ₹{parseFloat(product.mrp || 0).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 md:px-8 md:py-6 block md:table-cell text-left md:text-right">
                                                    <div className="flex flex-col md:block w-full gap-3 md:gap-0">
                                                        <span className="md:hidden text-[11px] font-black text-gray-400 uppercase tracking-widest">Actions</span>
                                                        <div className="flex items-center justify-start md:justify-end gap-3">
                                                            <Link
                                                                to={`/admin/products/${product.id}`}
                                                                className="p-3 border border-gray-200 text-gray-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm md:shadow-none"
                                                                title="View Product"
                                                            >
                                                                <FiEye size={18} />
                                                            </Link>
                                                            <Link
                                                                to={`/admin/products/edit/${product.id}`}
                                                                className="p-3 border border-gray-200 text-gray-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm md:shadow-none"
                                                                title="Edit Product"
                                                            >
                                                                <FiEdit2 size={18} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="p-3 border border-gray-200 text-gray-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm md:shadow-none"
                                                                title="Delete Product"
                                                            >
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Premium Grid View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentItems.map((product) => {
                                const stock = product.total_stock ?? product.stock ?? 0;
                                const mrp = parseFloat(product.mrp || 0);
                                const price = parseFloat(product.offer_price || product.selling_price || 0);
                                const discount = mrp > 0 && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
                                const stockPct = Math.min((stock / 50) * 100, 100);
                                const stockColor = stock <= 0 ? "bg-rose-500" : stock < 10 ? "bg-amber-400" : "bg-emerald-500";

                                return (
                                    <div key={product.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

                                        {/* Image */}
                                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100" style={{aspectRatio:"4/5"}}>
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=f1f5f9&color=94a3b8&size=400`}
                                            />

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                            {/* Top badges */}
                                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                                {/* Category pill */}
                                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/90 backdrop-blur text-slate-700 border border-white/50 shadow-sm truncate max-w-[120px]">
                                                    {product.category || "General"}
                                                </span>
                                                {/* Discount badge */}
                                                {discount > 0 && (
                                                    <span className="px-2.5 py-1 rounded-xl text-[9px] font-black bg-rose-500 text-white shadow-lg">
                                                        -{discount}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Hover actions */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                <Link to={`/admin/products/${product.id}`} className="w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 shadow-lg border border-white/50 transition-colors" title="View">
                                                    <FiEye size={15} />
                                                </Link>
                                                <Link to={`/admin/products/edit/${product.id}`} className="w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-slate-600 hover:text-emerald-600 shadow-lg border border-white/50 transition-colors" title="Edit">
                                                    <FiEdit2 size={15} />
                                                </Link>
                                                <button onClick={() => handleDelete(product.id)} className="w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-lg border border-white/50 transition-colors" title="Delete">
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>

                                            {/* Bottom: Name + Price over image */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <h4 className="text-sm font-black text-white leading-tight line-clamp-2 drop-shadow-sm">{product.name}</h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-base font-black text-white drop-shadow-sm">
                                                        {price > 0 ? `₹${price.toLocaleString()}` : "—"}
                                                    </span>
                                                    {mrp > 0 && mrp !== price && (
                                                        <span className="text-[10px] text-white/60 line-through font-bold">₹{mrp.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="p-4 flex flex-col gap-3">
                                            {/* SKU row */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                                    {product.product_code || `#${product.id}`}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getStatusStyle(product.status)}`}>
                                                    {product.status || "Active"}
                                                </span>
                                            </div>

                                            {/* Stock bar */}
                                            <div
                                                className="cursor-pointer group/stock"
                                                onClick={() => { setCurrentProduct(product); setNewStock(stock || "0"); }}
                                            >
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Stock</span>
                                                    <span className="text-[10px] font-black text-slate-600 group-hover/stock:text-blue-600 transition-colors underline decoration-dotted">{stock} units</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${stockColor} rounded-full transition-all duration-700`} style={{width:`${stockPct}%`}} />
                                                </div>
                                            </div>

                                            {/* Actions row */}
                                            <div className="flex gap-2 pt-1">
                                                <Link
                                                    to={`/admin/products/${product.id}`}
                                                    className="flex-1 py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl border border-gray-100 hover:border-blue-600 transition-all"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/admin/products/edit/${product.id}`}
                                                    className="flex-1 py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 bg-gray-50 hover:bg-emerald-600 hover:text-white rounded-xl border border-gray-100 hover:border-emerald-600 transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-gray-50 hover:bg-rose-600 hover:text-white rounded-xl border border-gray-100 hover:border-rose-600 transition-all"
                                                >
                                                    <FiTrash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                {/* Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} Items */}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    Prev
                                </button>
                                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] md:max-w-none hide-scrollbar">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`min-w-[40px] h-10 rounded-xl text-[10px] font-black transition-all border shrink-0 ${currentPage === i + 1 ? "bg-slate-900 border-slate-900 text-white shadow-xl" : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {currentItems.length === 0 && (
                        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                                <FiBox size={40} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Match Found</p>
                            <p className="text-slate-300 font-bold text-[10px] mt-2 italic px-8">"{searchTerm}" did not return any inventory records.</p>
                        </div>
                    )}


                </>
            )}

            {/* QUICK STOCK UPDATE MODAL */}
            {currentProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCurrentProduct(null)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10"><FiPackage size={80} /></div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight truncate">{currentProduct.name}</h2>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">AJAX Stock Controller</p>
                        </div>

                        <form onSubmit={handleStockUpdate} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Inventory</span>
                                    <span className="text-lg font-black text-slate-800">{currentProduct.total_stock} Units</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Stock Level</label>
                                    <input
                                        autoFocus
                                        type="number"
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl outline-none font-bold text-slate-800 transition-all text-2xl text-center"
                                        placeholder="0"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updatingStock}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                            >
                                {updatingStock ? <div className="w-4 h-4 border-2 border-t-white rounded-full animate-spin"></div> : "Sync Stock Record"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setCurrentProduct(null)}
                                className="w-full py-2 text-[10px] font-black text-gray-400 hover:text-slate-800 uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* RAPID PRODUCT ADD MODAL */}
            {isRapidAddOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsRapidAddOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10"><FiBox size={80} /></div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight">Rapid Addition</h2>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Instant AJAX Listing</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl outline-none font-bold text-slate-800 transition-all"
                                        placeholder="e.g. Traditional Silk"
                                        value={rapidProd.name}
                                        onChange={(e) => setRapidProd({ ...rapidProd, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (MRP)</label>
                                    <div className="relative">
                                        <FaRupeeSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl outline-none font-bold text-slate-800 transition-all"
                                            placeholder="2999"
                                            value={rapidProd.mrp}
                                            onChange={(e) => setRapidProd({ ...rapidProd, mrp: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={(e) => handleRapidAdd(e, true)}
                                    disabled={rapidSaving}
                                    className="w-full py-5 bg-white border-2 border-blue-100 hover:bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    List & Add Another
                                </button>
                                <button
                                    onClick={(e) => handleRapidAdd(e, false)}
                                    disabled={rapidSaving}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                                >
                                    {rapidSaving ? <div className="w-4 h-4 border-2 border-t-white rounded-full animate-spin"></div> : "Save & Close"}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsRapidAddOpen(false)}
                                className="w-full py-2 text-[10px] font-black text-gray-400 hover:text-slate-800 uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// SVG Helper Components
const FiCheckCircle = () => <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
const FiAlertCircle = () => <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
const FiXCircle = () => <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>

export default AllProducts;
