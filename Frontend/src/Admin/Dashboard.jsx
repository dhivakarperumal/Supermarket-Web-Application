import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../PrivateRouter/AuthContext";
import { useAdmin } from "../PrivateRouter/AdminContext";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
    TrendingUp, TrendingDown, ShoppingCart, Users, Package,
    AlertTriangle, BarChart2, ChevronDown, ArrowRight,
    Calendar, RefreshCw, DollarSign, ShoppingBag, Star,
    Truck, RotateCcw, UserPlus, Clock, Trophy
} from "lucide-react";

/* ─────────────── helpers ─────────────── */
const fmtINR = (v) => {
    const n = parseFloat(String(v ?? 0).replace(/[^0-9.]/g, ""));
    if (isNaN(n)) return String(v);
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const StatusBadge = ({ s }) => {
    const m = {
        Delivered: "bg-green-100 text-green-700",
        Processing: "bg-orange-100 text-orange-700",
        Shipped: "bg-blue-100 text-blue-700",
        Shipping: "bg-blue-100 text-blue-700",
        "Out for Delivery": "bg-cyan-100 text-cyan-700",
        "Order Placed": "bg-yellow-100 text-yellow-700",
        Cancelled: "bg-red-100 text-red-700",
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${m[s] ?? "bg-gray-100 text-gray-600"}`}>{s}</span>;
};

/* ─────────────── SVG LINE CHART ─────────────── */
const LineChart = ({ data }) => {
    const W = 600, H = 140;
    const vals = data.map(d => d.revenue ?? d.value ?? 0);
    const max = Math.max(...vals, 1);
    const pts = vals.map((v, i) => ({
        x: vals.length > 1 ? (i / (vals.length - 1)) * W : W / 2,
        y: H - (v / max) * (H - 20) - 4,
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${line} L${pts[pts.length - 1].x},${H} L0,${H} Z`;
    // dashed "last week" - slightly lower
    const pts2 = pts.map(p => ({ x: p.x, y: Math.min(H, p.y + 18) }));
    const line2 = pts2.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a8b28" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3a8b28" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1={0} x2={W} y1={H - t * (H - 20) - 4} y2={H - t * (H - 20) - 4}
                    stroke="#f0f0f0" strokeWidth="1" />
            ))}
            <path d={area} fill="url(#gr)" />
            <path d={line2} fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
            <path d={line} fill="none" stroke="#3a8b28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3a8b28" stroke="#fff" strokeWidth="2" />
            ))}
        </svg>
    );
};

