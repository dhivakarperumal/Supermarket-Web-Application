import React, { useState } from "react";
import "./Coupons.css";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  ArrowLeft, 
  Ticket, 
  Percent, 
  Calendar, 
  Users, 
  ShoppingBag,
  RefreshCw,
  Save,
  X,
  LayoutGrid,
  List
} from "lucide-react";

// --- DUMMY DATA ---
const initialCoupons = [
  {
    id: "CPN-001",
    code: "SUMMER50",
    name: "Summer Splash 50%",
    description: "Get 50% off on summer collections.",
    type: "Percentage Discount",
    discountValue: "50%",
    minOrder: "₹1000",
    maxDiscount: "₹2000",
    validFrom: "2026-06-01 00:00",
    validUntil: "2026-06-30 23:59",
    usageLimit: "1000",
    usedCount: "342",
    customerLimit: "1",
    categories: "Clothing, Accessories",
    products: "All",
    users: "All",
    status: "Active",
    createdBy: "Admin",
    createdDate: "2026-05-15",
    lastUpdated: "2026-05-20",
  },
  {
    id: "CPN-002",
    code: "WELCOME100",
    name: "First Order Flat 100",
    description: "Flat ₹100 off on first purchase.",
    type: "Flat Discount",
    discountValue: "₹100",
    minOrder: "₹500",
    maxDiscount: "₹100",
    validFrom: "2026-01-01 00:00",
    validUntil: "2026-12-31 23:59",
    usageLimit: "Unlimited",
    usedCount: "890",
    customerLimit: "1",
    categories: "All",
    products: "All",
    users: "New Users",
    status: "Active",
    createdBy: "System",
    createdDate: "2026-01-01",
    lastUpdated: "2026-01-01",
  }
];

