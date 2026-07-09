import React, { useContext } from "react";
import { FiHeart, FiTrash2, FiEye } from "react-icons/fi";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../CommenComponents/PageHeader";
import PageContainer from "../CommenComponents/PageContainer";

export default function WishList() {
  const { wishlist, removeFromWishlist } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="My Wishlist" />

      <div className="min-h-screen bg-[#f7f8f3] py-8 sm:py-10">
        <PageContainer>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">Saved favorites</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">My Wishlist</h1>
                  <p className="mt-2 text-sm text-slate-500">Keep your favorite pieces handy for the next visit.</p>
                </div>
                <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-[#0e6827]">
                  {wishlist.length} saved item{wishlist.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white px-8 py-20 text-center shadow-[0_20px_50px_rgba(14,104,39,0.06)]">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-[#0e6827]">
                  <FiHeart className="text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Your wishlist is empty</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-500">Browse the collection and save your favorite sarees for later.</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-6 rounded-full bg-[#0e6827] px-6 py-2.5 font-semibold text-white transition hover:bg-[#168637]"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlist.map((item) => {
                  const name = item?.name || item?.product_name || item?.productName || "Product";
                  const image = item?.image || item?.product_image || item?.thumbnail_image || item?.product_images?.[0] || item?.variants?.[0]?.images?.[0] || "/placeholder.png";
                  const price = item?.price ?? item?.variants?.[0]?.price;
                  const mrp = item?.mrp ?? item?.variants?.[0]?.mrp;
                  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

                  return (
                    <div
                      key={item._id || item.id || item.product_id}
                      className="group overflow-hidden rounded-[1.75rem] border border-green-100 bg-white shadow-[0_20px_40px_rgba(14,104,39,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(14,104,39,0.14)]"
                    >
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />

                        {discount > 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-[#0e6827] px-3 py-1 text-xs font-semibold text-white">
                            {discount}% OFF
                          </span>
                        )}

                        <button
                          onClick={() => removeFromWishlist(item.id || item._id || item.product_id)}
                          className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow transition hover:bg-red-50"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-1 font-semibold text-slate-800">{name}</h3>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-lg font-bold text-[#0e6827]">₹{price}</span>
                            {mrp && <div className="text-sm text-gray-400 line-through">₹{mrp}</div>}
                          </div>
                          <button
                            onClick={() => navigate(`/products/${item.id || item.product_id}`)}
                            className="rounded-full bg-[#0e6827] p-2.5 text-white transition hover:bg-[#168637]"
                          >
                            <FiEye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </>
  );
}
