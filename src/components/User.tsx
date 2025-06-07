import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

import { Navbar } from "./Navbar";
import { AddressForm } from "./AddressForm";
import { addressApiEndpoint, orderApiEndpoint } from "@/utils/apiRoute";
import type { Address } from "@/utils/types";
interface Order {
  _id: string;
  gears: Array<{
    gearId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  totalAmount: number;
  shippingAddress: Address;
  createdAt: string;
}

export function User() {
  const userDetails = {
    name: "Manav Singh",
    username: "manavs",
    email: "manav@yopmail.com",
    phone: "+91-9919395979",
    avatar: "https://placehold.co/400x500/e2e8f0/1e293b?text=MS",
  };

  const [address, setAddress] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const addressRes = await axios.get(addressApiEndpoint);
        setAddress(addressRes.data.data || []);
      } catch (error) {
        console.error("Error getting addresses", error);
      }
    })();
    (async () => {
      try {
        const res = await axios.get(orderApiEndpoint);
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error getting orders");
      }
    })();
  }, []);

  const handleDeleteAddress = async (id: string) => {
    try {
      const deleteAddress = address.filter((add) => add._id !== id);
      setAddress(deleteAddress);
      await axios.delete(addressApiEndpoint, { data: { id: id } });
    } catch (error: any) {
      console.error("Error deleting address", error);
    }
  };

  const handleAddAddress = async ({
    type,
    address,
  }: {
    id: string | null;
    type: string;
    address: string;
  }) => {
    const addressId = uuidv4();
    try {
      if (!type || !address) {
        toast.error("Please provide address details");
        return;
      }
      setAddress((prev) => [
        ...prev,
        { _id: addressId, addressType: type, fullAddress: address },
      ]);

      await axios.post(addressApiEndpoint, {
        type,
        address,
      });
      toast.success("New address added");
    } catch (error) {
      console.error("Error adding address", error);
      toast.error("Error adding address");
    }
  };

  const handleUpdateAddress = async ({
    id,
    type,
    address,
  }: {
    id: string | null;
    type: string;
    address: string;
  }) => {
    try {
      setAddress((prev) => {
        return prev.map((add) =>
          add._id === id
            ? { ...add, addressType: type, fullAddress: address }
            : add
        );
      });
      await axios.post(`${addressApiEndpoint}/update`, {
        id,
        type,
        address,
      });
      toast.success("Address updated");
    } catch (error) {
      console.error("Error updating address", error);
      toast.error("Error updating address");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div>
      <Navbar />

      <section className="max-w-6xl mx-auto p-6">
        {/* User card */}
        <div className="bg-white shadow-xl flex h-[250px] w-[600px] rounded-xl border border-zinc-100 overflow-hidden">
          {/* Image */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-zinc-50 to-zinc-100">
            <img
              src={
                userDetails.avatar ||
                "https://placehold.co/400x400/e4e4e7/71717a?text=User"
              }
              alt={`${userDetails.name}'s avatar`}
              className="object-cover rounded-full w-[140px] h-[140px] border-4 border-white shadow-lg"
            />
          </div>

          {/* User details */}
          <div className="flex-1 p-8 flex flex-col justify-center space-y-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                {userDetails.name}
              </h2>
              <p className="text-lg text-zinc-500 font-medium">
                @{userDetails.username}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                  Email
                </span>
                <span className="text-zinc-700">{userDetails.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                  Phone
                </span>
                <span className="text-zinc-700">{userDetails.phone}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Orders Section */}
        <div className="mt-16">
          <h1 className="text-xl font-semibold mb-6">Order History:</h1>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders?.map((order) => (
                <div
                  key={order._id}
                  className="bg-white shadow-md rounded-lg border border-zinc-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                        Order ID
                      </p>
                      <p className="text-zinc-800 font-medium">
                        #{order._id.slice(-8)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                        Total Amount
                      </p>
                      <p className="text-lg font-semibold text-zinc-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-2">
                      Gears Ordered
                    </p>
                    <div className="space-y-1">
                      {order.gears.map((gear, index) => (
                        <p key={index} className="text-zinc-700">
                          {gear.name} (Qty: {gear.quantity})
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-1">
                      Shipping Address
                    </p>
                    <p className="text-zinc-700">
                      {order.shippingAddress?.addressType} -{" "}
                      {order.shippingAddress?.fullAddress}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-200">
                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                      Order Date
                    </p>
                    <p className="text-zinc-700">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg border border-zinc-100 p-8 text-center">
              <p className="text-zinc-500">No orders found</p>
              <p className="text-sm text-zinc-400 mt-1">
                Your order history will appear here
              </p>
            </div>
          )}
        </div>

        {/* Address and address management */}

        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Address Management:</h1>
            <Button className="cursor-pointer">
              <AddressForm
                mode="add"
                id={null}
                handleSubmit={handleAddAddress}
              />
            </Button>
          </div>
          {address.map(({ _id: id, addressType, fullAddress }) => (
            <div
              key={id}
              className="my-6 mx-2 flex items-center justify-between max-w-6xl bg-white shadow-md rounded-lg border border-zinc-100 p-8"
            >
              <div>
                <p className="font-semibold py-2 text-zinc-800">
                  Address Type: {addressType}
                </p>
                <p className="text-zinc-700">Address: {fullAddress}</p>
              </div>

              <div className="text-sm font-light cursor-pointer">
                <span className="text-blue-600 inline-block">
                  {
                    <AddressForm
                      mode="edit"
                      id={id}
                      initialData={{ addressType, fullAddress }}
                      handleSubmit={handleUpdateAddress}
                    />
                  }
                </span>
                {" / "}
                <span
                  className="text-red-600"
                  onClick={() =>
                    toast.promise(handleDeleteAddress(id), {
                      loading: "Deleting address",
                      success: "Address deleted",
                      error: "Address delete failed",
                    })
                  }
                >
                  delete
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
