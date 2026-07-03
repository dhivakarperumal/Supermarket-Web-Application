import React, { useState } from "react";
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
  RotateCcw,
  ArrowLeft
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

const SETTINGS_CATEGORIES = [
  { id: 'print', title: 'Print Setup', desc: 'Configure printers & paper sizes.', icon: <Printer size={24} /> },
  { id: 'receipt', title: 'Receipt Settings', desc: 'Customize receipt layout and info.', icon: <Receipt size={24} /> },
  { id: 'payment', title: 'Payment Integration', desc: 'Gateways, UPI, and Card setups.', icon: <CreditCard size={24} /> },
  { id: 'store', title: 'Store Settings', desc: 'Core business and location info.', icon: <Store size={24} /> },
  { id: 'tax', title: 'Tax & GST', desc: 'Configure GST, SGST, IGST and HSN.', icon: <Percent size={24} /> },
  { id: 'localization', title: 'Localization', desc: 'Region, Language & formatting.', icon: <Globe size={24} /> },
  { id: 'barcode', title: 'Barcode & Scanner', desc: 'Barcode formats and scanner inputs.', icon: <Barcode size={24} /> },
  { id: 'pos', title: 'POS Settings', desc: 'Point of Sale defaults & behavior.', icon: <MonitorSmartphone size={24} /> }
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState(null);

  const handleSave = () => {
    // Save logic here (e.g., API call)
    // Then return to main grid
    setActiveTab(null);
  };

  const renderActiveFields = () => {
    switch (activeTab) {
      case 'print':
        return (
          <>
            <Select label="Printer Selection" options={['EPSON TM-T82', 'TVS RP 3150', 'Generic POS Printer']} />
            <Select label="Connection Type" options={['USB', 'LAN / Network', 'Bluetooth', 'Wi-Fi']} />
            <Input label="Printer IP Address (For LAN/Wi-Fi)" placeholder="192.168.1.100" />
            <Input label="Bluetooth Name / MAC Address" placeholder="e.g. POS-80 or 00:1A:2B:3C:4D:5E" />
            <Select label="Paper Size" options={['58mm', '80mm', 'A4']} />
            <Input label="Print Copies" type="number" placeholder="1" />
            <Toggle label="Auto Print Invoice" defaultChecked />
            <Toggle label="Cash Drawer Trigger" defaultChecked />
            <Toggle label="Kitchen Printer" />
            <Toggle label="Barcode Printing" defaultChecked />
            <Toggle label="QR Code Printing" defaultChecked />
            <Toggle label="Print Logo" defaultChecked />
            <Toggle label="Print Header" defaultChecked />
            <Toggle label="Print Footer" defaultChecked />
          </>
        );
      case 'receipt':
        return (
          <>
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
          </>
        );
      case 'payment':
        return (
          <>
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
          </>
        );
      case 'store':
        return (
          <>
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
          </>
        );
      case 'tax':
        return (
          <>
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
          </>
        );
      case 'localization':
        return (
          <>
            <Select label="System Language" options={['English (US)', 'English (UK)', 'Hindi']} />
            <Select label="System Currency" options={['INR', 'USD', 'EUR', 'GBP']} />
            <Select label="Timezone" options={['Asia/Kolkata', 'America/New_York']} />
            <Select label="Date Format" options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
            <Select label="Time Format" options={['12-hour (AM/PM)', '24-hour']} />
            <Select label="Number Format" options={['1,00,000.00', '100,000.00']} />
            <Toggle label="Multi-language Support" defaultChecked />
          </>
        );
      case 'barcode':
        return (
          <>
            <Select label="Barcode Format" options={['CODE128', 'EAN-13', 'UPC-A']} />
            <Input label="Barcode Width (px)" type="number" placeholder="2" />
            <Input label="Barcode Height (px)" type="number" placeholder="50" />
            <Select label="Scanner Type" options={['USB Scanner', 'Bluetooth', 'Camera']} />
            <Toggle label="Auto Scan Focus" defaultChecked />
            <Toggle label="Scan Beep Sound" defaultChecked />
            <Toggle label="Generate Missing Barcodes" defaultChecked />
          </>
        );
      case 'pos':
        return (
          <>
            <Input label="Default Customer Name" placeholder="Walk-in Customer" />
            <Select label="Default Payment Method" options={['Cash', 'UPI', 'Card']} />
            <Toggle label="Round Off Bill Amount" defaultChecked />
            <Toggle label="Quick Billing Mode" defaultChecked />
            <Toggle label="Offline Billing Support" defaultChecked />
            <Toggle label="Enable Hold Bill" defaultChecked />
            <Toggle label="Enable Resume Bill" defaultChecked />
            <Toggle label="Invoice Auto Save" defaultChecked />
            <Toggle label="Enable Customer Display" />
          </>
        );
      default:
        return null;
    }
  };

  const activeCategory = SETTINGS_CATEGORIES.find(c => c.id === activeTab);

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title-area">
          <h1>System Settings</h1>
          <p>Configure your supermarket system, billing, payments, and preferences.</p>
        </div>
        
        {/* Only show global actions if NOT inside a specific card */}
        {!activeTab && (
          <div className="settings-header-actions">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} size={18} />
              <input type="text" className="settings-search" placeholder="Search categories..." style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
        )}
      </div>

      {!activeTab ? (
        <div className="settings-grid">
          {SETTINGS_CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              className="glass-card clickable-card" 
              onClick={() => setActiveTab(cat.id)}
            >
              <div className="card-header" style={{ marginBottom: 0 }}>
                <div className="icon-wrapper">{cat.icon}</div>
                <div>
                  <h3 className="card-title">{cat.title}</h3>
                  <p className="card-description">{cat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card detail-view animate-fade-in">
          <div className="detail-header">
            <button className="back-button" onClick={() => setActiveTab(null)}>
              <ArrowLeft size={20} /> Back
            </button>
            <div className="detail-title-area">
              <div className="icon-wrapper sm">{activeCategory.icon}</div>
              <h2>{activeCategory.title}</h2>
            </div>
          </div>
          
          <div className="detail-content grid-2-col">
            {renderActiveFields()}
          </div>
          
          <div className="detail-actions">
            <button className="btn-secondary" onClick={() => setActiveTab(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
