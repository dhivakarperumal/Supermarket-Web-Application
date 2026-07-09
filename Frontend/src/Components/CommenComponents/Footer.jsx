import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "./PageContainer";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

import {
  SiVisa,
  SiMastercard,
  SiPaytm,
} from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#0b5b1c] via-[#084b17] to-[#063914] text-white mt-20">

      <PageContainer>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 py-12">

          {/* Logo */}
          <div className="lg:col-span-2">

            <Link to="/" className="flex items-center gap-3 mb-5">

              <img
                src="/logo.png"
                alt="Logo"
                className="w-16 h-16 object-contain"
              />

              <div>

                <h2 className="text-2xl font-bold tracking-wide">
                  PRIYAM SUPERMARKET
                </h2>

                <p className="text-xs text-green-200 uppercase">
                  Supermarket Shopping Cart
                </p>

              </div>

            </Link>

            <p className="text-sm text-green-100 leading-7 max-w-sm">
              Your trusted destination for all your daily needs.
              Fresh vegetables, fruits, groceries, dairy products,
              beverages and household essentials at affordable prices.
            </p>

            <div className="flex gap-4 mt-6">

              <a href="#">
                <FaFacebookF className="hover:text-blue-400 transition text-lg" />
              </a>

              <a href="#">
                <FaInstagram className="hover:text-pink-400 transition text-lg" />
              </a>

              <a href="#">
                <FaTwitter className="hover:text-sky-400 transition text-lg" />
              </a>

              <a href="#">
                <FaYoutube className="hover:text-red-500 transition text-lg" />
              </a>

            </div>

          </div>

          {/* Company */}
          <div>

            <h3 className="uppercase text-sm font-semibold mb-5 tracking-wider">
              Company
            </h3>

            <ul className="space-y-3 text-sm text-green-100">

              <li><Link to="/about" className="hover:text-white">About Us</Link></li>

              <li><Link to="/">Careers</Link></li>

              <li><Link to="/">Blog</Link></li>

              <li><Link to="/">Press</Link></li>

              <li><Link to="/contactus">Contact Us</Link></li>

            </ul>

          </div>

          {/* Customer */}
          <div>

            <h3 className="uppercase text-sm font-semibold mb-5 tracking-wider">
              Customer Care
            </h3>

            <ul className="space-y-3 text-sm text-green-100">

              <li><Link to="/profile">My Account</Link></li>

              <li><Link to="/orders">Track Order</Link></li>

              <li><Link to="/">Returns & Refunds</Link></li>

              <li><Link to="/">FAQ</Link></li>

              <li><Link to="/">Help Center</Link></li>

            </ul>

          </div>

          {/* Policies */}
          <div>

            <h3 className="uppercase text-sm font-semibold mb-5 tracking-wider">
              Policies
            </h3>

            <ul className="space-y-3 text-sm text-green-100">

              <li><Link to="/">Privacy Policy</Link></li>

              <li><Link to="/">Terms & Conditions</Link></li>

              <li><Link to="/">Shipping Policy</Link></li>

              <li><Link to="/">Return Policy</Link></li>

              <li><Link to="/">Cancellation Policy</Link></li>

            </ul>

          </div>

          {/* Categories */}
          <div>

            <h3 className="uppercase text-sm font-semibold mb-5 tracking-wider">
              Categories
            </h3>

            <ul className="space-y-3 text-sm text-green-100">

              <li>Fruits & Vegetables</li>

              <li>Grocery & Staples</li>

              <li>Dairy & Bakery</li>

              <li>Beverages</li>

              <li>Personal Care</li>

            </ul>

          </div>

        </div>

      </PageContainer>

      {/* Contact Row */}

      <div className="border-t border-green-700">

        <PageContainer>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 text-sm text-green-100">

            <div className="flex items-center gap-3">

              <MapPin size={18} />

              <span>Tirupattur, Tamil Nadu 635602</span>

            </div>

            <div className="flex items-center gap-3">

              <Phone size={18} />

              <span>+91 98765 43210</span>

            </div>

            <div className="flex items-center gap-3">

              <Mail size={18} />

              <span>support@priyam.com</span>

            </div>

            <div className="flex items-center gap-3">

              <Clock size={18} />

              <span>Mon - Sun : 6AM - 11PM</span>

            </div>

          </div>

        </PageContainer>

      </div>

      {/* Bottom */}

      <div className="bg-[#052f12] border-t border-green-800">

        <PageContainer>

          <div className="py-5 flex flex-col lg:flex-row items-center justify-between gap-5">

            <p className="text-sm text-green-100">
              © {new Date().getFullYear()} Priyam Supermarket. All Rights Reserved.
            </p>

            <div className="flex items-center gap-5">

              <span className="text-sm text-green-100">
                We Accept
              </span>

              <SiVisa className="text-3xl" />

              <SiMastercard className="text-3xl" />

              <span className="font-bold text-lg">
                RuPay
              </span>

              <span className="font-bold text-lg">
                UPI
              </span>

              <SiPaytm className="text-3xl" />

            </div>

          </div>

        </PageContainer>

      </div>

    </footer>
  );
};

export default Footer;