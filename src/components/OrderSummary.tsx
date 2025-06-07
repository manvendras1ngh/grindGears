import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import useStoreContext from "../contexts/CartContext";
import type { Address, CartItem } from "../utils/types";
import {
  addressApiEndpoint,
  clearCartApiEndpoint,
  orderApiEndpoint,
} from "@/utils/apiRoute";

export function OrderSummary() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useStoreContext();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const userDetails = {
    name: "Manav Singh",
    username: "manavs",
    email: "manav@yopmail.com",
    phone: "+91-9919395979",
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(addressApiEndpoint);
        setAddresses(res.data.data);

        if (res.data.data.length > 0) {
          setSelectedAddressId(res.data.data[0]._id);
        }
      } catch (error) {
        console.error("Error getting addresses");
        toast.error("Failed to load addresses");
      }
    };

    fetchAddresses();
  }, []);

  // Redirect to cart if no items
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const calculateTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const selectedAddress = addresses.find(
    (addr) => addr._id === selectedAddressId
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        gears: cartItems.map((item) => ({
          gearId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image,
        })),
        totalAmount: calculateTotalPrice,
        shippingAddress: selectedAddress,
      };

      await axios.post(orderApiEndpoint, orderData);

      setTimeout(async () => {
        await axios.delete(clearCartApiEndpoint);
        navigate("/products");
        setCartItems([]);
      }, 3000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to place order";
      console.error("Error placing order", error);
      toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const orderItemCard = (item: CartItem) => {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(item.price * item.quantity);

    return (
      <div
        key={item.id}
        className="flex items-center border-b border-gray-200 py-4"
      >
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded"
          />
        </div>

        <div className="flex-grow px-4">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-900">{formattedPrice}</p>
        </div>
      </div>
    );
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />

      <section className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Order Summary
          </h1>
          <p className="text-gray-600">Review your order before placing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Order Items ({cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-2">{cartItems.map(orderItemCard)}</div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* User Details */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Delivery Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Name
                    </span>
                    <p className="text-gray-900 font-medium">
                      {userDetails.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Phone
                    </span>
                    <p className="text-gray-700">{userDetails.phone}</p>
                  </div>
                </div>
              </div>

              {/* Address Selection */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Delivery Address
                </h3>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    <select
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select an address</option>
                      {addresses.map((address) => (
                        <option key={address._id} value={address._id}>
                          {address.addressType} -{" "}
                          {address.fullAddress.substring(0, 50)}...
                        </option>
                      ))}
                    </select>

                    {selectedAddress && (
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="font-medium text-gray-900">
                          {selectedAddress.addressType}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {selectedAddress.fullAddress}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">No addresses found</p>
                    <Link
                      to="/profile"
                      className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                    >
                      Add an address first
                    </Link>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Price Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(calculateTotalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-semibold">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(calculateTotalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() =>
                    toast.promise(handlePlaceOrder(), {
                      loading: "Processing order",
                      success: <b>Order placed successfully!</b>,
                      error: <b>Order processing failed.</b>,
                    })
                  }
                  disabled={!selectedAddressId || isPlacingOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>

                <Button
                  onClick={() => navigate("/cart")}
                  variant="outline"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
