import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PageContainer from "../CommenComponents/PageContainer";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import ProductCard from "../Products/ProductsCard";

export default function BestSelling() {
  const { productsCache, setProductsCache, lastFetchTime, setLastFetchTime } = useContext(StoreContext);
  const [products, setProducts] = useState([]);

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
        // Sort by rating desc for "best selling"
        const sorted = (data || []).slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setProducts(sorted.slice(0, 12));
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-8 bg-white">
      <PageContainer>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-800">Best Selling Products</h2>
          <div className="flex items-center gap-3">
            <button className="bs-prev w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition">
              <ChevronLeft size={16} />
            </button>
            <button className="bs-next w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-gray-600 transition">
              <ChevronRight size={16} />
            </button>
            <Link to="/shop" className="text-primary font-bold text-sm hover:underline">
              View All
            </Link>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            loop={products.length > 5}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{ nextEl: ".bs-next", prevEl: ".bs-prev" }}
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 3 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {products.map(product => (
              <SwiperSlide key={product.id} className="pb-2">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </PageContainer>
    </section>
  );
}
