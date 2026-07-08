import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PageContainer from "../CommenComponents/PageContainer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function SupermarketHero() {
  return (
    <section className="bg-gray-50 pt-6 pb-12">
      <PageContainer>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Center Main Slider */}
          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-[#fffbeb] to-[#fef3c7] h-[380px] lg:h-[460px]">
            <Swiper
              modules={[Autoplay, EffectFade, Pagination, Navigation]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                el: '.swiper-custom-pagination',
                bulletClass: 'swiper-custom-bullet',
                bulletActiveClass: 'swiper-custom-bullet-active',
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              loop={true}
              className="w-full h-full"
            >
              <SwiperSlide className="!h-full">
                <div className="w-full h-full flex items-center px-8 md:px-16 relative">
                  <div className="max-w-md z-10">
                    <span className="inline-block bg-yellow-400 text-black font-bold text-[11px] px-3 py-1 rounded-full tracking-widest mb-4">
                      SUPER SAVER DAYS
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-[1.1] mb-4">
                      FRESHNESS <br />
                      <span className="text-orange-500">YOU CAN TRUST</span>
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base font-medium mb-8 max-w-sm">
                      Top Quality Groceries <br /> Delivered to Your Doorstep
                    </p>
                    <div className="flex items-center gap-4">
                      <Link to="/shop" className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-primary-dark transition shadow-lg">
                        Shop Now
                      </Link>
                      <Link to="/deals" className="bg-white text-gray-800 font-bold text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition shadow-lg">
                        Explore Deals
                      </Link>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-center pointer-events-none opacity-30 md:opacity-100">
                     <img src="/basket.png" alt="Fresh Groceries" className="object-contain max-h-[90%] drop-shadow-2xl translate-x-12 translate-y-8 scale-110" />
                  </div>
                </div>
              </SwiperSlide>
              
              {/* Additional slide placeholder */}
              <SwiperSlide className="!h-full">
                <div className="w-full h-full flex items-center px-8 md:px-16 relative bg-gradient-to-r from-green-50 to-emerald-100">
                  <div className="max-w-md z-10">
                    <span className="inline-block bg-primary text-white font-bold text-[11px] px-3 py-1 rounded-full tracking-widest mb-4">
                      EVERYDAY ESSENTIALS
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 leading-[1.1] mb-4">
                      Pantry Staples <br />
                      <span className="text-primary">At Low Prices</span>
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base font-medium mb-8 max-w-sm">
                      Stock up on your daily needs without breaking the bank.
                    </p>
                    <div className="flex items-center gap-4">
                      <Link to="/shop" className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-primary-dark transition shadow-lg">
                        Shop Staples
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Custom Navigation */}
            <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white shadow-md text-gray-600 transition">
               <ChevronLeft size={20} />
            </div>
            <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white shadow-md text-gray-600 transition">
               <ChevronRight size={20} />
            </div>

            {/* Custom Pagination */}
            <div className="swiper-custom-pagination absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2"></div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              .swiper-custom-bullet { width: 8px; height: 8px; background: #cbd5e1; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; }
              .swiper-custom-bullet-active { background: #0a4731; width: 24px; border-radius: 4px; }
            `}} />
          </div>

          {/* Right Side Banners */}
          <div className="hidden xl:flex flex-col gap-6 w-[320px] shrink-0 h-[460px]">
            {/* Top Banner */}
            <div className="flex-1 bg-[#fff1e6] rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-orange-500 font-bold text-[11px] tracking-wider mb-1 block">WEEKEND DEAL</span>
                <h3 className="text-xl font-black text-gray-800 leading-tight mb-2">Flat 25% OFF</h3>
                <p className="text-gray-600 text-xs font-medium mb-4">On All Grocery Items</p>
                <Link to="/deals" className="inline-block bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded hover:bg-orange-600 transition shadow">
                  Shop Now
                </Link>
              </div>
              <div className="absolute -right-6 -bottom-6 w-40 h-40 group-hover:scale-105 transition-transform duration-500">
                <img src="/basket.png" alt="Groceries" className="w-full h-full object-contain drop-shadow-md" />
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="flex-1 bg-[#eef8f2] rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-primary font-bold text-[11px] tracking-wider mb-1 block">ORGANIC STORE</span>
                <h3 className="text-xl font-black text-gray-800 leading-tight mb-2">100% Organic</h3>
                <p className="text-gray-600 text-xs font-medium mb-4">Fresh & Healthy</p>
                <Link to="/organic" className="inline-block bg-primary text-white font-bold text-xs px-4 py-2 rounded hover:bg-primary-dark transition shadow">
                  Shop Organic
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 w-36 h-36 group-hover:scale-105 transition-transform duration-500">
                {/* Fallback image if a specific organic image isn't available */}
                <img src="/basket.png" alt="Organic" className="w-full h-full object-contain drop-shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
