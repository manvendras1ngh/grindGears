import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import type { AppRoutes } from "./utils/types.ts";

import "./index.css";
import App from "./App.tsx";
import { Landing } from "./components/Landing.tsx";
import { Products } from "./components/Products.tsx";
import { Cart } from "./components/Cart.tsx";
import { Wishlist } from "./components/Wishlist.tsx";
import { ProductDetail } from "./components/ProductDetail.tsx";
import { User } from "./components/User.tsx";
import { OrderSummary } from "./components/OrderSummary.tsx";

const routes: AppRoutes[] = [
  { path: "/", element: <Landing /> },
  { path: "/products", element: <Products /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/products/:slug", element: <Products /> },
  { path: "/cart", element: <Cart /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/user", element: <User /> },
  { path: "/order-summary", element: <OrderSummary /> },
];
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App routes={routes} />
    </Router>
  </StrictMode>
);
