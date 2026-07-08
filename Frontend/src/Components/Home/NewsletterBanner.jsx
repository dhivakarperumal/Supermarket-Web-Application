import React, { useState } from "react";
import PageContainer from "../CommenComponents/PageContainer";
import toast from "react-hot-toast";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed successfully! 🎉");
    setEmail("");
  };

  return (
    <section className="py-10 bg-gray-900">
      <PageContainer>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-white text-2xl font-black mb-1">SUBSCRIBE TO OUR NEWSLETTER</h2>
            <p className="text-gray-400 text-sm font-medium">Get weekly updates on offers & new arrivals</p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-0 max-w-md">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-l-full text-sm outline-none border-0 min-w-[220px]"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white font-bold text-sm px-6 py-3 rounded-r-full transition shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </PageContainer>
    </section>
  );
}