const Coupons = () => {
  const [view, setView] = useState("list"); // "list" | "form"
  const [listMode, setListMode] = useState("table"); // "table" | "card"
  const [coupons, setCoupons] = useState(initialCoupons);
  const [generatedCode, setGeneratedCode] = useState("");
  
  const [scope, setScope] = useState({
    products: 'All Products',
    categories: 'Selected Categories',
    brands: 'All Brands',
    vendors: 'All Vendors'
  });

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  const inactiveCoupons = coupons.filter(c => c.status !== 'Active').length;

  const handleGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(code);
  };

  const renderListView = () => (
    <>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-title">
          <h1>Coupons Management</h1>
          <p>Create, manage, and track all discount codes and promotions.</p>
        </div>
        <button className="btn-primary" onClick={() => setView("form")}>
          <Plus size={18} /> Add New Coupon
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-container" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '12px' }}><Ticket size={24} style={{ color: '#3b82f6' }} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Coupons</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{totalCoupons}</h2>
          </div>
        </div>
        <div className="glass-container" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '12px' }}><RefreshCw size={24} style={{ color: '#10b981' }} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Coupons</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{activeCoupons}</h2>
          </div>
        </div>
        <div className="glass-container" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '12px' }}><X size={24} style={{ color: '#ef4444' }} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Inactive Coupons</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{inactiveCoupons}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} size={18} />
          <input 
            type="text" 
            placeholder="Search coupons..." 
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setListMode('table')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: listMode === 'table' ? 'white' : 'transparent', border: 'none', boxShadow: listMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', color: listMode === 'table' ? '#0f172a' : '#64748b', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <List size={18} /> Table
          </button>
          <button 
            onClick={() => setListMode('card')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: listMode === 'card' ? 'white' : 'transparent', border: 'none', boxShadow: listMode === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', color: listMode === 'card' ? '#0f172a' : '#64748b', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <LayoutGrid size={18} /> Cards
          </button>
        </div>
      </div>

      {listMode === 'table' ? (
        <div className="glass-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Coupon ID</th>
                  <th>Coupon Code</th>
                  <th>Coupon Name</th>
                  <th>Description</th>
                  <th>Coupon Type</th>
                  <th>Discount Value</th>
                  <th>Min Order</th>
                  <th>Max Discount</th>
                  <th>Valid From</th>
                  <th>Valid Until</th>
                  <th>Usage Limit</th>
                  <th>Used Count</th>
                  <th>Customer Limit</th>
                  <th>Categories</th>
                  <th>Products</th>
                  <th>Users</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, index) => (
                  <tr key={index}>
                    <td><span style={{ fontWeight: 'bold', color: '#64748b' }}>{coupon.id}</span></td>
                    <td><span className="badge badge-type" style={{ fontSize: '0.85rem' }}>{coupon.code}</span></td>
                    <td style={{ fontWeight: '600' }}>{coupon.name}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coupon.description}</td>
                    <td>{coupon.type}</td>
                    <td style={{ fontWeight: 'bold', color: '#10b981' }}>{coupon.discountValue}</td>
                    <td>{coupon.minOrder}</td>
                    <td>{coupon.maxDiscount}</td>
                    <td>{coupon.validFrom}</td>
                    <td>{coupon.validUntil}</td>
                    <td>{coupon.usageLimit}</td>
                    <td>{coupon.usedCount}</td>
                    <td>{coupon.customerLimit}</td>
                    <td>{coupon.categories}</td>
                    <td>{coupon.products}</td>
                    <td>{coupon.users}</td>
                    <td>
                      <span className={`badge ${coupon.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td>{coupon.createdBy}</td>
                    <td>{coupon.createdDate}</td>
                    <td>{coupon.lastUpdated}</td>
                    <td>
                      <button className="action-btn"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {coupons.map((coupon, index) => (
            <div key={index} className="glass-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{coupon.name}</h3>
                    <span className={`badge ${coupon.status === 'Active' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.7rem' }}>{coupon.status}</span>
                  </div>
                  <span className="badge badge-type" style={{ fontSize: '0.8rem', display: 'inline-block', marginBottom: '0.5rem' }}>{coupon.code}</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{coupon.description}</p>
                </div>
                <button className="action-btn" style={{ padding: '0.25rem' }}><MoreVertical size={18} /></button>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', border: '1px solid #e2e8f0' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Discount</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>{coupon.discountValue}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Usage</p>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>{coupon.usedCount} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ {coupon.usageLimit}</span></p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} style={{ color: '#94a3b8' }}/> Ends:</span>
                  <span style={{ fontWeight: 600 }}>{coupon.validUntil.split(' ')[0]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShoppingBag size={14} style={{ color: '#94a3b8' }}/> Min Order:</span>
                  <span style={{ fontWeight: 600 }}>{coupon.minOrder}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={14} style={{ color: '#94a3b8' }}/> Scope:</span>
                  <span style={{ fontWeight: 600 }}>{coupon.users}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderFormView = () => (
    <div className="glass-container form-view">
      <div className="form-header">
        <button className="btn-secondary" onClick={() => setView("list")} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="page-title" style={{ margin: 0 }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Add New Coupon</h1>
        </div>
      </div>

      {/* Basic Information */}
      <div className="form-section">
        <h3 className="form-section-title"><Ticket className="icon" /> Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Coupon Code</label>
            <div className="input-with-action">
              <input type="text" className="form-input" value={generatedCode} onChange={(e) => setGeneratedCode(e.target.value)} placeholder="e.g. SUMMER50" />
              <button type="button" className="btn-secondary" onClick={handleGenerateCode} style={{ padding: '0.75rem', borderRadius: '12px' }}>
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Coupon Name</label>
            <input type="text" className="form-input" placeholder="e.g. Summer Splash Sale" />
          </div>
          <div className="form-group">
            <label className="form-label">Coupon Type</label>
            <select className="form-select">
              <option>Percentage Discount</option>
              <option>Flat Discount</option>
              <option>Free Delivery</option>
              <option>Buy One Get One (BOGO)</option>
              <option>Cashback</option>
              <option>First Order</option>
              <option>Festival Offer</option>
              <option>Referral Coupon</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Internal notes or public description for the coupon..."></textarea>
          </div>
        </div>
      </div>

      {/* Discount Settings */}
      <div className="form-section">
        <h3 className="form-section-title"><Percent className="icon" /> Discount Settings</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Discount Percentage (%)</label>
            <input type="number" className="form-input" placeholder="e.g. 15" />
          </div>
          <div className="form-group">
            <label className="form-label">Flat Amount (₹)</label>
            <input type="number" className="form-input" placeholder="e.g. 500" />
          </div>
          <div className="form-group">
            <label className="form-label">Minimum Order Value (₹)</label>
            <input type="number" className="form-input" placeholder="e.g. 1000" />
          </div>
        </div>
      </div>

      {/* Validity */}
      <div className="form-section">
        <h3 className="form-section-title"><Calendar className="icon" /> Validity</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input type="date" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input type="time" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input type="time" className="form-input" />
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="form-section">
        <h3 className="form-section-title"><Users className="icon" /> Usage Limits</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Total Usage Limit</label>
            <input type="number" className="form-input" placeholder="Leave blank for unlimited" />
          </div>
          <div className="form-group">
            <label className="form-label">Usage Per Customer</label>
            <input type="number" className="form-input" placeholder="e.g. 1" />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Usage Limit</label>
            <input type="number" className="form-input" placeholder="e.g. 100" />
          </div>
        </div>
      </div>

      {/* Applicable For */}
      <div className="form-section">
        <h3 className="form-section-title"><ShoppingBag className="icon" /> Applicable For</h3>
        <div className="form-grid">
          {/* Products */}
          <div className="form-group" style={{ gridColumn: scope.products === 'Selected Products Only' ? '1 / -1' : 'auto' }}>
            <label className="form-label">Products</label>
            <select 
              className="form-select" 
              value={scope.products} 
              onChange={e => setScope({...scope, products: e.target.value})}
            >
              <option>All Products</option>
              <option>Selected Products Only</option>
            </select>
            {scope.products === 'Selected Products Only' && (
              <div style={{ marginTop: '0.75rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input type="text" className="form-input" placeholder="Search and select products..." />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e2e8f0' }}>Organic Apples <X size={14} style={{ cursor: 'pointer', color: '#94a3b8' }}/></span>
                  <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e2e8f0' }}>Whole Wheat Bread <X size={14} style={{ cursor: 'pointer', color: '#94a3b8' }}/></span>
                </div>
              </div>
            )}
          </div>
          
          {/* Categories */}
          <div className="form-group" style={{ gridColumn: scope.categories === 'Selected Categories' ? '1 / -1' : 'auto' }}>
            <label className="form-label">Categories</label>
            <select 
              className="form-select" 
              value={scope.categories} 
              onChange={e => setScope({...scope, categories: e.target.value})}
            >
              <option>All Categories</option>
              <option>Selected Categories</option>
            </select>
            {scope.categories === 'Selected Categories' && (
              <div style={{ marginTop: '0.75rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input type="text" className="form-input" placeholder="Search and select categories..." />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <span style={{ background: '#d1fae5', color: '#059669', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #a7f3d0' }}>Fruits & Vegetables <X size={14} style={{ cursor: 'pointer', color: '#059669' }}/></span>
                  <span style={{ background: '#d1fae5', color: '#059669', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #a7f3d0' }}>Dairy Products <X size={14} style={{ cursor: 'pointer', color: '#059669' }}/></span>
                </div>
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="form-group" style={{ gridColumn: scope.brands === 'Selected Brands' ? '1 / -1' : 'auto' }}>
            <label className="form-label">Brands</label>
            <select 
              className="form-select" 
              value={scope.brands} 
              onChange={e => setScope({...scope, brands: e.target.value})}
            >
              <option>All Brands</option>
              <option>Selected Brands</option>
            </select>
            {scope.brands === 'Selected Brands' && (
              <div style={{ marginTop: '0.75rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input type="text" className="form-input" placeholder="Search and select brands..." />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e2e8f0' }}>Amul <X size={14} style={{ cursor: 'pointer', color: '#94a3b8' }}/></span>
                </div>
              </div>
            )}
          </div>

          {/* Vendors */}
          <div className="form-group" style={{ gridColumn: scope.vendors === 'Selected Vendors' ? '1 / -1' : 'auto' }}>
            <label className="form-label">Vendors</label>
            <select 
              className="form-select" 
              value={scope.vendors} 
              onChange={e => setScope({...scope, vendors: e.target.value})}
            >
              <option>All Vendors</option>
              <option>Selected Vendors</option>
            </select>
            {scope.vendors === 'Selected Vendors' && (
              <div style={{ marginTop: '0.75rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input type="text" className="form-input" placeholder="Search and select vendors..." />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={() => setView("list")}>Cancel</button>
        <button className="btn-primary" onClick={() => setView("list")}><Save size={18} /> Save Coupon</button>
      </div>
    </div>
  );

  return (
    <div className="coupons-page">
      {view === "list" ? renderListView() : renderFormView()}
    </div>
  );
};

export default Coupons;
