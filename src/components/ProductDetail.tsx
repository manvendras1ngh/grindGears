import { useState } from "react";
import toast from "react-hot-toast";
import { FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { FaTruck, FaCreditCard, FaRegThumbsUp } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { FaHeart, FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import useStoreContext from "../contexts/CartContext";
import type { ProductData } from "../utils/types";
import { useProductData } from "../hooks/useProductsData";

export function RatingStars({ productRating }: { productRating: number }) {
  return (
    <div className="flex items-center mt-4">
      <span className="font-semibold mr-2">{productRating}</span>
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className="inline"
            size={15}
            color={Math.floor(productRating) > index ? "#F2C265" : "a9a9a9"}
          />
        ))}
      </div>
    </div>
  );
}

export function ProductDetail() {
  const navigate = useNavigate();

  const {
    wishlistItems,
    setWishlistItems,
    handleAddToCart,
    handleRemoveWishlistItem,
  } = useStoreContext();

  const { productData } = useProductData();

  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();

  const product = productData.find((item) => item.id === id);

  const features = [
    {
      icon: <BsBoxSeam />,
      text: "10 days Returnable",
    },
    {
      icon: <FaRegThumbsUp />,
      text: "Pay on Delivery",
    },
    {
      icon: <FaTruck />,
      text: "Free Delivery",
    },
    {
      icon: <FaCreditCard />,
      text: "Secure Payment",
    },
  ];

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNow = (product: ProductData, quantity: number) => {
    handleAddToCart(product, quantity);
    navigate("/cart");
  };

  const handleAddToWishlist = (data: ProductData) => {
    setWishlistItems((prev) => [...prev, data]);
    toast.success("Gear wishlisted");
  };

  return (
    <>
      <Navbar />
      {!product && (
        <div className="text-center mt-56">
          <p className="text-2xl text-zinc-700">Oops! Gear not found.</p>
        </div>
      )}
      {product && (
        <>
          <section className="max-w-6xl  p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image Section */}

              <div className="md:w-1/3">
                <div className="relative bg-zinc-100 rounded-md">
                  <button className="absolute top-2 right-2 p-2 rounded-full bg-white">
                    {wishlistItems.find((item) => item.id === product.id) ? (
                      <FaHeart
                        color="#FF0000"
                        onClick={() => handleRemoveWishlistItem(product.id)}
                      />
                    ) : (
                      <FiHeart
                        onClick={() => handleAddToWishlist(product)}
                        className="text-zinc-500 cursor-pointer"
                      />
                    )}
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[500px] object-cover"
                  />
                  <button
                    onClick={() => handleBuyNow(product, quantity)}
                    className="w-full py-3 bg-blue-500 text-white mt-2 cursor-pointer"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => handleAddToCart(product, quantity)}
                    className="w-full py-3 bg-zinc-400 text-white mt-2 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="md:w-2/3">
                <h1 className="text-3xl font-semibold text-zinc-800">
                  {product.name}
                </h1>
                <RatingStars productRating={product.rating} />
                <p className="text-2xl font-bold mt-4">₹{product.price}</p>

                {/* quantity controls */}
                <div className="mt-8">
                  <div className="flex items-center">
                    <span className="mr-4">Quantity:</span>
                    <div className="flex items-center border border-zinc-300 rounded">
                      <button
                        onClick={decrementQuantity}
                        className="px-2 py-1 border-r border-zinc-300"
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-12 text-center"
                      />
                      <button
                        onClick={incrementQuantity}
                        className="px-2 py-1 border-l border-zinc-300"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-b border-zinc-200 my-12 py-6">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {features.map((feature, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xl mb-1">{feature.icon}</div>
                        <p className="text-xs">{feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Product Description:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li className="text-sm text-zinc-700">{product.detail}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </>
  );
}
