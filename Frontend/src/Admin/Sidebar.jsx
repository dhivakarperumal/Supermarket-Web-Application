import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Tag,
  PlusCircle,
  List,
  Layers,
  Truck,
  XCircle,
  Archive,
  Handshake,
  Video,
  Image,
  Headphones,
  Settings,
  Gift,
  Star,
  CreditCard,
} from "lucide-react";

import { useAuth } from "../PrivateRouter/AuthContext";

import basketImage from "../../public/basket.png"

/* ================= NAV ITEMS ================= */
const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },

  {
    label: "Products",
    icon: Package,
    children: [
      { path: "/admin/products/all", label: "All Products", icon: List },
      { path: "/admin/products/add", label: "Add New Product", icon: PlusCircle },
      { path: "/admin/products/category", label: "Categories", icon: Layers },
      { path: "/admin/products/stock", label: "Inventory", icon: Archive },
    ],
  },

 

  {
    label: "Orders",
    icon: ShoppingCart,
    children: [
      { path: "/admin/orders/new", label: "New Orders", icon: List },
      { path: "/admin/orders/all", label: "All Orders", icon: Archive },
      { path: "/admin/orders/delivery", label: "Delivery Orders", icon: Truck },
      { path: "/admin/orders/cancelled", label: "Cancelled Orders", icon: XCircle },
    ],
  },

  { path: "/admin/users/all", label: "Customers", icon: Users },

  { path: "/admin/billing", label: "Billing", icon: CreditCard },

  {
    label: "Dealer",
    icon: Handshake,
    children: [
      { path: "/admin/dealer", label: "Dashboard", icon: LayoutDashboard },
      { path: "/admin/dealer/all", label: "All Dealers", icon: List },
      // { path: "/admin/dealer/add", label: "Add Dealer", icon: PlusCircle },
      
    ],
  },

  { path: "/admin/banners", label: "Offers & Discounts", icon: Gift },
  { path: "/admin/coupons", label: "Coupons", icon: Tag },
  { path: "/admin/delivery-charges", label: "Delivery Charges", icon: Truck },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
  // { path: "/admin/banners", label: "Banners", icon: Image },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/videos", label: "Videos Management", icon: Video },
];

