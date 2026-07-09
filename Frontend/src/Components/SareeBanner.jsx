import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "./CommenComponents/PageContainer";

const banners = [
  {
    id: 1,
    title: "100% ORGANIC",
    subtitle: "Fresh & Healthy",
    desc: "Farm Fresh Vegetables",
    button: "Shop Organic",
    image: "/bannersm1.png",
    bg: "from-green-50 to-green-100",
    btn: "bg-green-700 hover:bg-green-800",
  },
  {
    id: 2,
    title: "COMBO OFFERS",
    subtitle: "More Essentials",
    desc: "More Savings",
    badge: "SAVE ₹250",
    button: "Shop Now",
    image: "/banner2.png",
    bg: "from-yellow-50 to-orange-100",
    btn: "bg-yellow-500 hover:bg-yellow-600 text-black",
  },
  {
    id: 3,
    title: "FREE DELIVERY",
    subtitle: "On Orders Above",
    desc: "₹499",
    button: "Order Now",
    image: "/bannersm3.png",
    bg: "from-blue-50 to-indigo-100",
    btn: "bg-primary hover:bg-primary-dark",
  },
  {
    id: 4,
    title: "SUPER SAVER",
    subtitle: "Top Grocery Brands",
    desc: "Best Prices Everyday",
    button: "Shop Deals",
    image: "/bannersm4.png",
    bg: "from-orange-50 to-yellow-100",
    btn: "bg-yellow-500 hover:bg-yellow-600 text-black",
  },
];

export default function OfferBanner() {
  return (
    <section className="py-16">
      <PageContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {banners.map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${item.bg} p-6 h-[260px] shadow-md hover:shadow-2xl transition-all duration-500 group`}
            >
              {/* Offer Badge */}
              {item.badge && (
                <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-sm font-bold text-center shadow-lg rotate-12">
                  {item.badge}
                </div>
              )}

              <div className="relative z-10 w-[55%]">
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-lg font-semibold text-gray-700">
                  {item.subtitle}
                </p>

                <p className="text-gray-600 mt-1">
                  {item.desc}
                </p>

                <Link
                  to="/shop"
                  className={`${item.btn} inline-block mt-6 px-5 py-2 rounded-full text-white font-semibold transition`}
                >
                  {item.button}
                </Link>
              </div>

              <img
                src={item.image}
                alt={item.title}
                className="absolute bottom-0 right-0 w-45 group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-white/20"></div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}