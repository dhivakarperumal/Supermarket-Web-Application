import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { SiVisa, SiMastercard, SiRazorpay, SiPaytm } from "react-icons/si";
import PageContainer from "./PageContainer";
import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#01210f] via-[#022c16] to-[#01352c] text-gray-300 overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary-light/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/[0.015] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      {/* Gold top accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500" />
      <PageContainer>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Dhiva & Deva Supermarket" className="h-12 object-contain bg-white rounded-lg p-1" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Your one-stop destination for fresh groceries, daily essentials, and top brands — at unbeatable prices, delivered to your door.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, href: "#", color: "hover:bg-blue-500" },
                { icon: <FaInstagram />, href: "#", color: "hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400" },
                { icon: <FaYoutube />, href: "#", color: "hover:bg-red-600" },
                { icon: <FaTwitter />, href: "#", color: "hover:bg-sky-500" },
              ].map((s, i) => (
                <a key={i} href={s.href} className={`w-9 h-9 bg-white/10 border border-white/10 ${s.color} text-white rounded-full flex items-center justify-center text-sm transition hover:border-transparent hover:scale-110`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-yellow-400 inline-block rounded"></span>Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[["About Us", "/about"], ["Careers", "#"], ["Blog", "#"], ["Press", "#"], ["Partners", "#"]].map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-white hover:translate-x-1 inline-block transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-yellow-400 inline-block rounded"></span>Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              {[["My Account", "/account"], ["Track Order", "#"], ["Returns & Refunds", "#"], ["Shipping Policy", "#"], ["Bulk Orders", "#"]].map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-white hover:translate-x-1 inline-block transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-yellow-400 inline-block rounded"></span>Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-primary-light shrink-0 mt-0.5" />
                <span>Tirupathur, Tamil Nadu 635602</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-primary-light shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-primary-light shrink-0" />
                <a href="mailto:support@dhivadeva.com" className="hover:text-white transition">support@dhivadeva.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-primary-light shrink-0" />
                <span>Mon–Sat : 8AM – 9PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} <span className="text-green-400 font-semibold">Dhiva & Deva Supermarket</span>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-xs font-medium">We Accept:</span>
            <SiVisa size={28} className="text-blue-400 hover:text-blue-300 transition" />
            <SiMastercard size={24} className="text-red-400 hover:text-red-300 transition" />
            <SiRazorpay size={20} className="text-blue-400 hover:text-blue-300 transition" />
            <SiPaytm size={20} className="text-sky-400 hover:text-sky-300 transition" />
          </div>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;