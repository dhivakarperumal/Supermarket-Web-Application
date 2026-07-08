import React from "react";
import { Truck, MapPin, Smartphone, HeadphonesIcon, Map, Tag, ChevronDown } from "lucide-react";
import PageContainer from "./PageContainer";

const Header = () => {
  return (
    <div className="bg-primary-dark hidden md:block text-white text-[13px]">
      <PageContainer>
        <div className="flex items-center justify-between py-2">
          {/* Left - Delivery Info */}
          <div className="flex items-center gap-6 font-medium text-gray-200">
            <span className="flex items-center gap-2 text-yellow-500">
              <Truck size={16} />
              <span className="text-white">Free Delivery on orders above ₹499</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Deliver to: Tirupathur, Tamil Nadu 635602
            </span>
          </div>

          {/* Right - Quick Links */}
          <div className="flex items-center gap-6 font-medium text-gray-200">
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <Smartphone size={15} />
              Download App
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <HeadphonesIcon size={15} />
              Customer Support
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <Map size={15} />
              Track Order
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
              <Tag size={15} />
              Today's Offers
            </a>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition pl-2 border-l border-white/20">
              English
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Header;