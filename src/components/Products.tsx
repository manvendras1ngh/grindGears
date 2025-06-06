import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Drawer,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Radio,
  RadioGroup,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { RiMenuUnfold2Fill } from "react-icons/ri";
import { FaCartPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

import type { ProductData } from "../utils/types";
import useStoreContext from "../contexts/CartContext";

import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { RatingStars } from "./ProductDetail";
import { useProductData } from "../hooks/useProductsData";

interface FilterState {
  categories: string[];
  rating: number;
  sortBy: "none" | "low-to-high" | "high-to-low";
}

export function Products() {
  const {
    handleAddToCart,
    handleAddToWishlist,
    handleRemoveWishlistItem,
    wishlistItems,
  } = useStoreContext();

  const { productData, productDataLoading } = useProductData();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    rating: 0,
    sortBy: "none",
  });

  console.log("product component");

  // Extract unique categories from productData
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    productData?.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet);
  }, [productData]);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const handleRatingChange = (_: Event, newValue: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: event.target.value as FilterState["sortBy"],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      rating: 0,
      sortBy: "none",
    });
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...productData];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category && filters.categories.includes(product.category)
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(
        (product) => (product.rating || 0) >= filters.rating
      );
    }

    if (filters.sortBy === "low-to-high") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filters.sortBy === "high-to-low") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [filters, productData]);

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ p: 2, width: drawerWidth }}>
      {/* Clear Filters Button */}
      <div className="flex items-center justify-between mb-3">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Filters
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={clearFilters}
          sx={{ minWidth: "auto" }}
        >
          Clear All
        </Button>
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* Category Filter */}
      <div className="mb-4">
        <p className="mb-2">Category</p>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.categories.includes(category)}
                  onChange={(e) =>
                    handleCategoryChange(category, e.target.checked)
                  }
                  size="small"
                />
              }
              label={category}
              sx={{ ml: 0 }}
            />
          ))}
        </FormGroup>
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* Rating Filter */}
      <div className="mb-4">
        <p className="mb-2">Minimum Rating: {filters.rating} stars</p>
        <Slider
          value={filters.rating}
          onChange={handleRatingChange}
          min={0}
          max={5}
          step={0.5}
          marks={[
            { value: 0, label: "0" },
            { value: 2.5, label: "2.5" },
            { value: 5, label: "5" },
          ]}
          valueLabelDisplay="auto"
        />
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* Sort by Price */}
      <div className="mb2">
        <p className="mb-2">Sort by Price</p>
        <RadioGroup value={filters.sortBy} onChange={handleSortChange}>
          <FormControlLabel
            value="none"
            control={<Radio size="small" />}
            label="Default"
            sx={{ ml: 0 }}
          />
          <FormControlLabel
            value="low-to-high"
            control={<Radio size="small" />}
            label="Low to High"
            sx={{ ml: 0 }}
          />
          <FormControlLabel
            value="high-to-low"
            control={<Radio size="small" />}
            label="High to Low"
            sx={{ ml: 0 }}
          />
        </RadioGroup>
      </div>
    </Box>
  );

  const productCard = useMemo(() => {
    return (data: ProductData) => (
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
            {wishlistItems.find((item) => item.id === data.id) ? (
              <FaHeart
                color="#FF0000"
                onClick={() => handleRemoveWishlistItem(data.id)}
              />
            ) : (
              <FaRegHeart onClick={() => handleAddToWishlist(data.id)} />
            )}
          </IconButton>
          <IconButton aria-label="add to cart">
            <FaCartPlus onClick={() => handleAddToCart(data)} />
          </IconButton>
        </CardActions>
      </Card>
    );
  }, [
    productData,
    handleAddToCart,
    handleAddToWishlist,
    handleRemoveWishlistItem,
  ]);

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <Navbar />
      </div>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: isMobile ? 0 : "64px",
            height: isMobile ? "100%" : "calc(100% - 64px)",
          },
        }}
      >
        {isMobile && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleDrawerClose}>
              <MdClose />
            </IconButton>
          </Box>
        )}
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center mt-8">
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <RiMenuUnfold2Fill />
            </IconButton>
          )}
          <h1 className="text-4xl font-light m-6">
            Precision gears for your next build
          </h1>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center items-start gap-6">
          {productDataLoading
            ? "Gears Data Loading..."
            : filteredAndSortedProducts.map((product) => productCard(product))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
