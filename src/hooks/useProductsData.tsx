import axios from "axios";
import { useEffect, useState } from "react";
import type { ProductData } from "../utils/types";
import { useParams } from "react-router-dom";
import { categoriesApiEndpoint, productsApiEndpoint } from "@/utils/apiRoute";

export function useProductData() {
  const { slug } = useParams();

  const [productData, setProductData] = useState<ProductData[] | []>([]);
  const [productDataLoading, setProductDataLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setProductDataLoading(true);
      try {
        const endpoint = slug
          ? `${categoriesApiEndpoint}/slug/${slug}`
          : productsApiEndpoint;

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
