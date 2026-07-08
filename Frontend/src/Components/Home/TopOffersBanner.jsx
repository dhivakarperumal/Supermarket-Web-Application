import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "../CommenComponents/PageContainer";

export default function TopOffersBanner() {
  return (
    <section className="py-8 bg-white">
      <PageContainer>
        <div className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-light rounded-2xl overflow-hidden px-8 py-8 md:py-10 md:px-16 flex items-center justify-between gap-6 min-h-[160px]">
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute right-1/3 -top-8 w-32 h-32 bg-white/5 rounded-full" />

          {/* Left Text */}
          <div className="relative z-10">
            <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase mb-1">Limited Time</p>
            <h2 className="text-white text-2xl md:text-3xl font-black leading-tight mb-1">TOP OFFERS FOR YOU</h2>
            <p className="text-green-200 text-sm font-medium">Grab the best deals on top brands</p>
            <Link
              to="/shop"
              className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm px-6 py-2.5 rounded-full shadow-lg transition"
            >
              Explore All Offers
            </Link>
          </div>

          {/* Right visual */}
          <div className="hidden md:flex items-center gap-4 relative z-10">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center border border-white/30">
              <p className="text-white font-black text-3xl">UP TO</p>
              <p className="text-yellow-400 font-black text-5xl leading-none">60%</p>
              <p className="text-white font-black text-lg">OFF</p>
            </div>
            <div className="text-7xl select-none">🥗</div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
