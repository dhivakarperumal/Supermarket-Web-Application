import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Bluetooth,
  Wifi,
  Usb,
  Network,
  Truck,
  Ticket
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

const Select = ({ label, options, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <select className="form-select" value={value} onChange={onChange}>
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
  { id: 'pos', title: 'POS Settings', desc: 'Point of Sale defaults & behavior.', icon: <MonitorSmartphone size={24} /> },
  { id: 'delivery', title: 'Delivery Charges', desc: 'Manage shipping & delivery fees.', icon: <Truck size={24} /> },
  { id: 'coupon', title: 'Coupon Settings', desc: 'Configure discount & promo codes.', icon: <Ticket size={24} /> }
];

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  
  // States for Printer specific UI
  const [connectionType, setConnectionType] = useState('USB');
  const [isScanning, setIsScanning] = useState(false);
  
  // Bluetooth devices state
  const [pairedDevices, setPairedDevices] = useState([
    { id: 'dev1', name: 'POS-58 Receipt Printer', mac: '00:11:22:33:44:55' }
  ]);
  const [availableDevices, setAvailableDevices] = useState([
    { id: 'dev2', name: 'TVS RP3150', mac: 'A1:B2:C3:D4:E5:F6' }
  ]);

  const handleSave = () => {
    setActiveTab(null);
  };

  const handleScanBluetooth = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  };

  const handlePair = (device) => {
    setAvailableDevices(prev => prev.filter(d => d.id !== device.id));
    setPairedDevices(prev => [...prev, device]);
  };

  const handleUnpair = (device) => {
    setPairedDevices(prev => prev.filter(d => d.id !== device.id));
    setAvailableDevices(prev => [...prev, device]);
  };

  const renderActiveFields = () => {
    switch (activeTab) {
      case 'print':
        return (
          <>
            <Select label="Printer Selection" options={['EPSON TM-T82', 'TVS RP 3150', 'Generic POS Printer']} />
            
            <Select 
              label="Connection Type" 
              options={['USB', 'LAN / Network', 'Bluetooth', 'Wi-Fi']} 
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
            />

            {/* Dynamic UI based on connection type */}
            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', marginBottom: '1rem' }}>
              {connectionType === 'LAN / Network' || connectionType === 'Wi-Fi' ? (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 'bold' }}>
                    {connectionType === 'Wi-Fi' ? <Wifi size={18}/> : <Network size={18}/>} 
                    Network Configuration
                  </div>
                  <Input label="Printer IP Address" placeholder="192.168.1.100" />
                  <Input label="Port" placeholder="9100" />
                </div>
              ) : connectionType === 'USB' ? (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Usb size={18} style={{ color: '#64748b' }}/>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Please ensure the printer is plugged into a USB port. Auto-detection enabled.</span>
                </div>
              ) : connectionType === 'Bluetooth' ? (
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 'bold' }}>
                      <Bluetooth size={18} style={{ color: '#3b82f6' }}/> 
                      Bluetooth Printers
                    </div>
                    <button 
                      onClick={handleScanBluetooth}
                      style={{ 
                        background: '#eff6ff', color: '#2563eb', border: 'none', padding: '0.4rem 0.8rem', 
                        borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' 
                      }}
                    >
                      {isScanning ? 'Scanning...' : 'Scan Devices'}
                    </button>
                  </div>

                  {/* Paired Devices */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Paired Devices</h5>
                    {pairedDevices.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No paired devices</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {pairedDevices.map(device => (
                          <div key={device.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <Printer size={20} style={{ color: '#94a3b8' }} />
                              <div>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{device.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{device.mac}</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981', background: '#d1fae5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Connected</span>
                              <button 
                                onClick={() => handleUnpair(device)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                Unpair
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Devices */}
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Available Devices</h5>
                    {isScanning ? (
                      <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>Searching for nearby printers...</p>
                    ) : availableDevices.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '1rem 0' }}>No available devices found.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {availableDevices.map(device => (
                          <div key={device.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <Printer size={20} style={{ color: '#94a3b8' }} />
                              <div>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{device.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{device.mac}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handlePair(device)}
                              style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Pair
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <Select label="Paper Size" options={['58mm', '80mm', 'A4']} />
            <Input label="Print Copies" type="number" placeholder="1" />
            
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}></div>
            
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
      case 'delivery':
        return (
          <>
            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1rem', fontWeight: 'bold' }}>Standard Delivery Settings</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <Input label="Base Delivery Charge (₹)" type="number" placeholder="e.g. 50" />
                <Input label="Free Delivery Minimum Order Amount (₹)" type="number" placeholder="e.g. 500" />
                <Input label="Per KM Delivery Charge (₹)" type="number" placeholder="e.g. 10" />
                <Input label="Maximum Delivery Distance (KM)" type="number" placeholder="e.g. 15" />
                <Select label="Delivery Area Scope" options={['Local', 'City', 'Custom Radius']} />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#f0f9ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} style={{ color: '#0284c7' }} />
                  <h4 style={{ margin: 0, color: '#0284c7', fontSize: '1rem', fontWeight: 'bold' }}>Express Delivery</h4>
                </div>
                <Toggle label="Enable Express Delivery" defaultChecked />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <Input label="Express Delivery Charge (₹)" type="number" placeholder="e.g. 100" />
                <Input label="Estimated Delivery Time" placeholder="e.g. 30 Mins" />
              </div>
            </div>
          </>
        );
      case 'coupon':
        return (
          <>
            <Toggle label="Enable Coupon System" defaultChecked />
            <Toggle label="Allow Multiple Coupons per Order" />
            <Select label="Default Discount Type" options={['Percentage (%)', 'Flat Amount (₹)']} />
            <Input label="Maximum Discount Cap (₹)" placeholder="e.g. ₹2000" />
            <Toggle label="Show Available Coupons at Checkout" defaultChecked />
            <Toggle label="Auto-apply Best Coupon" />
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
              onClick={() => {
                if (cat.id === 'delivery') { navigate('/admin/delivery-charges'); return; }
                if (cat.id === 'coupon') { navigate('/admin/coupons'); return; }
                setActiveTab(cat.id);
              }}
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
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={18} /> Reset
            </button>
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
