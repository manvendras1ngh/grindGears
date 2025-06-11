import { TbShoppingCartHeart } from "react-icons/tb";
import { FaCartShopping, FaGear } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";

import { Drawer } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);

  const drawerList = (
    <section className="my-4 mx-2 w-[220px] space-y-3">
      <div className="flex text-lg items-center space-x-4 border-b border-zinc-200 p-2 cursor-pointer">
        <FaRegUserCircle />
        <Link to="/user">My Profile</Link>
      </div>
      <div className="flex text-lg items-center space-x-4 border-b border-zinc-200 p-2 cursor-pointer">
        <FaGear />
        <Link to="/products">All Gears</Link>
      </div>
      <div className="flex text-lg items-center space-x-4 border-b border-zinc-200 p-2 cursor-pointer">
        <TbShoppingCartHeart />
        <Link to="/wishlist">Wishlist</Link>
      </div>
      <div className="flex text-lg items-center space-x-4 border-b border-zinc-200 p-2 cursor-pointer">
        <FaCartShopping />
        <Link to="/cart">Cart</Link>
      </div>
    </section>
  );
  return (
    <>
      <nav className="flex justify-between items-center text-zinc-600 shadow py-2 px-8 sticky">
        <h1 className="text-2xl font-semibold">
          <Link to="/">GrindGears</Link>
        </h1>

        <div className="lg:flex items-center text-2xl gap-7 hidden cursor-pointer">
          <FaRegUserCircle onClick={() => navigate("/user")} />
          <TbShoppingCartHeart onClick={() => navigate("/wishlist")} />
          <FaCartShopping onClick={() => navigate("/cart")} />
        </div>

        <div className="lg:hidden text-2xl">
          <CiMenuFries onClick={() => setOpenDrawer(!openDrawer)} />
        </div>
      </nav>
      <Drawer
        anchor={"right"}
        open={openDrawer}
        onClose={() => setOpenDrawer(!openDrawer)}
      >
        {drawerList}
      </Drawer>
    </>
  );
}
