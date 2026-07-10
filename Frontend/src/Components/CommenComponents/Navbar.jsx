import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../PrivateRouter/AuthContext";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import {
  Menu,
  X,
  User,
  Heart,
  ShoppingCart,
  Package,
  Search,
  ChevronDown
} from "lucide-react";
import logo from "/logo.png";
import PageContainer from "./PageContainer";
import api from "../../api";
import { FiHome, FiShoppingBag, FiGrid, FiFileText, FiPhone, FiChevronDown, FiChevronRight, FiTag } from "react-icons/fi";

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);
  const { cart, wishlist } = useContext(StoreContext);
  const [mobilePages, setMobilePages] = useState(false);
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const [pagesMenu, setPagesMenu] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(false);

  const menuRef = useRef();
  const categoryRef = useRef();
  const pagesRef = useRef();

  const confirmLogout = () => {
    logout();
    setLogoutConfirm(false);
    setUserMenu(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {

    const handler = (e) => {

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false);
      }

      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryMenu(false);
      }

      if (pagesRef.current && !pagesRef.current.contains(e.target)) {
        setPagesMenu(false);
      }

    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);

  }, []);

  // Fetch categories
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();

  }, []);

  const cartTotal = cart.reduce((acc, item) => {
    const price = item.offer_price || item.price || 0;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  return (
    <div className="sticky top-0 z-40 bg-white pt-1 border-b border-gray-100">

      {/* Top Header - White */}
      <div className="relative z-[80] bg-white border-b border-gray-100 overflow-visible">
        <PageContainer>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center justify-between w-full md:w-auto">
              <img
                src={logo}
                alt="Supermarket Logo"
                className="h-10 md:h-18 object-contain"
              />
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden text-green-800"
              >
                {mobileMenu ? <X size={28} /> : <Menu size={28} />}
              </button>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 w-full max-w-3xl flex items-center border-2 border-green-800 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="flex-1 px-4 py-2.5 text-sm outline-none w-full"
              />
              <div className="border-l border-gray-300 hidden md:flex items-center px-4 bg-gray-50 h-full cursor-pointer hover:bg-gray-100 transition">
                <span className="text-sm text-gray-600 mr-2 whitespace-nowrap">All Categories</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              <button className="bg-green-800 text-white px-6 py-2.5 hover:bg-green-900 transition flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>

            {/* Right Action Icons (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-8 flex-shrink-0">

              {/* Account Dropdown */}
              <div className="relative" ref={menuRef}>
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setUserMenu(!userMenu)}
                >
                  <User className="text-gray-700 group-hover:text-green-800 transition" size={26} />
                  <div>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1 group-hover:text-green-800 transition">
                      My Account <ChevronDown size={14} className="text-gray-500" />
                    </p>
                    <p className="text-xs text-gray-500">Hello, {user ? user.username : 'Sign In'}</p>
                  </div>
                </div>

                {userMenu && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-[9999]">
                    {user ? (
                      <>
                        <Link to="/account" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-800" onClick={() => setUserMenu(false)}>
                          My Profile
                        </Link>
                        <Link to="/ordersmain" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-800" onClick={() => setUserMenu(false)}>
                          Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link to="admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-800" onClick={() => setUserMenu(false)}>
                            Admin Panel
                          </Link>
                        )}
                        <button onClick={() => setLogoutConfirm(true)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium">
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-800" onClick={() => setUserMenu(false)}>
                          Sign In
                        </Link>
                        <Link to="/register" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-800" onClick={() => setUserMenu(false)}>
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="flex items-center gap-3 group">
                <div className="relative">
                  <Heart className="text-gray-700 group-hover:text-green-800 transition" size={26} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-green-800 transition">Wishlist</p>
                  <p className="text-xs text-gray-500">{wishlist.length} items</p>
                </div>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-3 group">
                <div className="relative">
                  <ShoppingCart className="text-gray-700 group-hover:text-green-800 transition" size={26} />
                  {cart.length > 0 && (
                    <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cart.length}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1 group-hover:text-green-800 transition">
                    Cart
                  </p>
                  <p className="text-xs text-gray-500">₹{cartTotal.toLocaleString()}</p>
                </div>
              </Link>

            </div>
          </div>
        </PageContainer>
      </div>

      {/* Bottom Header - Green Navbar */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-30 bg-[#0e6827] border-[#0b511d] shadow-md">
          <PageContainer>
            <div className="grid grid-cols-3 items-center h-9">

              <div className="flex justify-start items-center h-full gap-4">
                {/* Categories Dropdown Button */}
                <div className="relative h-full" ref={categoryRef}>
                  <button
                    onClick={() => {
                      setCategoryMenu(!categoryMenu);
                      setPagesMenu(false);
                    }}
                    className="bg-[#ffc107] text-black flex items-center gap-3 px-5 h-full font-bold hover:bg-[#e0a800] transition cursor-pointer"
                  >
                    <Menu size={20} />
                    All Categories
                    <ChevronDown size={18} className={`transition-transform ${categoryMenu ? "rotate-180" : ""}`} />
                  </button>

                  {categoryMenu && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl overflow-hidden z-50">
                      {categories.length > 0 ? categories.map((cat) => (
                        <NavLink
                          key={cat.id}
                          to={`/category/${cat.slug || cat.name}`}
                          onClick={() => setCategoryMenu(false)}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-800 border-b border-gray-100 last:border-none transition"
                        >
                          {cat.name}
                        </NavLink>
                      )) : (
                        <div className="px-5 py-3 text-sm text-gray-500">No categories found</div>
                      )}
                    </div>
                  )}
                </div>


              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-6 text-[13px] font-semibold text-white tracking-wide">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
                  }
                >
                  Home
                </NavLink>

                 <NavLink
                  to="/shop"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
                  }
                >
                  Shop
                </NavLink>

                {categories.slice(0, 4).map((cat) => (
                  <NavLink
                    key={cat.id}
                    to={`/category/${cat.slug || cat.name}`}
                    className="hover:text-yellow-400 transition whitespace-nowrap"
                  >
                    {cat.name}
                  </NavLink>
                ))}

                <div className="relative" ref={pagesRef}>
                  <button
                    onClick={() => {
                      setPagesMenu(!pagesMenu);
                      setCategoryMenu(false);
                    }}
                    className="flex items-center gap-1 hover:text-yellow-400 transition"
                  >
                    More <ChevronDown size={14} />
                  </button>

                  {pagesMenu && (
                    <div className="absolute top-full left-0 w-44 bg-white shadow-xl z-50 border border-gray-100">
                      <NavLink
                        to="/about"
                        onClick={() => setPagesMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        About
                      </NavLink>

                      <NavLink
                        to="/contactus"
                        onClick={() => setPagesMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Contact Us
                      </NavLink>

                      <NavLink
                        to="/termsandconditions"
                        onClick={() => setPagesMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Terms
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>

              {/* Hot Deals */}
              <div className="flex justify-end">
              <Link to="/shop" className="bg-[#e53935] text-white flex items-center gap-1.5 px-4 py-1.5 rounded text-[13px] font-bold hover:bg-red-700 transition shadow-sm h-8">
                Hot Deals <span className="text-sm">🔥</span>
              </Link>
              </div>

            </div>
          </PageContainer>
        </div>
      </div>

      {/* Logout Modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setLogoutConfirm(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={confirmLogout} className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      {mobileMenu && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />

          <div className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl overflow-y-auto flex flex-col">

            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-green-800 text-white">
              <div className="flex items-center gap-3">
                <User size={24} />
                <div>
                  <h3 className="font-bold text-sm">{user ? user.username : 'Guest'}</h3>
                  <p className="text-xs text-green-200">{user ? 'My Account' : 'Sign in to sync'}</p>
                </div>
              </div>
              <X size={24} className="cursor-pointer" onClick={() => setMobileMenu(false)} />
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Mobile Main Menu */}
              {!mobileCategory && !mobilePages && (
                <div className="p-4 flex flex-col gap-2">
                  <NavLink to="/" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition font-medium">
                    <FiHome size={18} /> Home
                  </NavLink>

                  <NavLink to="/shop" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition font-medium">
                    <FiShoppingBag size={18} /> Shop
                  </NavLink>

                  <button onClick={() => setMobileCategory(true)} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition font-medium w-full">
                    <div className="flex items-center gap-3">
                      <FiGrid size={18} /> Categories
                    </div>
                    <FiChevronRight size={18} />
                  </button>

                  <button onClick={() => setMobilePages(true)} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition font-medium w-full">
                    <div className="flex items-center gap-3">
                      <FiFileText size={18} /> Pages
                    </div>
                    <FiChevronRight size={18} />
                  </button>

                  <div className="my-2 border-t border-gray-100"></div>

                  <Link to="/cart" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition font-medium">
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={18} /> Cart
                    </div>
                    {cart.length > 0 && <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">{cart.length}</span>}
                  </Link>

                  <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition font-medium">
                    <div className="flex items-center gap-3">
                      <Heart size={18} /> Wishlist
                    </div>
                    {wishlist.length > 0 && <span className="bg-green-800 text-white px-2 py-0.5 rounded-full text-xs">{wishlist.length}</span>}
                  </Link>

                  <div className="my-2 border-t border-gray-100"></div>

                  {user ? (
                    <button onClick={() => setLogoutConfirm(true)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition font-medium w-full">
                      <User size={18} /> Logout
                    </button>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-green-700 bg-green-50 hover:bg-green-100 transition font-medium">
                      <User size={18} /> Sign In
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Category Menu */}
              {mobileCategory && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 font-medium text-gray-700">
                    <button onClick={() => setMobileCategory(false)} className="p-1 hover:bg-gray-200 rounded-md">←</button>
                    All Categories
                  </div>
                  <div className="p-2">
                    {categories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/category/${cat.slug || cat.name}`}
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 border-b border-gray-50 hover:bg-green-50 hover:text-green-800 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FiTag size={16} /> {cat.name}
                        </div>
                        <FiChevronRight size={16} className="text-gray-400" />
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Pages Menu */}
              {mobilePages && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 font-medium text-gray-700">
                    <button onClick={() => setMobilePages(false)} className="p-1 hover:bg-gray-200 rounded-md">←</button>
                    Pages
                  </div>
                  <div className="p-2">
                    <NavLink to="/about" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 border-b border-gray-50 hover:bg-green-50 hover:text-green-800 transition">
                      <FiFileText size={16} /> About Us
                    </NavLink>
                    <NavLink to="/contactus" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 border-b border-gray-50 hover:bg-green-50 hover:text-green-800 transition">
                      <FiPhone size={16} /> Contact Us
                    </NavLink>
                    <NavLink to="/termsandconditions" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition">
                      <FiFileText size={16} /> Terms And Conditions
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;