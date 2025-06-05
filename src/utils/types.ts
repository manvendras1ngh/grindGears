export type AppRoutes = {
  path: string;
  element: React.JSX.Element;
};

export type ProductData = {
  id: string;
  name: string;
  detail: string;
  category: string;
  rating: number;
  price: number;
  image: string;
  brand: string;
  inStock: boolean;
};

export type CartItem = ProductData & { quantity: number };
