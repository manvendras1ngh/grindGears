import { useState, useContext, createContext, useEffect } from "react";
import type { ProductData, CartItem } from "../utils/types";
import toast from "react-hot-toast";
import axios from "axios";

type StoreContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlistItems: ProductData[];
  setWishlistItems: React.Dispatch<React.SetStateAction<ProductData[]>>;
  handleAddToCart: (data: ProductData, quantity?: number) => Promise<void>;
  handleRemoveFromCart: (id: string) => Promise<void>;
  handleAddToWishlist: (id: string) => Promise<void>;
  handleRemoveWishlistItem: (id: string) => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a CartProvider");
  }
  return context;
}

export function StoreContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartUrl = "http://localhost:5175/api/v1/cart";
  const wishlistUrl = "http://localhost:5175/api/v1/wishlist";

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<ProductData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const cartRes = await axios.get(cartUrl);
        const wishlistRes = await axios.get(wishlistUrl);
        setCartItems(cartRes.data.data);
        setWishlistItems(wishlistRes.data.data);
      } catch (error) {
        console.error("Error getting cart items", error);
      }
    })();
  }, [cartItems, wishlistItems]);

  const handleAddToCart = async (data: ProductData, quantity = 1) => {
    try {
      const res = await axios.post(`${cartUrl}/add`, {
        gearId: data.id,
        quantity: quantity,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error adding to cart";
      console.error("Error adding to cart", error);
      toast.error(message);
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    try {
      const res = await axios.delete(`${cartUrl}/remove`, {
        data: { gearId: id },
      });
      toast.success(res.data.message);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error removing from cart";
      console.error("Error removing from cart", error);
      toast.error(message);
    }
  };

  const handleAddToWishlist = async (id: string) => {
    try {
      const res = await axios.post(`${wishlistUrl}/add`, { gearId: id });
      toast.success(res.data.message);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error adding to wishlist";
      console.error("Error adding to wishlist", error);
      toast.error(message);
    }
  };

  const handleRemoveWishlistItem = async (id: string) => {
    try {
      const updatedGears = wishlistItems.filter((item) => item.id !== id);
      setWishlistItems(updatedGears);
      const res = await axios.delete(`${wishlistUrl}/remove`, {
        data: { gearId: id },
      });
      toast.success(res.data.message);
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Error removing from wishlist";
      console.error("Error removing from wishlist");
      toast.error(msg);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        setCartItems,
        wishlistItems,
        setWishlistItems,
        handleAddToCart,
        handleRemoveFromCart,
        handleAddToWishlist,
        handleRemoveWishlistItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export default useStoreContext;
