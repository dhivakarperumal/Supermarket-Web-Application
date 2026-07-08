import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "../CommenComponents/PageContainer";

export default function PromoBanners() {
  return (
    <section className="py-8 bg-gray-50">
      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1 - 100% Organic */}
          <div className="relative bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-5 overflow-hidden group min-h-[140px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-green-200 text-[11px] font-bold tracking-wider uppercase mb-1">Fresh From Nature</p>
              <h3 className="text-white text-lg font-black leading-tight mb-3">100% ORGANIC<br />Fresh & Healthy</h3>
              <Link to="/shop" className="inline-block bg-white text-green-700 font-bold text-[11px] px-3 py-1.5 rounded-full hover:bg-green-50 transition shadow">
                Shop Now
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-3 text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 select-none">🥦</div>
          </div>

          {/* 2 - Combo Offers */}
          <div className="relative bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 overflow-hidden group min-h-[140px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-amber-100 text-[11px] font-bold tracking-wider uppercase mb-1">Save More</p>
              <h3 className="text-white text-lg font-black leading-tight mb-1">COMBO OFFERS</h3>
              <p className="text-amber-100 text-xs font-bold mb-3">Save <span className="text-white text-sm font-black">₹250</span></p>
              <Link to="/shop" className="inline-block bg-white text-orange-600 font-bold text-[11px] px-3 py-1.5 rounded-full hover:bg-orange-50 transition shadow">
                More Essentials
              </Link>
            </div>
            <div className="absolute -right-3 -bottom-2 text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 select-none">🛒</div>
          </div>

          {/* 3 - Free Delivery */}
          <div className="relative bg-gradient-to-br from-blue-600 to-sky-400 rounded-2xl p-5 overflow-hidden group min-h-[140px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-blue-200 text-[11px] font-bold tracking-wider uppercase mb-1">No Extra Cost</p>
              <h3 className="text-white text-lg font-black leading-tight mb-1">FREE DELIVERY</h3>
              <p className="text-blue-100 text-xs font-bold mb-3">On orders above <span className="text-white font-black">₹499</span></p>
              <Link to="/shop" className="inline-block bg-white text-blue-600 font-bold text-[11px] px-3 py-1.5 rounded-full hover:bg-blue-50 transition shadow">
                Shop Now
              </Link>
            </div>
            <div className="absolute -right-3 -bottom-2 text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 select-none">🚚</div>
          </div>

          {/* 4 - Super Saver Zone */}
          <div className="relative bg-gradient-to-br from-primary to-primary-light rounded-2xl p-5 overflow-hidden group min-h-[140px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-green-200 text-[11px] font-bold tracking-wider uppercase mb-1">Best Prices</p>
              <h3 className="text-white text-lg font-black leading-tight mb-1">SUPER SAVER<br />ZONE</h3>
              <p className="text-green-200 text-xs font-bold mb-3">On Top Brands</p>
              <Link to="/shop" className="inline-block bg-white text-primary font-bold text-[11px] px-3 py-1.5 rounded-full hover:bg-green-50 transition shadow">
                Shop Now
              </Link>
            </div>
            <div className="absolute -right-3 -bottom-2 text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 select-none">🏷️</div>
          </div>

        </div>
      </PageContainer>
    </section>
  );
}
