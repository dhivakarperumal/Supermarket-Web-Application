import React, { useContext } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../CommenComponents/PageHeader";
import PageContainer from "../CommenComponents/PageContainer";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (total, item) => total + parseFloat(item.price || 0) * item.quantity,
    0,
  );

  return (
    <>
      <PageHeader title="My Cart" />
      <div className="min-h-screen bg-[#f7f8f3] py-8 sm:py-10">
        <PageContainer>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">Shopping bag</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">Your Cart</h1>
                  <p className="mt-2 text-sm text-slate-500">Review your selections and continue to checkout with confidence.</p>
                </div>
                <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-[#0e6827]">
                  {cart.length} item{cart.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-green-200 bg-gradient-to-br from-green-50 to-white py-20 text-center shadow-[0_20px_50px_rgba(14,104,39,0.06)]">
                    <FiShoppingCart className="mx-auto mb-4 text-5xl text-[#0e6827]" />
                    <h2 className="text-xl font-semibold text-slate-800">Your cart is empty</h2>
                    <p className="mt-2 text-sm text-slate-500">Choose your favorite products and bring them to checkout.</p>
                    <button
                      onClick={() => navigate("/shop")}
                      className="mt-6 rounded-full bg-[#0e6827] px-6 py-3 font-semibold text-white transition hover:bg-[#168637]"
                    >
                      Go to Shop
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => {
                    const name = item.name || item.product_name || item.productName || "Product";
                    const image = item.image || item.product_image || item.thumbnail_image || item.product_images?.[0] || "/placeholder.png";
                    const price = item.price;
                    const mrp = item.mrp;

                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-6 rounded-[1.75rem] border border-green-100 bg-white p-5 shadow-[0_20px_40px_rgba(14,104,39,0.08)] transition hover:-translate-y-0.5 md:flex-row md:items-center"
                      >
                        <div className="h-40 w-full overflow-hidden rounded-[1.25rem] border border-green-100 bg-green-50 md:w-32">
                          <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                {item.category && (
                                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{item.category}</span>
                                )}
                                {item.subcategory && (
                                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{item.subcategory}</span>
                                )}
                              </div>
                            </div>
                            <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-[#0e6827]">
                              ₹{price}
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {item.colorName && (
                              <div className="flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-1">
                                <span className="h-3.5 w-3.5 rounded-full border border-gray-400" style={{ backgroundColor: item.colorHex || "#ccc" }} />
                                <span className="font-semibold text-slate-700">{item.colorName}</span>
                              </div>
                            )}
                            {item.size && (
                              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-slate-700">Size: {item.size}</span>
                            )}
                            {item.age && (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">Age: {item.age}</span>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="rounded-full border border-gray-200 bg-gray-50 p-2 text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#0e6827]"
                              >
                                <FiMinus />
                              </button>
                              <span className="min-w-8 text-center text-base font-semibold text-slate-800">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="rounded-full border border-gray-200 bg-gray-50 p-2 text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#0e6827]"
                              >
                                <FiPlus />
                              </button>
                            </div>
                            {mrp && (
                              <span className="text-sm text-gray-400 line-through">₹{mrp}</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-full bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <aside className="lg:sticky lg:top-24">
                <div className="rounded-[1.75rem] border border-green-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,104,39,0.08)]">
                  <div className="rounded-[1.25rem] bg-linear-to-r from-[#0e6827] via-[#168637] to-[#ffc107] p-5 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Order summary</p>
                    <h2 className="mt-2 text-2xl font-bold">Ready to checkout?</h2>
                    <p className="mt-2 text-sm text-white/85">Free shipping on every order in this store.</p>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-slate-800">
                      <span>Total</span>
                      <span className="text-[#0e6827]">₹{subtotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="mt-6 w-full rounded-full bg-[#0e6827] px-4 py-3 font-semibold text-white transition hover:bg-[#168637]"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate("/shop")}
                    className="mt-3 w-full rounded-full border border-green-200 bg-green-50 px-4 py-3 font-semibold text-[#0e6827] transition hover:bg-green-100"
                  >
                    Continue Shopping
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </PageContainer>
      </div>
    </>
  );
}