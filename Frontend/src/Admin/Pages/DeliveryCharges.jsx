import React from "react";
import "./Coupons.css"; // Reuse the glassmorphism styles we just built
import { Truck, Save, RotateCcw } from "lucide-react";

const DeliveryCharges = () => {
  return (
    <div className="coupons-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Delivery Charges Settings</h1>
          <p>Configure standard and express delivery options, fees, and operational radiuses.</p>
        </div>
      </div>

      <div className="glass-container form-view" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Standard Delivery Settings */}
        <div className="form-section">
          <h3 className="form-section-title"><Truck className="icon" /> Standard Delivery Settings</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Base Delivery Charge (₹)</label>
              <input type="number" className="form-input" placeholder="e.g. 50" defaultValue="50" />
            </div>
            <div className="form-group">
              <label className="form-label">Free Delivery Minimum Order Amount (₹)</label>
              <input type="number" className="form-input" placeholder="e.g. 500" defaultValue="500" />
            </div>
            <div className="form-group">
              <label className="form-label">Per KM Delivery Charge (₹)</label>
              <input type="number" className="form-input" placeholder="e.g. 10" defaultValue="10" />
            </div>
            <div className="form-group">
              <label className="form-label">Maximum Delivery Distance (KM)</label>
              <input type="number" className="form-input" placeholder="e.g. 15" defaultValue="15" />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Area Scope</label>
              <select className="form-select" defaultValue="City">
                <option value="Local">Local</option>
                <option value="City">City</option>
                <option value="Custom Radius">Custom Radius</option>
              </select>
            </div>
          </div>
        </div>

        {/* Express Delivery Settings */}
        <div className="form-section" style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #bae6fd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="form-section-title" style={{ margin: 0, color: '#0284c7' }}>
              <Truck className="icon" style={{ color: '#0284c7' }} /> Express Delivery
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', color: '#0284c7' }}>
              <input type="checkbox" style={{ width: '1.2rem', height: '1.2rem' }} defaultChecked />
              Enable Express Delivery
            </label>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{ color: '#0369a1' }}>Express Delivery Charge (₹)</label>
              <input type="number" className="form-input" placeholder="e.g. 100" defaultValue="100" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: '#0369a1' }}>Estimated Delivery Time</label>
              <input type="text" className="form-input" placeholder="e.g. 30 Mins" defaultValue="30 Mins" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions" style={{ borderTop: 'none', marginTop: '1rem' }}>
          <button className="btn-secondary">
            <RotateCcw size={18} /> Reset Settings
          </button>
          <button className="btn-primary">
            <Save size={18} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeliveryCharges;
