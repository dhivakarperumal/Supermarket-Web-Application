import React, { useEffect, useState, useContext } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Eye,
  Package,
  Truck,
  Leaf,
  ShieldCheck,
  Wallet,
  BadgePercent,
  BadgeCheck,
  ArrowRight,
  CircleCheck,
  Sparkles,
  Hash,
  Flame,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import PageHeader from "../CommenComponents/PageHeader";
import { useNavigate } from "react-router-dom";
import QuickViewModal from "../Products/QuickModel";
import AnimatedButton from "../AnimatedButton";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const resolveImage = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http") || trimmed.startsWith("data:")) return trimmed;
  const cleanPath = trimmed.replace(/\\/g, "/");
  return cleanPath.startsWith("/")
    ? `${BACKEND_URL}${cleanPath}`
    : `${BACKEND_URL}/${cleanPath}`;
};

const normalizeImages = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [parsed].filter(Boolean);
    } catch {
      if (trimmed.startsWith("[")) return [];
      return [trimmed];
    }
  }
  return [value];
};

const getImage = (product) => {
  const candidates = [
    product.thumbnail_image,
    product.product_images,
    product.images,
    product.image,
    product.image_url,
  ];
  for (const candidate of candidates) {
    const list = normalizeImages(candidate);
    if (list.length > 0) {
      const resolved = resolveImage(list[0]);
      if (resolved) return resolved;
    }
  }
  // variant images fallback
  if (product.variants?.length > 0) {
    const variantImgs = normalizeImages(product.variants[0]?.images);
    if (variantImgs.length > 0) {
      const resolved = resolveImage(variantImgs[0]);
      if (resolved) return resolved;
    }
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    product.name || "Combo"
  )}&background=d1fae5&color=065f46&size=400`;
};

const isCombo = (p) => {
  return String(p.type) === "1";
};

const CATEGORIES = ["All", "Rice", "Breakfast", "Cooking", "Healthy", "Snacks", "Family"];

const Combo = () => {
  const { toggleWishlist, wishlist, addToCart } = useContext(StoreContext);
  const [allCombos, setAllCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const [quickView, setQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await api.get("/products");
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
            ? res.data.products
            : [];
        setAllCombos(data.filter(isCombo));
      } catch (error) {
        console.error("Error fetching combos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const filteredCombos =
    activeCategory === "All"
      ? allCombos
      : allCombos.filter(
        (c) =>
          c.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          c.name?.toLowerCase().includes(activeCategory.toLowerCase())
      );



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5fff7] via-[#fbfffc] to-[#eefaf2]">

      <PageHeader title="Combo Products" />

      {/* Combo Cards */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {loading ? (
          <div className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                  <div className="h-12 bg-gray-200 rounded-2xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCombos.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Tag size={36} className="text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Combos Found</h3>
            <p className="text-gray-400">No combo products are available yet. Add combos from the Admin panel.</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-6 px-6 py-3 bg-[#0e6827] text-white rounded-2xl font-bold text-sm hover:bg-[#168637] transition"
            >
              Show All
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredCombos.map((combo) => {
              const price = parseFloat(
                combo.offer_price || combo.selling_price || combo.price || 0
              );
              const mrp = parseFloat(combo.mrp || combo.price || 0);
              const discountPct =
                mrp > 0 && price > 0 && mrp > price
                  ? Math.round((1 - price / mrp) * 100)
                  : 0;
              const savings = mrp > price ? (mrp - price).toFixed(2) : 0;
              const imgSrc = getImage(combo);
              const inWishlist = wishlist.some(
                (w) => w.product_id === combo.id || w.id === combo.id
              );

              // Parse combo items for display
              let comboItems = [];
              if (Array.isArray(combo.combo_items) && combo.combo_items.length > 0) {
                comboItems = combo.combo_items;
              }

              return (
                <div
                  key={combo.id}
                  className="group relative bg-white rounded-[30px] overflow-hidden border border-green-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">

                    <Link to={`/products/${combo.id}`}>
                      <img
                        src={imgSrc}
                        alt={combo.name}
                        className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            combo.name || "Combo"
                          )}&background=d1fae5&color=065f46&size=400`;
                        }}
                      />
                    </Link>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                    {/* Discount */}
                    {discountPct > 0 && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl">

                          <BadgePercent size={15} />

                          <span className="font-bold text-xs">

                            {discountPct}% OFF

                          </span>

                        </div>
                      </div>
                    )}

                    {/* Combo Badge */}

                    <div className="absolute bottom-4 left-4">

                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/95 backdrop-blur-md text-white shadow-xl">

                        <Package size={15} />

                        <span className="font-semibold text-xs">

                          Combo Pack

                        </span>

                      </div>

                    </div>

                    {/* Wishlist */}

                    <button
                      onClick={() => toggleWishlist(combo)}
                      className={`absolute top-4 right-4 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center shadow-xl transition-all duration-300 ${inWishlist
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white"
                        }`}
                    >

                      <Heart
                        size={20}
                        fill={inWishlist ? "currentColor" : "none"}
                      />

                    </button>

                  </div>

                  {/* Card Body */}

                  <div className="flex flex-col flex-1 p-6">

                    {/* Product Title */}

                    <div className="flex justify-between gap-3">

                      <div className="flex-1">

                        <Link to={`/products/${combo.id}`}>

                          <h2
                            onClick={() => navigate(`/products/${combo.id}`)}
                            className="text-xl font-bold text-gray-800 leading-7 line-clamp-2 group-hover:text-green-700 transition-colors"
                          >
                            {combo.name}
                          </h2>

                        </Link>

                        {combo.product_code && (

                          <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                            <Hash size={13} />

                            {combo.product_code}

                          </div>

                        )}

                      </div>

                      {/* Rating */}

                      <div className="bg-yellow-50 rounded-2xl px-3 py-2 h-fit">

                        <div className="flex items-center gap-1">

                          <Star
                            size={15}
                            className="text-yellow-500"
                            fill="currentColor"
                          />

                          <span className="font-bold text-gray-700">

                            {combo.rating || "4.8"}

                          </span>

                        </div>

                        <div className="flex justify-center mt-1">

                          <BadgeCheck
                            size={14}
                            className="text-green-600"
                          />

                        </div>

                      </div>

                      {/* Combo Items */}
                      <div className="mt-6 flex-1">

                        <div className="flex items-center gap-2 mb-3">

                          <Package size={17} className="text-green-600" />

                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Combo Includes
                          </h4>

                        </div>

                        {comboItems.length > 0 ? (

                          <div className="space-y-2">

                            {comboItems.slice(0, 4).map((item, index) => (

                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm text-gray-600"
                              >

                                <CircleCheck
                                  size={16}
                                  className="text-green-600 shrink-0"
                                />

                                <span className="line-clamp-1">

                                  {item.product_name ||
                                    item.name ||
                                    `Item ${index + 1}`}

                                  {item.quantity > 1
                                    ? ` × ${item.quantity}`
                                    : ""}

                                </span>

                              </div>

                            ))}

                            {comboItems.length > 4 && (

                              <div className="text-sm font-semibold text-green-600">

                                + {comboItems.length - 4} More Items

                              </div>

                            )}

                          </div>

                        ) : (

                          <p className="text-sm text-gray-500 leading-6 line-clamp-3">

                            {combo.description || "Premium grocery combo pack."}

                          </p>

                        )}

                      </div>

                      {/* Features */}

                      <div className="grid grid-cols-3 gap-2 mt-6">

                        <div className="bg-green-50 rounded-xl py-3 flex flex-col items-center">

                          <Truck
                            size={18}
                            className="text-green-600 mb-1"
                          />

                          <span className="text-[11px] font-semibold text-gray-600">
                            Delivery
                          </span>

                        </div>

                        <div className="bg-green-50 rounded-xl py-3 flex flex-col items-center">

                          <Leaf
                            size={18}
                            className="text-green-600 mb-1"
                          />

                          <span className="text-[11px] font-semibold text-gray-600">
                            Fresh
                          </span>

                        </div>

                        <div className="bg-green-50 rounded-xl py-3 flex flex-col items-center">

                          <ShieldCheck
                            size={18}
                            className="text-green-600 mb-1"
                          />

                          <span className="text-[11px] font-semibold text-gray-600">
                            Quality
                          </span>

                        </div>

                      </div>

                      {/* Price */}

                      <div className="mt-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-100">

                        <div className="flex justify-between items-center">

                          <div>

                            <p className="text-3xl font-black text-green-700">

                              ₹{price.toFixed(2)}

                            </p>

                            {mrp > price && (

                              <div className="flex items-center gap-2 mt-1">

                                <span className="line-through text-gray-400">

                                  ₹{mrp.toFixed(2)}

                                </span>

                                <span className="text-red-500 text-sm font-semibold">

                                  Save ₹{savings}

                                </span>

                              </div>

                            )}

                          </div>

                          {discountPct > 0 && (

                            <div className="bg-green-600 text-white rounded-xl px-3 py-2">

                              <div className="flex items-center gap-1">

                                <Wallet size={16} />

                                <span className="font-bold">

                                  {discountPct}%

                                </span>

                              </div>

                            </div>

                          )}

                        </div>

                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 space-y-3">

                        {/* Top Buttons */}
                        <div className="grid grid-cols-2 gap-3">

                          {/* Quick View */}
                          <button
                            onClick={() => {
                              setSelectedProduct(combo);
                              setQuickView(true);
                            }}
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-green-200 bg-green-50 text-green-700 font-semibold hover:bg-green-600 hover:text-white transition-all duration-300"
                          >
                            <Eye size={18} />
                            Quick View
                          </button>

                          {/* Add to Cart */}
                          <button
                            onClick={() => addToCart(combo)}
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                          >
                            <ShoppingCart size={18} />
                            Add Cart
                          </button>

                        </div>

                        {/* View Details */}
                        <Link
                          to={`/products/${combo.id}`}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-green-600 text-green-700 font-bold hover:bg-green-600 hover:text-white transition-all duration-300"
                        >
                          <ArrowRight size={18} />
                          View Details
                        </Link>

                      </div>

                    </div> {/* Card Body */}

                  </div> {/* Card */}

                </div>

              );
            })}
          </div>
        )}
      </section>
      {
        quickView && selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => {
              setQuickView(false);
              setSelectedProduct(null);
            }}
          />
        )
      }
    </div>
  );
};

export default Combo;