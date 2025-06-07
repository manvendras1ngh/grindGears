import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import heroImage from "../assets/heroImage.jpeg";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { categoriesApiEndpoint } from "@/utils/apiRoute";

type Category = {
  _id: string;
  slug: string;
  imageUrl: string;
  name: string;
  description: string;
};

export function Landing() {
  const [categories, setCategories] = useState<Category[] | []>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(categoriesApiEndpoint);
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error getting categeories", error);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      {/*hero section*/}
      <section className="m-6">
        <div className="lg:flex justify-between items-center gap-18">
          <div className="w-[50%] m-auto lg:ml-8">
            <h1 className="text-6xl font-semibold my-6">
              <span className="block">Your Trusted Destination</span>
              <span className="block">for Premium Auto Spare Parts</span>
            </h1>
            <p className="font-light text-zinc-500">
              At GrindGears, we keep your wheels turning with top-quality,
              reliable automobile spare parts-delivered right to your doorstep.
              Whether you're a DIY enthusiast, a garage professional, or just
              looking for the best replacement for your ride, we’ve got you
              covered.
            </p>

            <div className="bg-indigo-500 rounded py-2 px-4 text-white inline-block my-6">
              <Link to="/products">View our Gear Range</Link>
            </div>
          </div>

          <div>
            <img src={heroImage} alt="auto spare parts" />
          </div>
        </div>
      </section>

      {/* categories */}
      <div className="bg-indigo-950 text-white px-8 pb-18 my-6">
        <h1 className="text-4xl pt-6 mb-16 font-extralight text-center">
          Explore Categories
        </h1>

        <div className="overflow-x-auto w-full">
          <div className="flex gap-5 mx-auto w-max">
            {categories.map((category) => (
              <Card
                sx={{ width: 300 }}
                className="flex-shrink-0"
                key={category._id}
              >
                <CardActionArea>
                  <Link to={`/products/${category.slug}`}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={category.imageUrl}
                      alt={category.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {category.description}
                      </Typography>
                    </CardContent>
                  </Link>
                </CardActionArea>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="m-12">
        <div className="bg-zinc-200 rounded p-12">
          <h2 className="text-3xl font-light text-center mb-6 space-y-2 tracking-wide">
            <span className="block">
              At Toyota, we believe every journey should be smooth and reliable.
            </span>
            <span className="block">
              That’s why we trust GrindGears parts - engineered for performance,
              built for endurance.
            </span>
            <span className="block">every mile feels like the first.</span>
          </h2>
          <p className="text-lg font-extralight text-center">
            - Toyota Engineering Team
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
