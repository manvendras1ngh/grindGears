import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { FaHeartCircleXmark } from "react-icons/fa6";

import { FaCartPlus } from "react-icons/fa";

import useStoreContext from "../contexts/CartContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import type { ProductData } from "../utils/types";
import { RatingStars } from "./ProductDetail";

export function Wishlist() {
  const { handleAddToCart, handleRemoveWishlistItem, wishlistItems } =
    useStoreContext();

  const productCard = (data: ProductData) => {
    return (
      <Card
        key={data.id}
        sx={{
          Width: 300,
          height: 420,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
        className="w-full"
      >
        <CardActionArea>
          <Link to={`/product/${data.id}`}>
            <CardMedia
              component="img"
              height="140"
              image={data.image}
              className="object-cover h-[200px]"
              alt={data.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {data.name}
              </Typography>
              <div className="text-sm">
                <RatingStars productRating={data.rating} />
              </div>
              <div className="text-blue-900 font-semibold font-2xl mt-1">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(data.price)}
              </div>
            </CardContent>
          </Link>
        </CardActionArea>

        <CardActions sx={{ alignItems: "flex-start" }}>
          <IconButton aria-label="add to wishlist">
            <FaHeartCircleXmark
              onClick={() => handleRemoveWishlistItem(data.id)}
            />
          </IconButton>
          <IconButton aria-label="add to cart">
            <FaCartPlus onClick={() => handleAddToCart(data)} />
          </IconButton>
        </CardActions>
      </Card>
    );
  };
  return (
    <>
      <Navbar />
      <section className="bg-white rounded-lg shadow-md px-4 m-8">
        <h1 className="text-3xl mb-8">Your wishlisted gears</h1>
        {wishlistItems.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center items-start gap-6 p-4">
            {wishlistItems.map((product) => productCard(product))}
          </div>
        ) : (
          <p className="text-center py-8 text-zinc-500">
            Your wishlist is empty go pick some of your favourite{" "}
            <Link
              to="/products"
              className="text-blue-600 cursor-pointer hover:underline underline-offset-4"
            >
              gears
            </Link>
          </p>
        )}
      </section>

      {!!wishlistItems.length && <Footer />}
    </>
  );
}
