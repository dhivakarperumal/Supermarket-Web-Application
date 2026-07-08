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

const navClass = ({ isActive }) =>
  `px-4 py-1.5 rounded-lg text-sm font-medium transition
  ${
    isActive
      ? "bg-gradient-to-r from-primary-light to-secondary text-white shadow"
      : "text-gray-600 hover:bg-primary-light/10 hover:text-primary"
  }`;

  return (

    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b pb-0 pt-2 md:pt-4">
      <PageContainer>
        {/* Top Section: Logo, Search, Icons */}
        <div className="flex items-center justify-between pb-3 md:pb-4 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-primary"
          >
            {mobileMenu ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Dhiva & Deva Supermarket"
              className="h-10 md:h-14 object-contain"
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl border border-gray-300 rounded-md overflow-hidden bg-white ml-8">
            <div className="bg-gray-50 px-4 py-2.5 border-r border-gray-300 flex items-center gap-2 text-sm text-gray-600 shrink-0 cursor-pointer">
              All Categories
              <ChevronDown size={14} />
            </div>
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              className="flex-1 px-4 py-2.5 outline-none text-sm"
            />
            <button className="bg-primary text-white px-6 flex items-center justify-center hover:bg-primary-dark transition">
              <Search size={18} />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <div 
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-center font-semibold shadow-md group-hover:scale-110 transition">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-500 font-medium">My Account</p>
                    <p className="text-sm font-bold text-gray-800">Hello, {user.username}</p>
                  </div>
                </div>

                {userMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-dropdown">
                    <Link to="/account" className="block px-4 py-3 text-sm hover:bg-gray-100" onClick={() => setUserMenu(false)}>
                      My Account
                    </Link>
                    {user.role === "admin" && (
                      <Link to="admin" className="block px-4 py-3 text-sm hover:bg-gray-100" onClick={() => setUserMenu(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => setLogoutConfirm(true)} className="w-full cursor-pointer text-left px-4 py-3 text-sm hover:bg-gray-100 text-red-500">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 group">
                <User className="text-gray-600 group-hover:text-primary transition" size={24} />
                <div className="hidden md:block">
                  <p className="text-xs text-gray-500 font-medium">Sign In</p>
                  <p className="text-sm font-bold text-gray-800">Account</p>
                </div>
              </Link>
            )}

            <Link to="/wishlist" className="relative flex items-center gap-2 group">
              <div className="relative">
                <Heart className="text-gray-600 group-hover:text-primary transition" size={24} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition">Wishlist</p>
                <p className="text-xs text-gray-500 font-medium">{wishlist.length} Items</p>
              </div>
            </Link>

            <Link to="cart" className="relative flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="text-gray-600 group-hover:text-primary transition" size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length > 9 ? '9+' : cart.length}
                  </span>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition">Cart</p>
                <p className="text-xs text-gray-500 font-medium">₹1,248</p>
              </div>
            </Link>
          </div>
        </div>
      </PageContainer>

      {/* Bottom Navigation Menu (Desktop) */}
      <div className="hidden md:block bg-primary border-t border-primary-light">
        <PageContainer>
          <div className="flex items-center h-12">
            
            {/* All Categories Dropdown */}
            <div className="relative h-full flex items-center" ref={categoryRef}>
              <button
                onClick={() => setCategoryMenu(!categoryMenu)}
                className="h-full px-6 bg-primary-dark text-white flex cursor-pointer items-center gap-3 font-semibold text-sm hover:bg-opacity-90 transition min-w-[240px]"
              >
                <Menu size={18} />
                All Categories
                <ChevronDown size={16} className={`ml-auto transition-transform ${categoryMenu ? "rotate-180" : ""}`} />
              </button>

              {categoryMenu && (
                <div className="absolute top-full left-0 w-[240px] bg-white border border-gray-200 shadow-xl overflow-hidden animate-dropdown rounded-b-md z-50">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat.id}
                      to={`/category/${cat.slug || cat.name}`}
                      onClick={() => setCategoryMenu(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary border-b border-gray-100 last:border-0 transition"
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6 px-6 flex-1 overflow-x-auto hide-scrollbar">
              <NavLink to="/" className="text-yellow-400 font-bold text-[13px] whitespace-nowrap">Home</NavLink>
              <NavLink to="/category/fruits-vegetables" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Fruits & Vegetables</NavLink>
              <NavLink to="/category/grocery-staples" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Grocery & Staples</NavLink>
              <NavLink to="/category/dairy-bakery" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Dairy & Bakery</NavLink>
              <NavLink to="/category/beverages" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Beverages</NavLink>
              <NavLink to="/category/snacks" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Snacks & Branded Foods</NavLink>
              <NavLink to="/category/personal-care" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Personal Care</NavLink>
              <NavLink to="/category/household" className="text-white hover:text-yellow-400 text-[13px] font-medium whitespace-nowrap transition">Household</NavLink>
              
              <div className="relative" ref={pagesRef}>
                <button
                  onClick={() => setPagesMenu(!pagesMenu)}
                  className="flex items-center gap-1 text-white hover:text-yellow-400 text-[13px] font-medium transition cursor-pointer"
                >
                  More
                  <ChevronDown size={14} />
                </button>
                {pagesMenu && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden animate-dropdown z-50">
                    <NavLink to="/about" onClick={() => setPagesMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">About</NavLink>
                    <NavLink to="/contactus" onClick={() => setPagesMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Contact Us</NavLink>
                  </div>
                )}
              </div>
            </div>

            {/* Hot Deals Button */}
            <div className="shrink-0 ml-auto mr-4">
              <NavLink to="/deals" className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-[13px] font-bold shadow transition flex items-center gap-1">
                Hot Deals 🔥
              </NavLink>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Logout Modal */}

      {logoutConfirm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-[320px] p-6 text-center">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      )}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenu(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-white shadow-xl overflow-hidden">

            {/* MENU SCREEN */}
            {!mobileCategory && !mobilePages && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-primary text-white">
                  <h2 className="text-lg font-semibold tracking-wide">Menu</h2>
                  <X
                    size={24}
                    className="cursor-pointer"
                    onClick={() => setMobileMenu(false)}
                  />
                </div>

                {/* Links */}
                <div className="flex flex-col p-5 space-y-3">

                  <NavLink
                    to="/"
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${isActive
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white"
                      }`
                    }
                  >
                    <FiHome size={16} />
                    Home
                  </NavLink>

                  <NavLink
                    to="/shop"
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${isActive
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white"
                      }`
                    }
                  >
                    <FiShoppingBag size={16} />
                    Shop
                  </NavLink>

                  <button
                    onClick={() => setMobileCategory(true)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm bg-gray-100 hover:bg-primary-light hover:text-white transition"
                  >
                    <div className="flex items-center gap-3">
                      <FiGrid size={16} />
                      Categories
                    </div>

                    <FiChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => setMobilePages(true)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm bg-gray-100 hover:bg-primary-light hover:text-white transition"
                  >
                    <div className="flex items-center gap-3">
                      <FiFileText size={16} />
                      Pages
                    </div>

                    <FiChevronRight size={16} />
                  </button>

                </div>
              </>
            )}

            {/* CATEGORY SCREEN */}
            {mobileCategory && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-primary text-white">

                  {/* Back button */}
                  <button
                    onClick={() => setMobileCategory(false)}
                    className="text-xl"
                  >
                    ←
                  </button>

                  <h2 className="text-sm font-semibold">Categories</h2>

                  <X
                    size={24}
                    className="cursor-pointer"
                    onClick={() => setMobileMenu(false)}
                  />

                </div>

                {/* Category List */}
                <div className="flex flex-col p-5 space-y-3">

                  {categories.map((cat) => (

                    <NavLink
                      key={cat.id}
                      to={`/category/${cat.slug || cat.name}`}
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-lg text-sm transition
        ${isActive
                          ? "bg-primary text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white"
                        }`
                      }
                    >

                      <div className="flex items-center gap-3">
                        <FiTag size={16} />
                        {cat.name}
                      </div>

                      <FiChevronRight size={16} />

                    </NavLink>

                  ))}

                </div>
              </>
            )}
            {/* PAGES SCREEN */}
            {mobilePages && (
              <>
                <div className="flex items-center justify-between px-6 py-4 bg-primary text-white">

                  <button
                    onClick={() => setMobilePages(false)}
                    className="text-xl"
                  >
                    ←
                  </button>

                  <h2 className="text-lg font-semibold">Pages</h2>

                  <X
                    size={24}
                    className="cursor-pointer"
                    onClick={() => setMobileMenu(false)}
                  />

                </div>

                <div className="flex flex-col p-5 space-y-3">

                  <NavLink
                    to="/about"
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${isActive
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white"
                      }`
                    }
                  >
                    <FiFileText size={16} />
                    About
                  </NavLink>

                    <NavLink
                    to="/termsandconditions"
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${isActive
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white"
                      }`
                    }
                  >
                    <FiFileText size={16} />
                    Terms And Conditions
                  </NavLink>

                    
                  <NavLink
                    to="/contactus"
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${isActive
                        ? "bg-primary text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white"
                      }`
                    }
                  >
                    <FiPhone size={16} />
                    Contact Us
                  </NavLink>

                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>

  );
};

export default Navbar;