/* ─────────────── SVG DONUT ─────────────── */
const Donut = ({ segments, center, sub, size = 160 }) => {
    const colors = ["#3a8b28", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
    const R = 52, C = 2 * Math.PI * R;
    let off = 0;
    return (
        <svg width={size} height={size} viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={R} fill="none" stroke="#f3f4f6" strokeWidth="22" />
            {segments.map((seg, i) => {
                const dash = (seg.pct / 100) * C;
                const el = (
                    <circle key={i} cx="80" cy="80" r={R} fill="none"
                        stroke={colors[i % colors.length]} strokeWidth="22"
                        strokeDasharray={`${dash} ${C - dash}`}
                        strokeDashoffset={-off}
                        style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px" }}
                    />
                );
                off += dash;
                return el;
            })}
            <text x="80" y="75" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1e293b">{center}</text>
            {sub && <text x="80" y="93" textAnchor="middle" fontSize="10" fill="#94a3b8">{sub}</text>}
        </svg>
    );
};

/* ─────────────── SAMPLE DATA ─────────────── */
const SAMPLE_TOP = [
    { name: "Fortune Sunflower Oil 1L", price: "₹135.00", sold: 248 },
    { name: "Aashirvaad Atta 5kg", price: "₹275.00", sold: 186 },
    { name: "Tata Tea Premium 1kg", price: "₹230.00", sold: 162 },
    { name: "Amul Milk 1L", price: "₹60.00", sold: 145 },
    { name: "India Gate Basmati Rice 1kg", price: "₹120.00", sold: 130 },
];
const SAMPLE_LOW = [
    { name: "Maggi 2-Min Noodles", stock: 5 },
    { name: "Sugar 1kg", stock: 8 },
    { name: "Surf Excel 1kg", stock: 3 },
    { name: "Colgate Toothpaste 100g", stock: 7 },
];
const SAMPLE_ORDERS = [
    { id: "#ORD-1250", date: "May 30, 2025", customer: "John Dee", amount: "₹1,250.00", status: "Delivered" },
    { id: "#ORD-1249", date: "May 30, 2025", customer: "Priya Sharma", amount: "₹980.00", status: "Processing" },
    { id: "#ORD-1248", date: "May 30, 2025", customer: "Rahul Verma", amount: "₹1,650.00", status: "Shipped" },
    { id: "#ORD-1247", date: "May 30, 2025", customer: "Sneha Patel", amount: "₹750.00", status: "Cancelled" },
];
const SAMPLE_CAT = [
    { name: "Grocery", rev: "₹58,256.50", pct: 39.3 },
    { name: "Beverages", rev: "₹28,450.00", pct: 19.2 },
    { name: "Dairy & Eggs", rev: "₹24,850.00", pct: 16.8 },
    { name: "Snacks", rev: "₹20,300.00", pct: 13.7 },
    { name: "Others", rev: "₹16,400.00", pct: 11.0 },
];
const SAMPLE_TRENDS = [20000, 35000, 18000, 45000, 32000, 48000, 50000].map((v, i) => ({ revenue: v, month: ["May 24", "May 25", "May 26", "May 27", "May 28", "May 29", "May 30"][i] }));
const segColors = ["#3a8b28", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const catDots = ["bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-orange-500", "bg-purple-500"];

/* ═══════════════════════════════════════ COMPONENT ═══════════════════════════════════════ */
const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { dashboardData, setDashboardCached } = useAdmin();
    const [loading, setLoading] = useState(!dashboardData);

    /* modals kept for backward compat */
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [catName, setCatName] = useState("");
    const [catSaving, setCatSaving] = useState(false);
    const [isProdModalOpen, setIsProdModalOpen] = useState(false);
    const [prodSaving, setProdSaving] = useState(false);
    const [rapidProd, setRapidProd] = useState({ name: "", mrp: "", status: "Active" });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        if (!dashboardData) setLoading(true);
        try {
            const res = await api.get("/dashboard");
            setDashboardCached(res.data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load dashboard");
        } finally { setLoading(false); }
    };

    const handleRapidProductAdd = async (e, cont = false) => {
        if (e) e.preventDefault();
        if (!rapidProd.name || !rapidProd.mrp) return toast.error("Name and MRP are required");
        setProdSaving(true);
        try {
            await api.post("/products", { ...rapidProd, category: "Groceries", total_stock: "0", variants: [] });
            toast.success("Product listed!");
            if (cont) setRapidProd({ name: "", mrp: "", status: "Active" });
            else { setIsProdModalOpen(false); setRapidProd({ name: "", mrp: "", status: "Active" }); }
            fetchData();
        } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
        finally { setProdSaving(false); }
    };

    const handleQuickCategoryAdd = async (e, cont = false) => {
        if (e) e.preventDefault();
        if (!catName) return toast.error("Category name required");
        setCatSaving(true);
        try {
            await api.post("/categories", { name: catName, images: [], subcategory: [] });
            toast.success("Category added!");
            if (cont) setCatName(""); else { setIsCatModalOpen(false); setCatName(""); }
        } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
        finally { setCatSaving(false); }
    };

    /* ── loading / no data ── */
    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#3a8b28]/20 border-t-[#3a8b28] rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-semibold">Loading Dashboard…</p>
            </div>
        </div>
    );

    /* resolved data */
    const stats = dashboardData?.stats ?? [];
    const recentOrders = dashboardData?.recentOrders ?? [];
    const topProducts = dashboardData?.topProducts ?? [];
    const lowStockAlerts = dashboardData?.lowStockAlerts ?? [];
    const categoryAnalytics = dashboardData?.categoryAnalytics ?? [];
    const revenueTrends = dashboardData?.revenueTrends?.length ? dashboardData.revenueTrends : SAMPLE_TRENDS;

    /* stat values */
    const totalSales = stats.find(s => s.label === "Total Revenue")?.value ?? "₹1,48,256.50";
    const totalOrders = stats.find(s => s.label === "Active Orders" || s.label === "Total Orders")?.value ?? 1248;
    const totalCustomers = stats.find(s => s.label === "Total Customers")?.value ?? 856;
    const totalProducts = stats.find(s => s.label === "Total Products")?.value ?? 1230;
    const lowStockCount = lowStockAlerts.length || stats.find(s => s.label === "Low Stock")?.value || 23;

    const orderNum = parseInt(String(totalOrders).replace(/,/g, "")) || 1248;
    const orderSegs = [
        { label: "Delivered", count: Math.round(orderNum * 0.522), pct: 52.2 },
        { label: "Processing", count: Math.round(orderNum * 0.25), pct: 25.0 },
        { label: "Shipped", count: Math.round(orderNum * 0.147), pct: 14.7 },
        { label: "Cancelled", count: Math.round(orderNum * 0.081), pct: 8.1 },
    ];

    const displayTop = topProducts.length ? topProducts.slice(0, 5) : SAMPLE_TOP;
    const displayLow = lowStockAlerts.length ? lowStockAlerts.slice(0, 4) : SAMPLE_LOW;
    const displayOrders = recentOrders.length ? recentOrders.slice(0, 4).map(o => ({
        id: o.id, date: o.date, customer: o.customer, amount: o.amount?.toString().replace("$", "₹"), status: o.status
    })) : SAMPLE_ORDERS;
    const displayCat = categoryAnalytics.length ? categoryAnalytics.slice(0, 5) : SAMPLE_CAT;

    /* ── RENDER ── */
    return (
        <div className="space-y-4 pb-10 font-sans text-gray-900">
            <Toaster position="top-right" />

            {/* ══ PAGE HEADER ══ */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="relative">
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        Hello, Admin! <span>👋</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Welcome back, <span className="text-[#3a8b28] font-bold">Admin!</span> Here's what's happening with your store today.
                    </p>
                </div>
                {/* <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm text-gray-600 font-semibold shadow-sm shrink-0 cursor-pointer hover:shadow-md transition-shadow">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    May 24 - May 30, 2025
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </div> */}
            </div>

            {/* ══ STAT CARDS ══ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                {/* Total Sales */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-green-600">Total Sales</span>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-lg font-black text-gray-900 leading-tight">{String(totalSales).replace("$", "₹")}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-[11px] font-bold text-green-500">12.5% vs last week</span>
                    </div>
                </div>
                {/* Total Orders */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600">Total Orders</span>
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-lg font-black text-gray-900">{String(totalOrders)}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-[11px] font-bold text-green-500">8.3% vs last week</span>
                    </div>
                </div>
                {/* Total Customers */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-purple-600">Total Customers</span>
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-md">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-lg font-black text-gray-900">{String(totalCustomers)}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-[11px] font-bold text-green-500">6.7% vs last week</span>
                    </div>
                </div>
                {/* Total Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-orange-600">Total Products</span>
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-md">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-lg font-black text-gray-900">{String(totalProducts)}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-[11px] font-bold text-red-400">4.3% vs last week</span>
                    </div>
                </div>
                {/* Low Stock */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-red-500">Low Stock Items</span>
                        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-md">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-lg font-black text-gray-900">{String(lowStockCount)}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-[11px] font-bold text-red-400">5.2% vs last week</span>
                    </div>
                </div>
            </div>

            {/* ══ ROW 2: Sales Overview | Orders Overview | Top Selling ══ */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

                {/* Sales Overview */}
                <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-gray-800">Sales Overview</h2>
                        <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-semibold hover:bg-gray-50">
                            This Week <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-5 mb-2 text-xs text-gray-500 font-semibold">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-5 h-0.5 bg-[#3a8b28] rounded" />
                            This Week
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-5 border-t border-dashed border-gray-400" />
                            Last Week
                        </span>
                    </div>
                    {/* Chart with Y axis */}
                    <div className="flex gap-2 items-stretch">
                        <div className="flex flex-col justify-between text-[9px] text-gray-400 font-bold shrink-0 py-1 text-right" style={{ height: 130 }}>
                            {["₹50k", "₹40k", "₹30k", "₹20k", "₹10k", "0"].map(l => <span key={l}>{l}</span>)}
                        </div>
                        <div className="flex-1" style={{ height: 130 }}>
                            <LineChart data={revenueTrends} />
                        </div>
                    </div>
                    {/* X axis */}
                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold mt-1 pl-8">
                        {["May 24", "May 25", "May 26", "May 27", "May 28", "May 29", "May 30"].map(d => <span key={d}>{d}</span>)}
                    </div>
                    {/* Bottom stats */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <BarChart2 className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">Total Sales</p>
                                <p className="text-sm font-black text-gray-800">{String(totalSales).replace("$", "₹")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                <RefreshCw className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold">Average Order Value</p>
                                <p className="text-sm font-black text-gray-800">₹1,186.53</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Overview */}
                <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-gray-800">Orders Overview</h2>
                        <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-semibold hover:bg-gray-50">
                            This Week <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex justify-center my-2">
                        <Donut segments={orderSegs} center={String(totalOrders)} sub="Total Orders" size={160} />
                    </div>
                    <div className="space-y-2 mt-2">
                        {orderSegs.map((seg, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: segColors[i] }} />
                                    <span className="text-gray-600 font-semibold">{seg.label}</span>
                                </div>
                                <span className="font-bold text-gray-700">{seg.count} <span className="text-gray-400 font-medium">({seg.pct}%)</span></span>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/orders/all" className="flex items-center gap-1 mt-4 text-xs text-[#3a8b28] font-bold hover:underline">
                        View all orders <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Top Selling Products */}
                <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-gray-800">Top Selling Products</h2>
                        <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-semibold hover:bg-gray-50">
                            This Week <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="space-y-3 flex-1">
                        {displayTop.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 overflow-hidden shrink-0 flex items-center justify-center">
                                    {item.img
                                        ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                        : <Package className="w-5 h-5 text-green-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-400">{item.price ?? item.rev?.toString().replace("$", "₹")}</p>
                                </div>
                                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 border border-green-100">
                                    {item.sold ?? item.sales} sold
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/products/all" className="flex items-center gap-1 mt-4 text-xs text-[#3a8b28] font-bold hover:underline">
                        View all products <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* ══ ROW 3: Low Stock | Recent Orders | Sales by Category ══ */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

                {/* Low Stock Alert */}
                <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-orange-500">Low Stock Alert</h2>
                        <button className="text-xs text-[#3a8b28] font-bold hover:underline">View all</button>
                    </div>
                    <div className="space-y-3">
                        {displayLow.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden shrink-0 flex items-center justify-center">
                                    {item.img
                                        ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                        : <Package className="w-5 h-5 text-orange-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-400">Current Stock: {item.stock ?? item.qty}</p>
                                </div>
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-lg shrink-0">
                                    Low Stock
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-gray-800">Recent Orders</h2>
                        <button className="text-xs text-[#3a8b28] font-bold hover:underline">View all</button>
                    </div>
                    <div className="space-y-0">
                        {displayOrders.map((o, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                                <div className="min-w-0 w-28">
                                    <p className="text-xs font-bold text-gray-700">{o.id}</p>
                                    <p className="text-[10px] text-gray-400">{o.date}</p>
                                </div>
                                <p className="text-xs font-semibold text-gray-700 flex-1 truncate">{o.customer}</p>
                                <p className="text-xs font-black text-gray-800 shrink-0">{o.amount}</p>
                                <div className="shrink-0">
                                    <StatusBadge s={o.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-gray-800">Sales by Category</h2>
                        <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-semibold hover:bg-gray-50">
                            This Week <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="shrink-0">
                            <Donut
                                segments={displayCat.map((c, i) => ({ pct: c.pct }))}
                                center="₹1,48,256"
                                sub="Total Sales"
                                size={130}
                            />
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                            {displayCat.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${catDots[i]}`} />
                                        <span className="text-[11px] text-gray-600 font-semibold truncate">{cat.name}</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] font-bold text-gray-700">{cat.rev?.toString().replace("$", "₹")}</span>
                                        <span className="text-[10px] text-gray-400 ml-1">({cat.pct}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link to="/admin/reports" className="flex items-center gap-1 mt-4 text-xs text-[#3a8b28] font-bold hover:underline">
                        View full report <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* ══ BOTTOM STATS BAR ══ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold">Today's Sales</p>
                            <p className="text-sm font-black text-gray-800">₹24,568.00</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-100" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold">Today's Orders</p>
                            <p className="text-sm font-black text-gray-800">198</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-100" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold">New Customers</p>
                            <p className="text-sm font-black text-gray-800">32</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-100" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold">Pending Orders</p>
                            <p className="text-sm font-black text-gray-800">14</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-100" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold">Return Orders</p>
                            <p className="text-sm font-black text-gray-800">5</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2.5 border border-green-100 ml-auto">
                        <div>
                            <p className="text-sm font-black text-gray-800 flex items-center gap-1">Great Job! 🏆</p>
                            <p className="text-[10px] text-gray-500 font-semibold">You're doing great today!</p>
                        </div>
                        <span className="text-3xl">🌿</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
