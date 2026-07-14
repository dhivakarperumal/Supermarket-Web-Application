import React from "react";
import { ShoppingCart, Heart, Tag, Star } from "lucide-react";

const combos = [
  {
    id: 1,
    title: "Family Essentials Combo",
    discount: "20% OFF",
    originalPrice: 1850,
    price: 1499,
    rating: 4.9,
    image: "/rice.png",
    items: [
      "Ponni Rice 5kg",
      "Toor Dal 1kg",
      "Sunflower Oil 1L",
      "Sugar 1kg",
    ],
  },
  {
    id: 2,
    title: "Breakfast Combo",
    discount: "15% OFF",
    originalPrice: 999,
    price: 849,
    rating: 4.8,
    image: "/breakfast.png",
    items: [
      "Corn Flakes",
      "Milk 1L",
      "Bread",
      "Jam",
    ],
  },
  {
    id: 3,
    title: "Cooking Combo",
    discount: "25% OFF",
    originalPrice: 1650,
    price: 1249,
    rating: 5.0,
    image: "/oil.png",
    items: [
      "Sunflower Oil",
      "Turmeric",
      "Chilli Powder",
      "Salt",
    ],
  },
  {
    id: 4,
    title: "Healthy Combo",
    discount: "18% OFF",
    originalPrice: 1450,
    price: 1199,
    rating: 4.7,
    image: "/fruits.png",
    items: [
      "Apple",
      "Orange",
      "Banana",
      "Pomegranate",
    ],
  },
  {
    id: 5,
    title: "Snacks Combo",
    discount: "30% OFF",
    originalPrice: 799,
    price: 559,
    rating: 4.8,
    image: "/snacks.png",
    items: [
      "Biscuits",
      "Chips",
      "Juice",
      "Chocolate",
    ],
  },
  {
    id: 6,
    title: "Monthly Grocery Pack",
    discount: "22% OFF",
    originalPrice: 3200,
    price: 2499,
    rating: 5.0,
    image: "/combo.png",
    items: [
      "Rice",
      "Dal",
      "Oil",
      "Spices",
      "Sugar",
      "Salt",
    ],
  },
];

const Combo = () => {
  return (
    <div className="bg-[#f8faf8] min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0e6827] via-[#168637] to-[#ffc107] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
            SAVE MORE
          </span>

          <h1 className="text-5xl font-extrabold mt-5">
            Grocery Combo Offers
          </h1>

          <p className="mt-4 text-white/90 max-w-2xl text-lg">
            Handpicked grocery bundles with exclusive discounts.
            Buy more and save more every day.
          </p>

          <button className="mt-8 bg-[#ffc107] text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition">
            Shop Combos
          </button>
        </div>
      </section>

      {/* Categories */}

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "All",
            "Rice",
            "Breakfast",
            "Cooking",
            "Healthy",
            "Snacks",
            "Family",
          ].map((item) => (
            <button
              key={item}
              className="px-6 py-2 rounded-full bg-white border border-green-200 hover:bg-[#0e6827] hover:text-white transition font-semibold"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Combo Cards */}

      <section className="max-w-7xl mx-auto px-6 pb-16">

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

          {combos.map((combo) => (

            <div
              key={combo.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group"
            >

              <div className="relative">

                <img
                  src={combo.image}
                  alt={combo.title}
                  className="h-64 w-full object-cover group-hover:scale-105 transition duration-500"
                />

                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {combo.discount}
                </span>

                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition">
                  <Heart size={18} />
                </button>

              </div>

              <div className="p-6">

                <div className="flex justify-between items-center">

                  <h2 className="text-xl font-bold text-gray-800">
                    {combo.title}
                  </h2>

                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    <Star size={16} fill="currentColor" />
                    {combo.rating}
                  </div>

                </div>

                <div className="mt-5 space-y-2">

                  {combo.items.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <Tag
                        size={14}
                        className="mr-2 text-[#0e6827]"
                      />

                      {item}
                    </div>

                  ))}

                </div>

                <div className="mt-6 flex items-center gap-3">

                  <span className="text-3xl font-bold text-[#0e6827]">
                    ₹{combo.price}
                  </span>

                  <span className="line-through text-gray-400">
                    ₹{combo.originalPrice}
                  </span>

                </div>

                <p className="text-red-500 font-semibold mt-2">
                  Save ₹{combo.originalPrice - combo.price}
                </p>

                <button className="mt-6 w-full flex items-center justify-center gap-2 bg-[#0e6827] hover:bg-[#168637] text-white py-3 rounded-xl font-bold transition">
                  <ShoppingCart size={18} />
                  Add Combo To Cart
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default Combo;