import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PageContainer from "../CommenComponents/PageContainer";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import api from "../../api";

const categoryEmojis = {
  "vegetables": "🥬", "fruits": "🍎", "dairy": "🥛", "bakery": "🍞",
  "grocery": "🌾", "snacks": "🍪", "beverages": "🥤", "personal": "🧴",
  "household": "🧹", "meat": "🥩", "fish": "🐟", "baby": "👶",
  "pet": "🐕", "pharmacy": "💊",
};

const categoryBgs = [
  "bg-green-50", "bg-red-50", "bg-blue-50", "bg-yellow-50",
  "bg-purple-50", "bg-orange-50", "bg-pink-50", "bg-teal-50",
];

export default function ShopByCategory() {
  const { categoriesCache, setCategoriesCache } = useContext(StoreContext);
  const [categories, setCategories] = useState(categoriesCache || []);

  useEffect(() => {
    if (categoriesCache && categoriesCache.length > 0) {
      setCategories(categoriesCache);
      return;
    }
    api.get("/categories").then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
      setCategoriesCache(data);
    }).catch(console.error);
  }, []);

  const getEmoji = (name = "") => {
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (lower.includes(key)) return emoji;
    }
    return "🛒";
  };

  return (
    <section className="py-8 bg-gray-50">
      <PageContainer>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-800">Shop by Category</h2>
          <div className="flex items-center gap-3">
            <button className="sbc-prev w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition">
              <ChevronLeft size={16} />
            </button>
            <button className="sbc-next w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition">
              <ChevronRight size={16} />
            </button>
            <Link to="/shop" className="text-primary font-bold text-sm hover:underline">View All</Link>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={16}
          loop={categories.length > 6}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={{ nextEl: ".sbc-next", prevEl: ".sbc-prev" }}
          breakpoints={{
            320: { slidesPerView: 2 },
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={cat.id}>
              <Link
                to={`/category/${cat.name.toLowerCase()}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition group ${categoryBgs[i % categoryBgs.length]}`}
              >
                {cat.images?.[0] ? (
                  <img
                    src={cat.images[0]}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-white shadow group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {getEmoji(cat.name)}
                  </div>
                )}
                <p className="text-xs font-bold text-gray-700 text-center group-hover:text-primary transition line-clamp-2">{cat.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">Products</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </PageContainer>
    </section>
  );
}
