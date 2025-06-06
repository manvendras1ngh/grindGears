import axios from "axios";
import { useEffect, useState } from "react";
import type { ProductData } from "../utils/types";
import { categoriesApiUrl } from "@/components/Landing";
import { useParams } from "react-router-dom";

export function useProductData() {
  const productUrl = "http://localhost:5175/api/v1/gears";

  const { slug } = useParams();

  const [productData, setProductData] = useState<ProductData[] | []>([]);
  const [productDataLoading, setProductDataLoading] = useState(false);

  console.log("product hook");

  useEffect(() => {
    const getData = async () => {
      setProductDataLoading(true);
      try {
        const endpoint = slug ? `${categoriesApiUrl}/slug/${slug}` : productUrl;

        const productsRes = await axios.get(endpoint);

        setProductData(productsRes.data.data.map(mapper));
      } catch (error) {
        console.error("Error getting data");
      } finally {
        setProductDataLoading(false);
      }
    };
    getData();
  }, [slug]);

  const mapper = (gear: any) => ({
    id: gear._id,
    name: gear.name,
    detail: gear.details,
    category: gear.category.name,
    rating: Number(gear.rating),
    price: Number(gear.price),
    image: gear.imageUrl,
    brand: gear.brand,
    inStock: gear.inStock,
  });

  return { productData, productDataLoading };
}
