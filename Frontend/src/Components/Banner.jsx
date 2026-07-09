import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../PrivateRouter/StoreContext";

export default function Banner() {
  const { bannersCache, setBannersCache } = useContext(StoreContext);
  const [offers, setOffers] = useState(bannersCache.offer || []);
  const [loading, setLoading] = useState(!bannersCache.offer);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        if (bannersCache.offer) {
          setOffers(bannersCache.offer);
          setLoading(false);
          return;
        }

        const response = await api.get("/banners?type=offer&active=1");
        const activeOffers = Array.isArray(response.data) ? response.data : [];
        setOffers(activeOffers);
        setBannersCache(prev => ({ ...prev, offer: activeOffers }));
      } catch (error) {
        console.error("Error fetching offer banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [bannersCache, setBannersCache]);

  if (loading || !offers.length) return null;

  const offer = offers[0];

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4">

        <div className="relative overflow-hidden rounded-2xl h-[170px] md:h-[220px]">

          {/* Background */}
          <picture>
            {offer.mobile_image && (
              <source
                media="(max-width:768px)"
                srcSet={offer.mobile_image}
              />
            )}

            <img
              src={offer.image}
              alt={offer.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between h-full px-6 md:px-10">

            {/* Left */}
            <div className="max-w-lg text-white">

              <h2 className="text-2xl md:text-5xl font-extrabold uppercase leading-tight">
                {offer.title}
              </h2>

              <p className="text-sm md:text-xl text-green-100 mt-2">
                {offer.description}
              </p>

              <Link
                to={offer.link || "/shop"}
                className="inline-block mt-5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition"
              >
                {offer.button_text || "Explore All Offers"}
              </Link>

            </div>

            {/* Right Offer Badge */}
            <div className="hidden md:flex items-center justify-center">

              <div className="w-32 h-32 rounded-full bg-yellow-400 flex flex-col justify-center items-center text-center shadow-2xl">

                <span className="text-sm font-bold uppercase">
                  UP TO
                </span>

                <span className="text-5xl font-black leading-none">
                  60%
                </span>

                <span className="text-lg font-bold uppercase">
                  OFF
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}