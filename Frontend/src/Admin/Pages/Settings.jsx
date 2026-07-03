import React from "react";
import "./Settings.css";
import { 
  Printer, 
  Receipt, 
  CreditCard, 
  Store, 
  Percent, 
  Globe, 
  Barcode, 
  MonitorSmartphone,
  Search,
  Save,
  RotateCcw
} from "lucide-react";

const Toggle = ({ label, defaultChecked = false }) => (
  <div className="toggle-switch">
    <span className="toggle-label">{label}</span>
    <label className="switch">
      <input type="checkbox" defaultChecked={defaultChecked} />
      <span className="slider"></span>
    </label>
  </div>
);

const Input = ({ label, type = "text", placeholder }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input type={type} className="form-input" placeholder={placeholder} />
  </div>
);

const Select = ({ label, options }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <select className="form-select">
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title-area">
          <h1>System Settings</h1>
          <p>Configure your supermarket system, billing, payments, and preferences.</p>
        </div>
        <div className="settings-header-actions">
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} size={18} />
            <input type="text" className="settings-search" placeholder="Search settings..." style={{ paddingLeft: '2.5rem' }} />
          </div>
          <button className="btn-reset flex items-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
          <button className="btn-save-all flex items-center gap-2">
            <Save size={16} /> Save All Changes
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* 1. Print Setup */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><Printer size={24} /></div>
            <div>
              <h3 className="card-title">Print Setup</h3>
              <p className="card-description">Configure printers & paper sizes.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Select label="Printer Selection" options={['EPSON TM-T82', 'TVS RP 3150', 'Generic POS Printer']} />
            <Toggle label="Default Printer" defaultChecked />
            <Select label="Paper Size" options={['58mm', '80mm', 'A4']} />
            <Input label="Print Copies" type="number" placeholder="1" />
            <Toggle label="Auto Print Invoice" defaultChecked />
            <Toggle label="Kitchen Printer" />
            <Toggle label="Barcode Printing" defaultChecked />
            <Toggle label="QR Code Printing" defaultChecked />
            <Toggle label="Cash Drawer Trigger" defaultChecked />
            <Toggle label="Print Logo" defaultChecked />
            <Toggle label="Print Header" defaultChecked />
            <Toggle label="Print Footer" defaultChecked />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Preview</button>
            <button className="btn-primary">Test Print</button>
          </div>
        </div>

        {/* 2. Receipt Settings */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><Receipt size={24} /></div>
            <div>
              <h3 className="card-title">Receipt Settings</h3>
              <p className="card-description">Customize receipt layout and info.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Input label="Store Logo Upload" type="file" />
            <Input label="Store Name" placeholder="Priyam Super Market" />
            <Input label="Address" placeholder="123 Main Street" />
            <Input label="Phone Number" placeholder="+91 9876543210" />
            <Input label="Email" placeholder="contact@priyam.com" />
            <Input label="GST Number" placeholder="22AAAAA0000A1Z5" />
            <Input label="FSSAI Number" placeholder="10022000000000" />
            <Input label="Invoice Prefix" placeholder="INV-" />
            <Select label="Invoice Number Format" options={['YYYY/MM/DD/0001', '00001', 'INV-00001']} />
            <Input label="Currency Symbol" placeholder="₹" />
            <Select label="Date Format" options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
            <Toggle label="Tax Display" defaultChecked />
            <Toggle label="Discount Display" defaultChecked />
            <Toggle label="Barcode Display" defaultChecked />
            <Toggle label="QR Code Display" defaultChecked />
            <Input label="Footer Message" placeholder="Visit again!" />
            <Input label="Thank You Message" placeholder="Thank you for shopping with us." />
            <Input label="Return Policy" placeholder="No returns after 7 days." />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* 3. Payment Integration */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><CreditCard size={24} /></div>
            <div>
              <h3 className="card-title">Payment Integration</h3>
              <p className="card-description">Gateways, UPI, and Card setups.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Select label="Primary Gateway" options={['Razorpay', 'Stripe', 'Paytm', 'PhonePe', 'Google Pay']} />
            <Toggle label="Cash Support" defaultChecked />
            <Toggle label="UPI Support" defaultChecked />
            <Toggle label="Credit/Debit Card" defaultChecked />
            <Input label="Merchant ID" placeholder="MERCHANT_123" />
            <Input label="API Key" type="password" placeholder="••••••••" />
            <Input label="Secret Key" type="password" placeholder="••••••••" />
            <Input label="Webhook URL" placeholder="https://api.yourdomain.com/webhook" />
            <Input label="Callback URL" placeholder="https://yourdomain.com/callback" />
            <Select label="Mode" options={['Live', 'Sandbox']} />
            <Toggle label="Auto Payment Verification" defaultChecked />
            <Toggle label="Refund Support" defaultChecked />
            <Toggle label="Partial Payment" />
            <Toggle label="Wallet Payment" defaultChecked />
            <Toggle label="COD" defaultChecked />
            <Toggle label="EMI Support" />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Test Connection</button>
            <button className="btn-primary">Save Integration</button>
          </div>
        </div>

        {/* 4. Store Settings */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><Store size={24} /></div>
            <div>
              <h3 className="card-title">Store Settings</h3>
              <p className="card-description">Core business and location info.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Input label="Store Name" placeholder="Priyam Super Market" />
            <Input label="Store Logo" type="file" />
            <Input label="Email" placeholder="admin@priyam.com" />
            <Input label="Phone" placeholder="+91 9876543210" />
            <Input label="Address" placeholder="Main Branch, 1st Cross" />
            <Input label="City" placeholder="Bangalore" />
            <Input label="State" placeholder="Karnataka" />
            <Input label="Country" placeholder="India" />
            <Input label="ZIP Code" placeholder="560001" />
            <Input label="GSTIN" placeholder="29AAAAA0000A1Z5" />
            <Input label="FSSAI License" placeholder="11223344556677" />
            <Select label="Business Type" options={['Supermarket', 'Grocery', 'Hypermarket']} />
            <Select label="Timezone" options={['Asia/Kolkata (IST)', 'UTC']} />
            <Select label="Language" options={['English', 'Hindi', 'Tamil']} />
            <Select label="Currency" options={['INR (₹)', 'USD ($)']} />
            <Input label="Opening Time" type="time" />
            <Input label="Closing Time" type="time" />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* 5. Tax & GST Settings */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><Percent size={24} /></div>
            <div>
              <h3 className="card-title">Tax & GST</h3>
              <p className="card-description">Configure GST, SGST, IGST and HSN.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Toggle label="Enable GST" defaultChecked />
            <Select label="Default GST Percentage" options={['0%', '5%', '12%', '18%', '28%']} />
            <Toggle label="CGST Split" defaultChecked />
            <Toggle label="SGST Split" defaultChecked />
            <Toggle label="IGST Support" defaultChecked />
            <Select label="Tax Mode" options={['Tax Exclusive', 'Tax Inclusive']} />
            <Input label="Default HSN Code" placeholder="2106" />
            <Input label="Default SAC Code" placeholder="9983" />
            <Input label="Tax Invoice Prefix" placeholder="TAX-" />
            <Select label="Default Tax Category" options={['Standard Goods', 'Essential Goods', 'Luxury Goods']} />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* 6. Localization */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><Globe size={24} /></div>
            <div>
              <h3 className="card-title">Localization</h3>
              <p className="card-description">Region, Language & formatting.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Select label="System Language" options={['English (US)', 'English (UK)', 'Hindi']} />
            <Select label="System Currency" options={['INR', 'USD', 'EUR', 'GBP']} />
            <Select label="Timezone" options={['Asia/Kolkata', 'America/New_York']} />
            <Select label="Date Format" options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
            <Select label="Time Format" options={['12-hour (AM/PM)', '24-hour']} />
            <Select label="Number Format" options={['1,00,000.00', '100,000.00']} />
            <Toggle label="Multi-language Support" defaultChecked />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* 7. Barcode & Scanner Settings */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><Barcode size={24} /></div>
            <div>
              <h3 className="card-title">Barcode & Scanner</h3>
              <p className="card-description">Barcode formats and scanner inputs.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Select label="Barcode Format" options={['CODE128', 'EAN-13', 'UPC-A']} />
            <Input label="Barcode Width (px)" type="number" placeholder="2" />
            <Input label="Barcode Height (px)" type="number" placeholder="50" />
            <Select label="Scanner Type" options={['USB Scanner', 'Bluetooth', 'Camera']} />
            <Toggle label="Auto Scan Focus" defaultChecked />
            <Toggle label="Scan Beep Sound" defaultChecked />
            <Toggle label="Generate Missing Barcodes" defaultChecked />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Print Test Barcode</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* 8. POS Settings */}
        <div className="glass-card">
          <div className="card-header">
            <div className="icon-wrapper"><MonitorSmartphone size={24} /></div>
            <div>
              <h3 className="card-title">POS Settings</h3>
              <p className="card-description">Point of Sale defaults & behavior.</p>
            </div>
          </div>
          <div className="glass-card-content">
            <Input label="Default Customer Name" placeholder="Walk-in Customer" />
            <Select label="Default Payment Method" options={['Cash', 'UPI', 'Card']} />
            <Toggle label="Round Off Bill Amount" defaultChecked />
            <Toggle label="Quick Billing Mode" defaultChecked />
            <Toggle label="Offline Billing Support" defaultChecked />
            <Toggle label="Enable Hold Bill" defaultChecked />
            <Toggle label="Enable Resume Bill" defaultChecked />
            <Toggle label="Invoice Auto Save" defaultChecked />
            <Toggle label="Enable Customer Display" />
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
