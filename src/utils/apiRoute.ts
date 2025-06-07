const baseApiEndpoint = "https://grind-gears-backend.vercel.app/api/v1";

//gears get request
export const productsApiEndpoint = `${baseApiEndpoint}/gears`;

//categories get request
export const categoriesApiEndpoint = `${baseApiEndpoint}/categories`;

//order get, post request
export const orderApiEndpoint = `${baseApiEndpoint}/orders`;

//address get, post(add address), delete requests
export const addressApiEndpoint = `${baseApiEndpoint}/address`;

//cart get request
export const cartApiEndpoint = `${baseApiEndpoint}/cart`;

//wishlist get request
export const wishlistApiEndpoint = `${baseApiEndpoint}/wishlist`;

//cart post request
export const cartUpdateEndpoint = `${baseApiEndpoint}/cart/update`;

//cart delete request
export const clearCartApiEndpoint = `${baseApiEndpoint}/cart/clear`;
