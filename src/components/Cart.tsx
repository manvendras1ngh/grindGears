import { Link } from "react-router-dom";
import useStoreContext from "../contexts/CartContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

import type { CartItem } from "../utils/types";
import toast from "react-hot-toast";
import axios from "axios";
import { cartUpdateEndpoint } from "@/utils/apiRoute";

export function Cart() {
  const {
    cartItems,
    wishlistItems,
    handleAddToWishlist,
    handleRemoveFromCart,
  } = useStoreContext();

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    try {
      const res = await axios.post(cartUpdateEndpoint, {
        gearId: id,
        quantity: newQuantity,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error updating gear";
      console.error("Error updating gear", error);
      toast.error(msg);
    }
  };

  const handleMoveToWishlist = async (id: string) => {
    try {
      const alreadyInWishlist = wishlistItems.find((item) => item.id === id);
      if (!alreadyInWishlist) {
        await handleAddToWishlist(id);
        await handleRemoveFromCart(id);
      } else if (alreadyInWishlist) {
        await handleRemoveFromCart(id);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error";
      console.error("Error moving to wishlist", error);
      toast.error(msg);
    }
  };

  const productCard = (data: CartItem) => {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(data.price * data.quantity);

    return (
      <div
        className="flex items-center border-b border-gray-200 py-4 w-full"
        key={data.id}
      >
        {/*Product Image */}
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow px-4">
          <h3 className="font-medium text-gray-900">{data.name}</h3>

          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Qty:</span>
            <div className="flex items-center border rounded-sm border-zinc-300">
              <button
                onClick={() =>
                  handleQuantityChange(data.id, Math.max(1, data.quantity - 1))
                }
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-2 py-1">{data.quantity}</span>
              <button
                onClick={() => handleQuantityChange(data.id, data.quantity + 1)}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-x-8">
            <button
              onClick={() => handleMoveToWishlist(data.id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Move to wishlist
            </button>
            <button
              onClick={() => handleRemoveFromCart(data.id)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="font-semibold">{formattedPrice}</p>
        </div>
      </div>
    );
  };

  const calculateTotalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <section className="bg-white rounded-lg shadow-md px-4 m-8">
        <h1 className="text-3xl mb-8">Shopping Cart</h1>
        {!!cartItems.length ? (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => productCard(item))}
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-4 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-xl font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(calculateTotalCartPrice)}
                </span>
              </div>

              <Link to="/order-summary">
                <button className="mt-4 w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">
            Your cart feels light go pick some of your favourite{" "}
            <Link
              to="/products"
              className="text-blue-600 cursor-pointer hover:underline underline-offset-4"
            >
              gears
            </Link>
          </p>
        )}
      </section>

      {cartItems.length > 3 && <Footer />}
    </>
  );
}
