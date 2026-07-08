import React from "react";
import PageContainer from "../CommenComponents/PageContainer";

const features = [
  {
    icon: "🚚",
    title: "Fast Delivery",
    subtitle: "Get your order in 30 mins & within 10 km",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: "🌿",
    title: "Fresh & Quality",
    subtitle: "We sell your groceries at best prices",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    subtitle: "100% secure & encrypted payments",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    subtitle: "7-day return policy on all items",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: "🎧",
    title: "24/7 Support",
    subtitle: "Dedicated support team to help you",
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

export default function FeatureBar() {
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <PageContainer>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${f.bg} border border-transparent hover:border-gray-200 transition group`}>
              <div className={`text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <div>
                <p className={`font-black text-sm ${f.color}`}>{f.title}</p>
                <p className="text-gray-500 text-[11px] font-medium leading-tight mt-0.5">{f.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
