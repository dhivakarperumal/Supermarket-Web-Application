import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import { AuthContext } from "../../PrivateRouter/AuthContext";
import api from "../../api";
import PageHeader from "../CommenComponents/PageHeader";
import toast from "react-hot-toast";
import { FiMapPin, FiPackage, FiCreditCard, FiShield, FiCheckCircle } from "react-icons/fi";
import PageContainer from "../CommenComponents/PageContainer";

const Checkout = () => {
  const { cart, clearCart } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.product;
  const buyNowVariant = location.state?.variant;
  const buyNowSize = location.state?.size;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState({ loading: false, error: "", distanceKm: null });
  const [deliveryCharges, setDeliveryCharges] = useState(null);
  const [deliveryChargeError, setDeliveryChargeError] = useState("");
  const buyNowQuantity = location.state?.quantity || 1;
  const SHOP_ADDRESS =
    "3, 1st St, Mohammed Pura, Flower Bazar, Ambur, Tamil Nadu 635802";
  const SHOP_COORDINATES = {
    lat: 12.7854,
    lng: 78.7184,
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get(`/addresses/user/${user.user_id}`);
      const userAddresses = res.data || [];
      setAddresses(userAddresses);

      const defaultAddr = userAddresses.find((a) => a.is_default) || userAddresses[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
        setForm((prev) => ({
          ...prev,
          customer_name: defaultAddr.customer_name || "",
          customer_email: defaultAddr.customer_email || "",
          customer_phone: defaultAddr.customer_phone || "",
          street_address: defaultAddr.street_address || "",
          city: defaultAddr.city || "",
          district: defaultAddr.district || "",
          state: defaultAddr.state || "",
          country: defaultAddr.country || "India",
          zip_code: defaultAddr.zip_code || "",
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectAddress = (address) => {
    setSelectedAddress(address.id);
    setForm((prev) => ({
      ...prev,
      customer_name: address.customer_name,
      customer_email: address.customer_email || "",
      customer_phone: address.customer_phone || "",
      street_address: address.street_address,
      city: address.city || "",
      district: address.district || "",
      state: address.state || "",
      country: address.country || "India",
      zip_code: address.zip_code || "",
    }));
  };

  useEffect(() => {
    if (user?.user_id) fetchAddresses();
  }, [user]);

  const fetchDeliveryCharges = async () => {
    try {
      const res = await api.get("/delivery-charges");
      console.log("Delivery charges API response:", res.data);
      
      let chargesData = null;
      // API returns { success: true, data: settings }
      if (res.data?.data) {
        chargesData = res.data.data;
      } else if (res.data && !res.data.success) {
        // Fallback: handle both array and object responses
        if (Array.isArray(res.data)) {
          chargesData = res.data.length > 0 ? res.data[0] : null;
        } else if (typeof res.data === 'object') {
          chargesData = res.data;
        }
      }
      
      if (chargesData && chargesData.id) {
        setDeliveryCharges(chargesData);
        console.log("Delivery charges set to:", chargesData);
        setDeliveryChargeError("");
      } else {
        console.warn("No delivery charges data found");
        setDeliveryChargeError("No delivery charges configured");
      }
    } catch (error) {
      console.error("Error fetching delivery charges:", error);
      setDeliveryChargeError("Unable to fetch delivery charges");
    }
  };

  useEffect(() => {
    fetchDeliveryCharges();
  }, []);

  // Recalculate delivery charge when distance or charges change
  useEffect(() => {
    if (distanceInfo.distanceKm && deliveryCharges) {
      console.log("Recalculating delivery charge with distance:", distanceInfo.distanceKm, "and charges:", deliveryCharges);
    }
  }, [distanceInfo.distanceKm, deliveryCharges]);

  const calculateDeliveryCharge = (distanceKm, orderSubtotal) => {
    if (!deliveryCharges) return { charge: 0, message: "Delivery charges not available" };
    if (distanceKm === null || distanceKm === undefined) return { charge: 0, message: "" };

    const baseCharge = parseFloat(deliveryCharges.base_delivery_charge) || 0;
    const perKmCharge = parseFloat(deliveryCharges.per_km_delivery_charge) || 0;
    const maxDistance = parseFloat(deliveryCharges.maximum_delivery_distance) || 100;
    const freeDeliveryThreshold = parseFloat(deliveryCharges.free_delivery_minimum_order_amount) || 0;

    // Check if distance exceeds maximum delivery distance
    if (distanceKm > maxDistance) {
      return {
        charge: 0,
        message: `Delivery not available beyond ${maxDistance} km. Current distance: ${distanceKm} km`,
        isError: true,
      };
    }

    // Apply free delivery if order is above threshold
    if (orderSubtotal >= freeDeliveryThreshold) {
      return { charge: 0, message: `Free delivery on orders ₹${freeDeliveryThreshold} and above` };
    }

    // Calculate delivery charge
    const calculatedCharge = baseCharge + distanceKm * perKmCharge;
    return {
      charge: Math.round(calculatedCharge * 100) / 100,
      message: `Base ₹${baseCharge} + ${distanceKm}km × ₹${perKmCharge}/km`,
    };
  };

  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const detectDistanceToShop = () => {
    if (!navigator.geolocation) {
      setDistanceInfo({ loading: false, error: "Location access is not supported by this browser.", distanceKm: null });
      return;
    }

    setDistanceInfo((prev) => ({ ...prev, loading: true, error: "" }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const shopLat = SHOP_COORDINATES.lat;
          const shopLng = SHOP_COORDINATES.lng;
          const distance = calculateDistanceKm(userLat, userLng, shopLat, shopLng);

          // Fetch fresh delivery charges first
          let freshCharges = deliveryCharges;
          try {
            const res = await api.get("/delivery-charges");
            if (res.data && res.data.length > 0) {
              freshCharges = res.data[0];
              setDeliveryCharges(freshCharges);
              console.log("Updated delivery charges:", freshCharges);
            }
          } catch (error) {
            console.error("Error fetching delivery charges:", error);
          }

          const reverseResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLat}&lon=${userLng}&addressdetails=1`
          );
          const reverseData = await reverseResponse.json();
          const address = reverseData?.address || {};

          setForm((prev) => ({
            ...prev,
            street_address:
              [address.house_number, address.road, address.pedestrian, address.suburb]
                .filter(Boolean)
                .join(" ") || prev.street_address || "",
            city:
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              prev.city ||
              "",
            district:
              address.district ||
              address.county ||
              address.state_district ||
              prev.district ||
              "",
            state: address.state || prev.state || "",
            country: address.country || prev.country || "India",
            zip_code: address.postcode || prev.zip_code || "",
          }));

          console.log("Distance calculated:", distance, "Delivery charges object:", freshCharges);
          setDistanceInfo({ loading: false, error: "", distanceKm: Number(distance.toFixed(1)) });
        } catch (error) {
          console.error(error);
          setDistanceInfo({ loading: false, error: "We could not calculate the distance right now.", distanceKm: null });
        }
      },
      (error) => {
        let message = "We could not access your location.";
        if (error.code === 1) message = "Location permission was denied. Please allow location access to see the distance.";
        else if (error.code === 2) message = "Your location is currently unavailable.";
        else if (error.code === 3) message = "Location request timed out.";

        setDistanceInfo({ loading: false, error: message, distanceKm: null });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
  ];

  const checkoutItems = buyNowProduct
    ? [
      {
        id: buyNowProduct.id,
        name: buyNowProduct.name,
        image: buyNowVariant?.images?.[0] || buyNowProduct?.thumbnail_image || "/placeholder.png",
        price: buyNowProduct.offer_price || buyNowProduct.price,
        quantity: buyNowQuantity,
        size: buyNowSize,
        colorName: buyNowVariant?.color,
      },
    ]
    : cart;

  const [form, setForm] = useState({
    user_id: user?.user_id || "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    street_address: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    zip_code: "",
    payment_method: "Online Payment",
  });

  const subtotal = checkoutItems.reduce((total, item) => total + parseFloat(item.price || 0) * item.quantity, 0);
  const deliveryInfo = calculateDeliveryCharge(distanceInfo.distanceKm, subtotal);
  const shipping = deliveryInfo.charge;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });

  const saveOrder = async (paymentId = null) => {
    try {
      const orderItems = checkoutItems.map((item) => ({
        product_id: item.product_id || item.id,
        name: item.name,
        quantity: item.quantity,
        variant_color: item.variant_color || item.colorName || "",
        variant_size: item.variant_size || item.size || "",
        price: item.price,
        image: item.image,
        email: form.customer_email,
        user_id: user?.user_id,
      }));

      const orderData = {
        ...form,
        user_id: user?.user_id,
        email: form.customer_email,
        payment_status: paymentMethod === "razorpay" ? "paid" : "pending",
        payment_id: paymentId,
        items: orderItems,
        total_amount: total,
        delivery_charge: shipping,
        distance_km: distanceInfo.distanceKm,
        created_at: new Date().toISOString(),
      };

      await api.post("/orders", orderData);
      await clearCart();

      setForm({
        user_id: user?.user_id || "",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        street_address: "",
        city: "",
        district: "",
        state: "",
        country: "India",
        zip_code: "",
        payment_method: "Showroom",
      });

      toast.success("Order Placed Successfully!");
      navigate("/account?tab=orders");
    } catch (error) {
      console.error(error);
      alert("Order failed");
    }
  };

  const handleOrder = async () => {
    if (!form.customer_name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!form.customer_email.trim()) {
      toast.error("Please enter email");
      return;
    }
    if (!form.customer_phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }
    if (!form.street_address.trim()) {
      toast.error("Please enter street address");
      return;
    }
    if (!form.city.trim()) {
      toast.error("Please enter city");
      return;
    }
    if (!form.district.trim()) {
      toast.error("Please enter district");
      return;
    }
    if (!form.state.trim()) {
      toast.error("Please select state");
      return;
    }
    if (!form.zip_code.trim()) {
      toast.error("Please enter zip code");
      return;
    }
    if (!checkoutItems.length) {
      alert("No product to checkout");
      return;
    }
    if (deliveryInfo.isError) {
      toast.error(deliveryInfo.message || "Delivery not available for this location");
      return;
    }

    try {
      if (paymentMethod === "cod") {
        await saveOrder();
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key: "rzp_test_SGj8n5SyKSE10b",
        amount: total * 100,
        currency: "INR",
        name: "Saree World",
        description: "Order Payment",
        handler: async function (response) {
          console.log("Payment Success:", response);
          await saveOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: form.customer_name,
          email: form.customer_email,
          contact: form.customer_phone,
        },
        theme: {
          color: "#0e6827",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  return (
    <>
      <PageHeader title="Checkout" />

      <div className="min-h-screen bg-[#f7f8f3] py-8 sm:py-10">
        <PageContainer>
          <div className="mx-auto ">
            {/* <div className="mb-8 rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">Secure checkout</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">Checkout</h1>
                  <p className="mt-2 text-sm text-slate-500">Complete your order in a few simple steps with your preferred payment method.</p>
                </div>
                <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-[#0e6827]">{checkoutItems.length} item{checkoutItems.length === 1 ? "" : "s"}</div>
              </div>
            </div> */}

            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
                  <div className="mb-4 flex items-center gap-2">
                    <FiMapPin className="text-[#0e6827]" />
                    <h2 className="text-lg font-semibold text-slate-800">Delivery Distance</h2>
                  </div>
                  <p className="text-sm text-slate-500">Click the button below to fetch your current location and estimate the distance to our shop.</p>

                  
                    <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm">
                      <p className="text-slate-700">
                        <span className="font-semibold">Max Delivery Distance:</span> {deliveryCharges?.maximum_delivery_distance || "N/A"} km
                      </p>
                    </div>

                  <div className="mt-4 rounded-[1.25rem] border border-green-100 bg-green-50 p-4">
                    {!distanceInfo.distanceKm && !distanceInfo.error && !distanceInfo.loading ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm text-slate-600">No location fetched yet.</p>
                        <button type="button" onClick={detectDistanceToShop} className="w-fit rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-[#0e6827] transition hover:border-green-300 hover:bg-green-100">
                          Fetch location
                        </button>
                      </div>
                    ) : distanceInfo.loading ? (
                      <p className="text-sm text-slate-600">Fetching your current location...</p>
                    ) : distanceInfo.distanceKm !== null ? (
                      <>
                        <p className="text-sm text-slate-600">Shop address</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{SHOP_ADDRESS}</p>
                        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-500">Estimated distance</p>
                            <p className="text-2xl font-bold text-[#0e6827]">{distanceInfo.distanceKm} km</p>
                            {deliveryCharges && distanceInfo.distanceKm !== null && (
                              <p className="mt-2 text-xs text-slate-600">
                                {deliveryInfo.isError ? (
                                  <span className="text-red-600">{deliveryInfo.message}</span>
                                ) : (
                                  <span className="text-green-600">{deliveryInfo.message}</span>
                                )}
                              </p>
                            )}
                          </div>
                          <button type="button" onClick={detectDistanceToShop} className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-[#0e6827] transition hover:border-green-300 hover:bg-green-100">
                            Fetch location
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600">{distanceInfo.error || "We could not calculate the distance right now."}</p>
                        <button type="button" onClick={detectDistanceToShop} className="mt-3 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-[#0e6827] transition hover:border-green-300 hover:bg-green-100">
                          Fetch location
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* {addresses.length > 0 && (
                  <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
                    <div className="mb-4 flex items-center gap-2">
                      <FiMapPin className="text-[#0e6827]" />
                      <h2 className="text-lg font-semibold text-slate-800">Saved Addresses</h2>
                    </div>
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => selectAddress(addr)}
                          className={`cursor-pointer rounded-[1.25rem] border p-4 transition ${selectedAddress === addr.id ? "border-[#0e6827] bg-green-50" : "border-gray-200 hover:border-green-300"}`}
                        >
                          <p className="text-sm leading-6 text-slate-700">
                            <span className="font-semibold text-slate-900">{addr.customer_name}</span>
                            <br />
                            {addr.street_address}
                            <br />
                            {addr.city}, {addr.district}
                            <br />
                            {addr.state} - {addr.zip_code}
                            <br />
                            {addr.country}
                            <br />
                            Phone: {addr.customer_phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
                  <div className="mb-4 flex items-center gap-2">
                    <FiPackage className="text-[#0e6827]" />
                    <h2 className="text-lg font-semibold text-slate-800">Customer Details</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="customer_name" placeholder="Full Name" value={form.customer_name} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                    <input name="customer_email" placeholder="Email" value={form.customer_email} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                    <input name="customer_phone" placeholder="Phone Number" value={form.customer_phone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
                  <div className="mb-4 flex items-center gap-2">
                    <FiMapPin className="text-[#0e6827]" />
                    <h2 className="text-lg font-semibold text-slate-800">Shipping Address</h2>
                  </div>
                  <textarea name="street_address" placeholder="Street Address" value={form.street_address} onChange={handleChange} rows={3} className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                  <div className="grid gap-4 md:grid-cols-3">
                    <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                    <input name="district" placeholder="District" value={form.district} onChange={handleChange} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                    <select name="state" value={form.state} onChange={handleChange} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100">
                      <option value="">Select State</option>
                      {indianStates.map((state, i) => (
                        <option key={i} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input name="zip_code" placeholder="Zip Code" value={form.zip_code} onChange={handleChange} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#0e6827] focus:bg-white focus:ring-2 focus:ring-green-100" />
                    <input name="country" value="India" readOnly className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm text-slate-500 outline-none" />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
                  <div className="mb-4 flex items-center gap-2">
                    <FiPackage className="text-[#0e6827]" />
                    <h2 className="text-lg font-semibold text-slate-800">Your Items</h2>
                  </div>
                  <div className="space-y-4">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-[1.25rem] border border-gray-100 bg-gray-50 p-3">
                        <img src={item.image || "/placeholder.png"} alt={item.name} className="h-20 w-16 rounded-xl object-cover" onError={(e) => { e.target.src = "/placeholder.png"; }} />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <div className="mt-1 space-y-1 text-sm text-slate-500">
                            <p>Qty: {item.quantity}</p>
                            {item.colorName && (
                              <p className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full border border-gray-400" style={{ backgroundColor: item.colorHex || item.color || "#ccc" }} />
                                <span className="font-semibold text-slate-700">{item.colorName}</span>
                              </p>
                            )}
                            {item.size && <p>Size: {item.size}</p>}
                          </div>
                        </div>
                        <span className="font-semibold text-slate-800">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-24">
                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "font-semibold text-green-600" : "font-semibold text-slate-800"}>
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {deliveryInfo.message && (
                      <div className={`text-xs ${deliveryInfo.isError ? "text-red-600" : "text-green-600"}`}>
                        {deliveryInfo.message}
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-slate-800">
                      <span>Total</span>
                      <span className="text-[#0e6827]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.25rem] border border-green-100 bg-green-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0e6827]">
                      <FiCreditCard />
                      <span>Payment Method</span>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white bg-white px-3 py-3 text-sm text-slate-700 shadow-sm">
                      <input type="radio" name="payment" value="razorpay" checked={paymentMethod === "razorpay"} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <span>Online Payment (Razorpay)</span>
                    </label>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-800">
                    <FiShield />
                    <span>Secure payments and trusted delivery support.</span>
                  </div>

                  <button onClick={handleOrder} className="mt-6 w-full rounded-full bg-[#0e6827] px-4 py-3 font-semibold text-white transition hover:bg-[#168637]">
                    Place Order
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <FiCheckCircle className="text-green-600" />
                    <span>Fast checkout with order confirmation.</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </PageContainer>
      </div>

    </>
  );
};

export default Checkout;
