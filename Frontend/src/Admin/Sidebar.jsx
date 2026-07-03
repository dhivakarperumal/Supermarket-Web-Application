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
} from "lucide-react";

import { useAuth } from "../PrivateRouter/AuthContext";

/* ================= NAV ITEMS ================= */
const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },

  {
    label: "Products",
    icon: Package,
    children: [
      { path: "/admin/products/all", label: "All Products", icon: List },
      { path: "/admin/products/add", label: "Add New Product", icon: PlusCircle },
    ],
  },

  { path: "/admin/products/category", label: "Categories", icon: Layers },

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
  { path: "/admin/products/stock", label: "Inventory", icon: Archive },
  { path: "/admin/banners", label: "Offers & Discounts", icon: Gift },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
  // { path: "/admin/banners", label: "Banners", icon: Image },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/videos", label: "Settings", icon: Settings },
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
          bg-white border-r border-gray-100
          transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "w-20" : "w-76"}
          shadow-[4px_0_20px_rgba(0,0,0,0.06)]
        `}
      >
        {/* ===== LOGO ===== */}
        <div className={`flex items-center gap-2.5 border-b border-gray-100 ${collapsed ? "px-3 py-5 justify-center" : "px-4 py-4"}`}>
          <div className="w-9 h-9 rounded-xl bg-[#3a8b28] flex items-center justify-center shrink-0 shadow-md">
            <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <h1 className="text-base font-black text-gray-900 leading-none">
                <span className="text-[#3a8b28]">Priyam</span>
              </h1>
              <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-0.5">Supermarket</p>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto hide-scrollbar">
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
                      ${collapsed ? "px-0 py-3 justify-center" : "px-3 py-2.5"}
                      ${isAnyChildActive
                        ? "text-[#3a8b28] bg-[#f0faf0]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isAnyChildActive ? "text-[#3a8b28]" : "text-gray-500"}`} />
                    {!collapsed && (
                      <>
                        <span className={`flex-1 text-left text-sm font-bold`}>{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>

                  {/* Sub Menu */}
                  {!collapsed && (
                    <div className={`overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="ml-4 pl-3 border-l-2 border-gray-100 space-y-1 py-1.5">
                        {item.children.map((sub) => {
                          const isActive = location.pathname === sub.path || (sub.path !== "/admin" && location.pathname.startsWith(sub.path + "/"));
                          return (
                            <NavLink
                              key={sub.path}
                              to={sub.path}
                              onClick={() => isOpen && onClose()}
                              className={`
                                flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200
                                ${isActive
                                  ? "text-[#3a8b28] bg-[#f0faf0]"
                                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                }
                              `}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#3a8b28]" : "bg-gray-300"}`} />
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
                  flex items-center gap-3 rounded-xl transition-all duration-200
                  ${collapsed ? "px-0 py-3 justify-center" : "px-3 py-2.5"}
                  ${isActive
                    ? "text-[#3a8b28] bg-[#f0faf0] font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#3a8b28]" : "text-gray-500"}`} />
                {!collapsed && <span className="text-sm font-bold">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* ===== BOOST SALES CARD ===== */}
        {!collapsed && (
          <div className="mx-4 mb-4 rounded-xl bg-[#eaf7e3] p-4 flex gap-3 relative overflow-hidden">
            {/* Left side: Illustration */}
            <div className="w-14 shrink-0 flex items-center justify-center relative">
              <div className="text-4xl relative z-10 drop-shadow-sm">🛍️</div>
              <div className="absolute inset-0 bg-[#68c93a]/20 blur-xl rounded-full"></div>
            </div>
            
            {/* Right side: Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-gray-800">Boost Your Sales!</h3>
              <p className="text-[10px] text-gray-500 leading-snug mt-1 mb-3">
                Add new offers and<br/>attract more customers
              </p>
              <button className="w-full py-2 rounded-lg bg-[#3a8b28] text-white text-xs font-bold hover:bg-[#2d731d] transition-colors shadow-sm shadow-[#3a8b28]/20">
                Create Offer
              </button>
            </div>
          </div>
        )}

        {/* ===== USER PROFILE CARD ===== */}
        {!collapsed && (
          <div className="mx-4 mb-6 p-3 rounded-xl border border-gray-100 flex items-center gap-3 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#3a8b28]/30 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#f0faf0] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-[#3a8b28]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-bold text-gray-800 truncate">GreenMart</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px] text-gray-500 truncate">Super Admin</span>
                <div className="w-3.5 h-3.5 rounded-full bg-[#3a8b28] flex items-center justify-center shrink-0">
                  <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        )}

        {/* ===== COLLAPSE TOGGLE ===== */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-500 hover:text-[#3a8b28] hover:border-[#3a8b28] transition-all z-50"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
