import React, { useEffect, useState } from "react";
import api from "../../api";
import PageContainer from "../CommenComponents/PageContainer";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const categoryEmojis = {
  "vegetables": "🥬", "fruits": "🍎", "dairy": "🥛", "bakery": "🍞",
  "grocery": "🌾", "snacks": "🍪", "beverages": "🥤", "personal": "🧴",
  "household": "🧹", "meat": "🥩", "fish": "🐟", "baby": "👶",
  "pet": "🐕", "pharmacy": "💊", "kitchen": "🍳",
};

const getEmoji = (name = "") => {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(categoryEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return "🛒";
};

const CategoryIcon = () => {
  const { categoriesCache, setCategoriesCache } = useContext(StoreContext);
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache || categoriesCache.length === 0);

  useEffect(() => {
    if (categoriesCache && categoriesCache.length > 0) {
      setCategories(categoriesCache);
      setLoading(false);
      return;
    }
    api.get("/categories").then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
      setCategoriesCache(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [categoriesCache, setCategoriesCache]);

  return (
    <section className="py-6 bg-white border-b border-gray-100 overflow-hidden">
      <PageContainer>
        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0 animate-pulse w-20">
                <div className="w-16 h-16 rounded-full bg-gray-100" />
                <div className="w-14 h-3 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={8}
            loop={categories.length > 8}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 4 },
              480: { slidesPerView: 5 },
              640: { slidesPerView: 6 },
              768: { slidesPerView: 8 },
              1024: { slidesPerView: 10 },
              1280: { slidesPerView: 12 },
            }}
          >
            {Array.isArray(categories) && categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <Link
                  to={`/category/${cat.name.toLowerCase()}`}
                  className="group flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-gray-100 group-hover:border-primary bg-gray-50 group-hover:bg-primary/5 transition overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 duration-300">
                    {cat.images?.[0] ? (
                      <img
                        src={cat.images[0]}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{getEmoji(cat.name)}</span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-600 group-hover:text-primary text-center transition leading-tight line-clamp-2 max-w-[60px]">
                    {cat.name}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </PageContainer>
    </section>
  );
};

export default CategoryIcon;
