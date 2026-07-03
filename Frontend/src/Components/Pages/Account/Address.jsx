import React, { useEffect, useState } from "react";
import { useAuth } from "../../../PrivateRouter/AuthContext";
import api from "../../../api";
import { toast } from "react-hot-toast";
import {
  FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX,
  FiUser, FiMail, FiPhone, FiHome
} from "react-icons/fi";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

const emptyForm = (user_id = "") => ({
  user_id,
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  street_address: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  zip_code: "",
  is_default: false
});

export default function Address() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm(user?.user_id));

  const fetchAddresses = async () => {
    if (!user?.user_id) return;
    try {
      setLoading(true);
      const res = await api.get(`/addresses/user/${user.user_id}`);
      setAddresses(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm(emptyForm(user?.user_id));
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.customer_name.trim()) return toast.error("Name is required");
    if (!form.street_address.trim()) return toast.error("Street address is required");

    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, { ...form, user_id: user?.user_id });
        toast.success("Address updated!");
      } else {
        await api.post("/addresses", { ...form, user_id: user?.user_id });
        toast.success("Address added!");
      }
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setForm({ ...address });
    setEditingId(address.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/addresses/${id}/set-default`, { user_id: user?.user_id });
      toast.success("Default address updated");
      fetchAddresses();
    } catch {
      toast.error("Failed to set default");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800">Saved Addresses</h2>
          <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-widest">Manage your delivery locations</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-blue-100"
        >
          <FiPlus size={16} /> Add New
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <FiMapPin className="text-blue-500" />
              {editingId ? "Edit Address" : "New Address"}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-slate-700 p-2 hover:bg-gray-100 rounded-xl transition-all">
              <FiX size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="relative">
              <FiUser size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="customer_name" placeholder="Full Name *" value={form.customer_name} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="customer_email" placeholder="Email" value={form.customer_email} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FiPhone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="customer_phone" placeholder="Phone Number" value={form.customer_phone} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none"
              />
            </div>

            {/* Street Address - full width */}
            <div className="relative md:col-span-2">
              <FiHome size={14} className="absolute left-4 top-4 text-gray-400" />
              <textarea
                name="street_address" placeholder="Street Address *" value={form.street_address} onChange={handleChange} rows={2}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none resize-none"
              />
            </div>

            {/* City */}
            <input
              name="city" placeholder="City" value={form.city} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none"
            />

            {/* District */}
            <input
              name="district" placeholder="District" value={form.district} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none"
            />

            {/* State */}
            <select
              name="state" value={form.state} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Zip Code */}
            <input
              name="zip_code" placeholder="Zip Code" value={form.zip_code} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm font-bold outline-none"
            />

            {/* Country - Read only */}
            <input
              name="country" value={form.country} readOnly
              className="w-full px-4 py-3.5 bg-gray-100 rounded-xl border-2 border-transparent text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
            />

            {/* Set Default checkbox */}
            <label className="flex items-center gap-3 cursor-pointer md:col-span-2">
              <div
                onClick={() => setForm(p => ({ ...p, is_default: !p.is_default }))}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.is_default ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}
              >
                {form.is_default && <FiCheck size={12} className="text-white" />}
              </div>
              <span className="text-sm font-bold text-slate-600">Set as default address</span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-100 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingId ? "Update Address" : "Save Address"}
            </button>
            <button onClick={resetForm} className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-2xl font-black text-sm transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-6 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded-full w-1/2" />
              <div className="h-3 bg-gray-100 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
          <FiMapPin size={32} className="text-gray-300 mx-auto mb-4" />
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs">No addresses saved yet</p>
          <p className="text-xs text-gray-400 mt-1">Add a delivery address to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative bg-white border-2 rounded-[2rem] p-6 transition-all ${address.is_default ? "border-blue-200 shadow-lg shadow-blue-50" : "border-gray-100 shadow-sm"}`}
            >
              {address.is_default && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                  <FiCheck size={10} /> Default
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-blue-500" size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{address.customer_name}</p>
                  <p className="text-xs text-gray-400 font-bold">{address.customer_phone}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-600 leading-5 bg-gray-50 rounded-xl p-4 mb-4">
                <p>{address.street_address}</p>
                {(address.city || address.district) && (
                  <p>{[address.city, address.district].filter(Boolean).join(", ")}</p>
                )}
                {(address.state || address.zip_code) && (
                  <p>{[address.state, address.zip_code].filter(Boolean).join(" - ")}</p>
                )}
                <p className="text-gray-400">{address.country}</p>
              </div>

              <div className="flex items-center gap-2">
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 text-[10px] font-black uppercase tracking-widest py-2 border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-500 rounded-xl transition-all"
                >
                  <FiEdit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-xl transition-all"
                >
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}