/* ================= SIDEBAR ================= */
const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { profileName } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(() => {
    // Auto-open relevant submenu on load
    for (const item of navItems) {
      if (item.children) {
        if (item.children.some(c => location.pathname === c.path || location.pathname.startsWith(c.path + "/"))) {
          return item.label;
        }
      }
    }
    return null;
  });

  /* ================= HELPERS ================= */
  const isActiveRoute = (item) => {
    const p = location.pathname;
    if (item.path === "/" || item.path === "/admin" || item.exact) return p === item.path;
    if (item.children) return item.children.some(c => p === c.path || p.startsWith(c.path + "/"));
    if (item.path) return p === item.path || p.startsWith(item.path + "/");
    return false;
  };

  const toggleMenu = (label) => {
    setOpenMenu(prev => prev === label ? null : label);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full
          flex flex-col
          bg-[#042f1a] border-r border-[#042f1a]
          transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "w-20" : "w-76"}
          shadow-[4px_0_20px_rgba(0,0,0,0.2)]
        `}
      >
        {/* ===== LOGO ===== */}
        <div className={`flex items-center gap-3 border-b border-white/10 ${collapsed ? "px-3 py-5 justify-center" : "px-5 py-5"}`}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-black shadow-md border-2 border-white/10">
            <img src={basketImage} alt="Logo" className="w-full h-full object-contain" />
          </div>

          {!collapsed && (
            <div className="leading-tight overflow-hidden flex flex-col justify-center">
              <h1 className="text-lg font-black text-white leading-none">
                <span className="text-[#59c33f]">PRIYAM</span>
              </h1>
              <p className="text-[8px] text-gray-300 font-bold tracking-[0.2em] uppercase mt-1">Super Market</p>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:bg-white/10 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;

            /* ----- DROPDOWN ITEM ----- */
            if (item.children) {
              const isMenuOpen = openMenu === item.label;
              const isAnyChildActive = isActiveRoute(item);

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    title={collapsed ? item.label : undefined}
                    className={`
                      w-full flex items-center gap-3 rounded-xl transition-all duration-200
                      ${collapsed ? "px-0 py-3 justify-center" : "px-4 py-3"}
                      ${isAnyChildActive
                        ? "bg-[#3a8b28] text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isAnyChildActive ? "text-white" : "text-gray-400"}`} />
                    {!collapsed && (
                      <>
                        <span className={`flex-1 text-left text-sm font-bold`}>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""} ${isAnyChildActive ? "text-white" : "text-gray-400"}`}
                        />
                      </>
                    )}
                  </button>

                  {/* Sub Menu */}
                  {!collapsed && (
                    <div className={`overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                      <div className="ml-5 pl-4  space-y-1 py-1.5">
                        {item.children.map((sub) => {
                          const isActive = location.pathname === sub.path || (sub.path !== "/admin" && location.pathname.startsWith(sub.path + "/"));
                          return (
                            <NavLink
                              key={sub.path}
                              to={sub.path}
                              onClick={() => isOpen && onClose()}
                              className={`
                                flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-200
                                ${isActive
                                  ? "text-white bg-white/10"
                                  : "text-gray-400 hover:text-white hover:bg-white/5"
                                }
                              `}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : "bg-gray-500"}`} />
                              <span>{sub.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            /* ----- NORMAL ITEM ----- */
            const isActive = isActiveRoute(item);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                title={collapsed ? item.label : undefined}
                onClick={() => {
                  setOpenMenu(null);
                  if (isOpen) onClose();
                }}
                className={`
                  flex items-center justify-between rounded-xl transition-all duration-200
                  ${collapsed ? "px-0 py-3 justify-center" : "px-4 py-3"}
                  ${isActive
                    ? "bg-[#1b7f29] text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                    {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
                </div>
                {!collapsed && item.label === "Orders" && (
                    <span className="bg-[#249533] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        32
                    </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ===== BOOST SALES CARD ===== */}
        {!collapsed && (
          <div className="mx-4 mb-1 rounded-2xl bg-white p-3.5 flex gap-2 relative overflow-hidden shadow-xl border border-gray-100">
            {/* Left side: Illustration */}
            <div className="w-25 shrink-0 relative flex items-center justify-center">
                {/* Reference to the basket image the user uploaded */}
                <img src={basketImage} alt="Boost Sales Basket" className="w-full h-full object-contain relative z-10 drop-shadow-lg scale-[1.15]" />
            </div>
            
            {/* Right side: Content */}
            <div className="flex-1 flex flex-col justify-center pr-1">
              <h3 className="text-sm font-extrabold text-[#113a22] flex items-center gap-1 mb-1.5 leading-tight">
                  Boost Your Sales! 
              </h3>
              <p className="text-[10px] font-semibold text-gray-800 leading-snug mb-3">
                Create exciting offers & discounts to attract more customers.
              </p>
              <button className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-b from-[#6ec81e] to-[#41940b] text-white text-[11px] font-bold shadow-[0_4px_8px_rgba(65,148,11,0.4)] flex items-center justify-between border-t border-[#8fed37] border-b border-[#2d6907]">
                  <span className="flex-1 text-center drop-shadow-sm ml-4">Create Offer</span>
                  <div className="w-4 h-4 rounded-full bg-[#d0f5a1] flex items-center justify-center shrink-0 shadow-inner">
                      <ChevronRight className="w-3 h-3 text-[#2d6907] stroke-[3]" />
                  </div>
              </button>
            </div>
          </div>
        )}

        {/* ===== USER PROFILE CARD ===== */}
        {!collapsed && (
          <div className="mx-4 mb-6 p-2 rounded-xl border border-transparent flex items-center gap-3 bg-transparent cursor-pointer hover:bg-white/5 transition-all">
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#1b7f29]">
                <img src="https://ui-avatars.com/api/?name=Super+Admin&background=f0faf0&color=3a8b28" alt="Super Admin" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">Admin</h4>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">admin@gmail.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        )}

        {/* ===== COLLAPSE TOGGLE ===== */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 rounded-full bg-[#042f1a] border border-white/20 shadow-md items-center justify-center text-gray-400 hover:text-white transition-all z-50"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
