import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PageContainer from "../CommenComponents/PageContainer";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import { useContext } from "react";
import ProductCard from "../Products/ProductsCard";

function useCountdown(targetHour = 23, targetMin = 59, targetSec = 59) {
  const getTime = () => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, targetMin, targetSec, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    return {
      h: String(Math.floor(diff / 3600)).padStart(2, "0"),
      m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
      s: String(diff % 60).padStart(2, "0"),
    };
  };
  const [time, setTime] = useState(getTime);
  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function FlashSale() {
  const { productsCache, setProductsCache, lastFetchTime, setLastFetchTime } = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  const time = useCountdown();

  useEffect(() => {
    const fetch = async () => {
      try {
        let data = productsCache;
        if (!data || data.length === 0 || !lastFetchTime || Date.now() - lastFetchTime > 5 * 60 * 1000) {
          const { default: api } = await import("../../api");
          const res = await api.get("/products");
          data = Array.isArray(res.data) ? res.data : [];
          setProductsCache(data);
          setLastFetchTime(Date.now());
        }
        // Pick products with offer or just show first 12
        const flash = (data || [])
          .filter(p => p.offer && p.offer > 0)
          .sort((a, b) => b.offer - a.offer)
          .slice(0, 12);
        setProducts(flash.length > 0 ? flash : (data || []).slice(0, 12));
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-8 bg-white">
      <PageContainer>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-xl">⚡</span>
              <h2 className="text-xl font-black text-gray-800">Flash Sale</h2>
            </div>
            {/* Countdown */}
            <div className="flex items-center gap-1 text-sm">
              <span className="bg-gray-900 text-white font-black px-2 py-1 rounded min-w-[36px] text-center">{time.h}</span>
              <span className="font-black text-gray-600">:</span>
              <span className="bg-gray-900 text-white font-black px-2 py-1 rounded min-w-[36px] text-center">{time.m}</span>
              <span className="font-black text-gray-600">:</span>
              <span className="bg-gray-900 text-white font-black px-2 py-1 rounded min-w-[36px] text-center">{time.s}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 font-medium">
              <span>Hours</span><span className="ml-4">Mins</span><span className="ml-4">Secs</span>
            </div>
          </div>
          <Link to="/shop" className="bg-primary text-white text-xs font-bold px-5 py-2 rounded hover:bg-primary-dark transition">
            View All Deals
          </Link>
        </div>

        {/* Product Swiper */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            loop={products.length > 5}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            navigation={{ nextEl: ".flash-next", prevEl: ".flash-prev" }}
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {products.map(product => (
              <SwiperSlide key={product.id} className="pb-2">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="flash-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 text-gray-700 transition">
            <ChevronLeft size={18} />
          </button>
          <button className="flash-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 text-gray-700 transition">
            <ChevronRight size={18} />
          </button>
        </div>
      </PageContainer>
    </section>
  );
}
