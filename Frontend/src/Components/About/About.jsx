import React from "react";
import Heading from "../Heading";
import AnimatedButton from "../AnimatedButton";
import PageContainer from "../CommenComponents/PageContainer";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaShippingFast,
  FaTags,
} from "react-icons/fa";

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 via-white to-white">
      <PageContainer>
        <Heading title="About Us" />

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-10">

          {/* Left Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/about-supermarket.jpg"
                alt="Supermarket"
                className="w-full h-[500px] object-cover hover:scale-105 transition duration-700"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 left-8 bg-green-600 text-white px-8 py-5 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm opacity-90">
                Years Serving Freshness
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div>

            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              🌿 Fresh • Healthy • Affordable
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold mt-6 text-gray-900 leading-tight">
              Bringing Freshness
              <span className="block text-green-600">
                Directly To Your Doorstep
              </span>
            </h2>

            <p className="mt-6 text-gray-600 leading-8 text-lg">
              We provide farm-fresh fruits, vegetables, groceries,
              dairy products, beverages, household essentials, and
              daily needs at affordable prices. Our mission is to make
              grocery shopping easy, convenient, and enjoyable for every
              family.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-4">
                  <FaLeaf />
                </div>
                <h4 className="font-semibold text-gray-800">
                  Farm Fresh
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Fresh vegetables & fruits sourced daily.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-4">
                  <FaShippingFast />
                </div>
                <h4 className="font-semibold text-gray-800">
                  Fast Delivery
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Quick and reliable delivery to your home.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-4">
                  <FaTags />
                </div>
                <h4 className="font-semibold text-gray-800">
                  Best Prices
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Great deals and discounts every day.
                </p>
              </div>

            </div>

            <div className="mt-10">
              <Link to="/about">
                <AnimatedButton text="Explore More" />
              </Link>
            </div>

          </div>
        </div>
      </PageContainer>
    </section>
  );
}