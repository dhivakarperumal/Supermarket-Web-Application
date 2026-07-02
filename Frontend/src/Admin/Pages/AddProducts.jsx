import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiSave,
  FiLayers,
  FiUploadCloud,
  FiTrash2,
  FiInfo,
  FiImage,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { toast, Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";

const AddProducts = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: "",
    product_code: "",
    barcode: "",
    category: "",
    subcategory: "",
    brand: "",
    description: "",
    barcode_image: "",
    weight_volume: "",
    unit: "kg",
    mrp: "",
    selling_price: "",
    offer: "",
    price_plus: "",
    offer_price: "",
    stock_quantity: "0",
    // pricing options: array of variants / pack sizes with their own price/stock
    pricing_options: [
      {
        weight_volume: "1",
        unit: "kg",
        mrp: "",
        selling_price: "",
        offer: "",
        stock_quantity: "0",
      },
    ],
    total_stock: "0",
    expiry_date: "",
    manufacturing_date: "",
    country_of_origin: "",
    supplier: "",
    product_images: [],
    thumbnail_image: "",
    status: "Active",
    featured_product: "No",
    best_seller: "No",
    todays_deal: "No",
    delivery_time: "",
    return_available: "No",
    rating: "5",
    review_count: "0",
    created_at: "",
    updated_at: "",
  });

  const computeTotalStock = (options) => {
    const opts = Array.isArray(options)
      ? options
      : formData.pricing_options || [];
    return opts.reduce(
      (sum, o) => sum + (Number(o.stock_quantity || 0) || 0),
      0,
    );
  };

  const generateProductCode = (code) => {
    const normalized = String(code || "")
      .trim()
      .toUpperCase();
    if (!normalized) return "SPM001";
    if (/^SPM\d{3,}$/.test(normalized)) return normalized;
    if (/^SP\d{3,}$/.test(normalized)) return `SPM${normalized.slice(2)}`;
    if (/^\d+$/.test(normalized)) return `SPM${normalized.padStart(3, "0")}`;
    return normalized.startsWith("SP") ? `SPM${normalized.slice(2)}` : `SPM001`;
  };

  const generateBarcode = (value) => {
    const cleaned = String(value || "")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase();
    if (!cleaned) return `BAR${Date.now()}`;
    return cleaned.length >= 12
      ? cleaned.slice(0, 12)
      : cleaned.padEnd(12, "0");
  };

  const renderBarcodeSvg = (value) => {
    const code = String(value || "").trim().toUpperCase();
    if (!code) {
      return (
        <div className="w-full h-32 rounded-3xl border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
          No barcode available
        </div>
      );
    }

    const bits = Array.from(code)
      .flatMap((char) =>
        char.charCodeAt(0).toString(2).padStart(8, "0").split("")
      )
      .map((bit) => Number(bit));

    const scale = 3;
    let x = 0;
    const bars = bits.map((bit, index) => {
      const width = bit === 1 ? scale * 2 : scale;
      const rect = bit === 1 ? (
        <rect
          key={index}
          x={x}
          y={12}
          width={width}
          height={36}
          fill="#0f172a"
        />
      ) : null;
      x += width;
      return rect;
    });

    const totalWidth = bits.reduce(
      (sum, bit) => sum + (bit === 1 ? scale * 2 : scale),
      0,
    );

    return (
      <svg
        viewBox={`0 0 ${totalWidth} 80`}
        className="w-full h-32 rounded-3xl bg-white border border-gray-200"
        preserveAspectRatio="xMinYMin meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={totalWidth} height={80} fill="#ffffff" rx="24" />
        <g>{bars}</g>
        <text
          x={totalWidth / 2}
          y="74"
          textAnchor="middle"
          fontSize="12"
          fill="#334155"
          fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {code}
        </text>
      </svg>
    );
  };

  // selling price is derived from MRP and Discount when those fields change

  useEffect(() => {
    const fetchEssentialData = async () => {
      try {
        if (isEdit) {
          const [catRes, editRes] = await Promise.all([
            api.get("/categories"),
            api.get(`/products/${id}`),
          ]);

          setCategories(Array.isArray(catRes.data) ? catRes.data : []);

          const p = editRes.data;
          setFormData((prev) => ({
            ...prev,
            name: p.name || "",
            product_code: p.product_code || "",
            barcode: p.barcode || generateBarcode(p.product_code || ""),
            barcode_image: p.barcode_image || "",
            category: p.category || "",
            subcategory: p.subcategory || "",
            brand: p.brand || "",
            description: p.description || "",
            weight_volume: p.weight_volume || "",
            unit: p.unit || "kg",
            mrp: p.mrp?.toString() || "",
            selling_price: p.selling_price?.toString() || "",
            offer: p.offer?.toString() || "",
            price_plus: p.price_plus?.toString() || "",
            offer_price: p.offer_price?.toString() || "",
            stock_quantity: p.stock_quantity?.toString() || "0",
            minimum_stock: p.minimum_stock?.toString() || "0",
            maximum_stock: p.maximum_stock?.toString() || "",
            expiry_date: p.expiry_date || "",
            manufacturing_date: p.manufacturing_date || "",
            country_of_origin: p.country_of_origin || "",
            supplier: p.supplier || "",
            product_images: Array.isArray(p.product_images)
              ? p.product_images
              : [],
            thumbnail_image: p.thumbnail_image || "",
            status: p.status || "Active",
            featured_product: p.featured_product ? "Yes" : "No",
            best_seller: p.best_seller ? "Yes" : "No",
            todays_deal: p.todays_deal ? "Yes" : "No",
            delivery_time: p.delivery_time || "",
            return_available: p.return_available ? "Yes" : "No",
            rating: p.rating?.toString() || "5",
            review_count: p.review_count?.toString() || "0",
            pricing_options: Array.isArray(p.pricing_options)
              ? p.pricing_options
              : prev.pricing_options || [
                  {
                    weight_volume: "1",
                    unit: "kg",
                    mrp: "",
                    selling_price: "",
                    stock_quantity: "0",
                  },
                ],
            created_at: p.created_at || "",
            updated_at: p.updated_at || "",
          }));
        } else {
          const [catRes] = await Promise.all([api.get("/categories")]);
          const categoriesData = Array.isArray(catRes.data) ? catRes.data : [];
          const defaultCategory = categoriesData[0]?.name || "";

          let initialSku = generateProductCode("");
          try {
            const codeRes = await api.get("/products/latest-code");
            initialSku = generateProductCode(codeRes.data?.latestCode);
          } catch (skuError) {
            console.warn(
              "Unable to fetch latest SKU, falling back to default:",
              skuError,
            );
          }

          setCategories(categoriesData);
          setFormData((prev) => ({
            ...prev,
            category: defaultCategory,
            product_code: initialSku,
            barcode: generateBarcode(initialSku),
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Unable to load product form data.");

        if (!isEdit) {
          const fallbackSku = generateProductCode("");
          setFormData((prev) => ({
            ...prev,
            product_code: fallbackSku,
            barcode: generateBarcode(fallbackSku),
          }));
        }
      } finally {
        setFetching(false);
      }
    };

    fetchEssentialData();
  }, [id, isEdit]);

  // derive subcategories from selected category instead of storing in state
  const derivedSubcategories = (() => {
    const selectedCat = categories.find((c) => c.name === formData.category);
    return selectedCat && selectedCat.subcategory
      ? selectedCat.subcategory
      : [];
  })();

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // derive barcode when SKU changes
      if (name === "product_code") {
        updated.barcode = generateBarcode(value);
      }

      // derive selling price immediately when mrp or offer changes
      if (name === "mrp" || name === "offer") {
        const mrpValue = parseFloat(name === "mrp" ? value : updated.mrp) || 0;
        const offerValue =
          parseFloat(name === "offer" ? value : updated.offer) || 0;
        if (mrpValue > 0) {
          const calculatedPrice = mrpValue - mrpValue * (offerValue / 100);
          updated.selling_price = Math.round(calculatedPrice).toString();
        } else {
          updated.selling_price = "";
        }
      }

      // ensure subcategory reset when category changes
      if (name === "category") {
        updated.subcategory = derivedSubcategories[0] || "";
      }

      // if global offer changed, update each pricing option's selling_price
      if (name === "offer") {
        const offerValue = parseFloat(value) || 0;
        updated.pricing_options = (updated.pricing_options || []).map((opt) => {
          const mrpVal = parseFloat(opt.mrp) || 0;
          if (mrpVal > 0) {
            const calc = mrpVal - mrpVal * (offerValue / 100);
            return {
              ...opt,
              selling_price: Math.round(calc).toString(),
              offer: value,
            };
          }
          return { ...opt, offer: value };
        });
        // update total stock (unchanged) but keep consistent
        updated.total_stock = computeTotalStock(
          updated.pricing_options,
        ).toString();
      }

      return updated;
    });
  };

  const addPricingOption = () => {
    setFormData((prev) => ({
      ...prev,
      pricing_options: [
        ...(prev.pricing_options || []),
        {
          weight_volume: "",
          unit: prev.unit || "kg",
          mrp: "",
          selling_price: "",
          offer: "",
          stock_quantity: "0",
        },
      ],
    }));
  };

  const removePricingOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      pricing_options: prev.pricing_options.filter((_, i) => i !== index),
      total_stock: computeTotalStock(
        prev.pricing_options.filter((_, i) => i !== index),
      ).toString(),
    }));
  };

  const handlePricingChange = (index, field, value) => {
    setFormData((prev) => {
      const options = Array.isArray(prev.pricing_options)
        ? [...prev.pricing_options]
        : [];
      options[index] = { ...options[index], [field]: value };

      // if mrp or offer changed, auto-calc selling_price for this option using its offer percent or global discount
      const option = options[index];
      const mrpVal = parseFloat(option.mrp) || 0;
      const offerPct =
        field === "offer"
          ? parseFloat(value) || 0
          : parseFloat(option.offer) || 0;
      const currentOffer = parseFloat(prev.offer) || 0;
      if (field === "offer" && offerPct > 0 && mrpVal > 0) {
        const calc = mrpVal - mrpVal * (offerPct / 100);
        options[index].selling_price = Math.round(calc).toString();
      } else if (field === "mrp") {
        const effectiveOffer = offerPct > 0 ? offerPct : currentOffer;
        if (mrpVal > 0) {
          const calc = mrpVal - mrpVal * (effectiveOffer / 100);
          options[index].selling_price = Math.round(calc).toString();
        } else {
          options[index].selling_price = "";
        }
      }

      const total = computeTotalStock(options);
      return {
        ...prev,
        pricing_options: options,
        total_stock: total.toString(),
      };
    });
  };

  const handleMultipleImageUpload = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      if ((formData.product_images?.length || 0) + files.length > 8) {
        toast.error("Maximum 8 product images allowed.");
        return;
      }

      const imagesArray = await Promise.all(
        files.map(async (file) => {
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          };
          const compressed = await imageCompression(file, options);
          return imageCompression.getDataUrlFromFile(compressed);
        }),
      );

      setFormData((prev) => ({
        ...prev,
        product_images: [...(prev.product_images || []), ...imagesArray],
      }));
      toast.success(`${files.length} image(s) added.`);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed.");
    }
  };

  const handleThumbnailUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      const imageUrl = await imageCompression.getDataUrlFromFile(compressed);
      setFormData((prev) => ({ ...prev, thumbnail_image: imageUrl }));
      toast.success("Thumbnail updated.");
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      toast.error("Thumbnail upload failed.");
    }
  };

  const handleBarcodeUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      const imageUrl = await imageCompression.getDataUrlFromFile(compressed);
      setFormData((prev) => ({ ...prev, barcode_image: imageUrl }));
      toast.success("Barcode image uploaded.");
    } catch (error) {
      console.error("Barcode upload error:", error);
      toast.error("Barcode upload failed.");
    }
  };

  const removeProductImage = (imgIndex) => {
    setFormData((prev) => ({
      ...prev,
      product_images: prev.product_images.filter(
        (_, index) => index !== imgIndex,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.mrp) {
      toast.error("Please fill in the required product details.");
      return;
    }

    setLoading(true);
    try {
      const finalData = {
        ...formData,
        category: formData.category || "General",
        pricing_options: Array.isArray(formData.pricing_options)
          ? formData.pricing_options
          : [],
        minimum_stock: Number(formData.minimum_stock || 0),
        maximum_stock: Number(formData.maximum_stock || 0),
        offer: Number(formData.offer || 0),
        price_plus: Number(formData.price_plus || 0),
        offer_price: Number(formData.offer_price || 0),
        rating: Number(formData.rating || 0),
        review_count: Number(formData.review_count || 0),
        featured_product: formData.featured_product === "Yes",
        best_seller: formData.best_seller === "Yes",
        todays_deal: formData.todays_deal === "Yes",
        return_available: formData.return_available === "Yes",
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // If pricing options exist, derive top-level mrp/selling/stock from the first option for backward compatibility
      if (finalData.pricing_options.length > 0) {
        const first = finalData.pricing_options[0];
        finalData.mrp = Number(first.mrp || finalData.mrp || 0);
        finalData.selling_price = Number(
          first.selling_price || finalData.selling_price || 0,
        );
        finalData.offer = Number(first.offer || formData.offer || 0);
        finalData.offer_price = Number(
          first.selling_price || finalData.selling_price || 0,
        );
        finalData.stock_quantity = Number(
          first.stock_quantity || finalData.stock_quantity || 0,
        );
      } else {
        finalData.mrp = Number(formData.mrp || 0);
        finalData.selling_price = Number(formData.selling_price || 0);
        finalData.offer = Number(formData.offer || 0);
        finalData.offer_price = Number(
          formData.offer_price || formData.selling_price || 0,
        );
        finalData.stock_quantity = Number(formData.stock_quantity || 0);
      }

      // include computed total stock
      finalData.total_stock = Number(
        formData.total_stock ||
          computeTotalStock(finalData.pricing_options) ||
          0,
      );

      if (isEdit) {
        await api.put(`/products/${id}`, finalData);
        toast.success("Product updated successfully.");
      } else {
        await api.post("/products", finalData);
        toast.success("Product added successfully.");
      }

      setTimeout(() => navigate("/admin/products/all"), 1500);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Operation failed.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold">Fetching product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              {isEdit ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-sm text-gray-500">
              Manage the product details, inventory, media, and status.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
          SKU: {formData.product_code || "Generating..."}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FiLayers size={20} />
              </span>
              <h2 className="text-xl font-black text-slate-800">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Product Code (SKU)
                </label>
                <input
                  type="text"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleFormChange}
                  placeholder="SKU"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Barcode
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleFormChange}
                  placeholder="Barcode"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                  disabled={derivedSubcategories.length === 0}
                >
                  <option value="">Select subcategory</option>
                  {derivedSubcategories.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  placeholder="Brand name"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="Describe the product"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center justify-between mb-4">
  {/* Left Side */}
  <div className="flex items-center gap-3">
    <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
      <FaRupeeSign size={20} />
    </span>

    <div>
      <h2 className="text-xl font-black text-slate-800">
        Pricing & Inventory
      </h2>
      <p className="text-sm text-slate-500">
        Add multiple pricing and inventory options
      </p>
    </div>
  </div>

  {/* Right Side */}
  <button
    type="button"
    onClick={addPricingOption}
    className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    +
  </button>
</div>

            {/* Multiple pricing options */}
            <div className="mt-4">
             
              <div className="space-y-3">
                {(formData.pricing_options || []).map((opt, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border border-gray-100 rounded-3xl bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black text-gray-400">
                          Weight
                        </label>
                        <input
                          type="text"
                          value={opt.weight_volume}
                          onChange={(e) =>
                            handlePricingChange(
                              idx,
                              "weight_volume",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-white rounded-2xl text-sm border border-gray-200"
                          placeholder="e.g. 1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-gray-400">
                          Unit
                        </label>
                        <select
                          value={opt.unit}
                          onChange={(e) =>
                            handlePricingChange(idx, "unit", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-2xl text-sm border border-gray-200"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                          <option value="L">L</option>
                          <option value="pcs">pcs</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-black text-gray-400">
                          MRP
                        </label>
                        <input
                          type="number"
                          value={opt.mrp}
                          onChange={(e) =>
                            handlePricingChange(idx, "mrp", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-2xl text-sm border border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black text-gray-400">
                          Offer %
                        </label>
                        <input
                          type="number"
                          value={opt.offer}
                          onChange={(e) =>
                            handlePricingChange(idx, "offer", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white rounded-2xl text-sm border border-gray-200"
                        />
                      </div>
                  
                      <div>
                        <label className="text-xs font-black text-gray-400">
                          Selling
                        </label>
                        <input
                          type="number"
                          value={opt.selling_price}
                          onChange={(e) =>
                            handlePricingChange(
                              idx,
                              "selling_price",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-white rounded-2xl text-sm border border-gray-200"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePricingOption(idx)}
                          className="w-full h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all"
                          disabled={formData.pricing_options.length === 1}
                          title={
                            formData.pricing_options.length === 1
                              ? "Keep at least one pricing option"
                              : "Remove option"
                          }
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

               
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Total Stock
              </label>
              <input
                type="number"
                name="total_stock"
                value={formData.total_stock}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm font-semibold text-slate-800"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturing_date"
                  value={formData.manufacturing_date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Country of Origin
                </label>
                <input
                  type="text"
                  name="country_of_origin"
                  value={formData.country_of_origin}
                  onChange={handleFormChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleFormChange}
                  placeholder="Supplier name"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <FiImage size={20} />
              </span>
              <h2 className="text-xl font-black text-slate-800">Media</h2>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Product Images (Multiple)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-8 cursor-pointer hover:border-blue-500 transition-colors">
                <FiUploadCloud size={24} className="text-gray-400" />
                <span className="mt-2 text-sm font-semibold text-slate-600">
                  Upload product images
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={handleMultipleImageUpload}
                />
              </label>
              {formData.product_images?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.product_images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="h-28 w-full object-cover rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeProductImage(index)}
                        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-red-600/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Thumbnail Image
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-6 cursor-pointer hover:border-blue-500 transition-colors">
                <FiUploadCloud size={20} className="text-gray-400" />
                <span className="mt-2 text-sm font-semibold text-slate-600">
                  Upload thumbnail
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                />
              </label>
              {formData.thumbnail_image && (
                <img
                  src={formData.thumbnail_image}
                  alt="Thumbnail"
                  className="h-32 w-full object-cover rounded-2xl"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Barcode Image
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-6 cursor-pointer hover:border-blue-500 transition-colors">
                <FiUploadCloud size={20} className="text-gray-400" />
                <span className="mt-2 text-sm font-semibold text-slate-600">
                  Upload barcode image
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBarcodeUpload}
                />
              </label>
              {formData.barcode_image ? (
                <img
                  src={formData.barcode_image}
                  alt="Barcode"
                  className="h-32 w-full object-contain rounded-2xl"
                />
              ) : (
                renderBarcodeSvg(formData.barcode)
              )}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiInfo size={20} />
              </span>
              <h2 className="text-xl font-black text-slate-800">
                Status & Flags
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Featured Product
                </label>
                <select
                  name="featured_product"
                  value={formData.featured_product}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Best Seller
                </label>
                <select
                  name="best_seller"
                  value={formData.best_seller}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Today's Deal
                </label>
                <select
                  name="todays_deal"
                  value={formData.todays_deal}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Delivery Time
                </label>
                <input
                  type="text"
                  name="delivery_time"
                  value={formData.delivery_time}
                  onChange={handleFormChange}
                  placeholder="e.g. 2-3 Days"
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Return Available
                </label>
                <select
                  name="return_available"
                  value={formData.return_available}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Rating
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                >
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Review Count
                </label>
                <input
                  type="number"
                  name="review_count"
                  value={formData.review_count}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Created At
                </label>
                <input
                  type="datetime-local"
                  name="created_at"
                  value={formData.created_at?.slice(0, 16) || ""}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Updated At
                </label>
                <input
                  type="datetime-local"
                  name="updated_at"
                  value={formData.updated_at?.slice(0, 16) || ""}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 px-8 rounded-4xl text-lg font-black shadow-lg hover:bg-black transition-all disabled:bg-slate-400"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <FiSave size={18} />
                <span>{isEdit ? "Update Product" : "Add Product"}</span>
              </>
            )}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default AddProducts;
