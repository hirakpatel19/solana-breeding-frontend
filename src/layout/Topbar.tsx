import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { RiBarChartHorizontalLine } from "react-icons/ri"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";


const Topbar = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className=" w-full relative">
      <div className="container">
        <div className=" flex items-center lg:justify-between gap-20 md:gap-52 lg:gap-5 py-10">
          <div style={{ background: "#190940" }} className=" p-5 rounded-full block lg:hidden">
            <RiBarChartHorizontalLine onClick={() => setOpen(true)} className=" w-8 h-8 transform rotate-180 block lg:hidden text-white cursor-pointer" />
          </div>
          <Link to="/">   <img src="/images/Logo.png" alt="" /></Link>
          <div className="  items-center gap-10 hidden lg:flex">
            <NavLink className={({ isActive }) =>
              isActive ? "text-ac text-xl capitalize" : "text-white text-xl capitalize"
            } to="/traits-mint">traits mint</NavLink>
            <NavLink className={({ isActive }) =>
              isActive ? "text-ac text-xl capitalize" : "text-white text-xl capitalize"
            } to="/">Breed</NavLink>
            <WalletMultiButton></WalletMultiButton>
          </div>
        </div>
      </div>
      {open && <div className=" lg:hidden w-full min-h-screen top-0 left-0 z-50 bg-pr fixed gap-5 flex flex-col items-center justify-center">
        <AiOutlineCloseCircle onClick={() => setOpen(false)} className=" text-ac w-16 h-16 cursor-pointer" />
        <NavLink className={({ isActive }) =>
          isActive ? "text-ac text-xl uppercase" : "text-white uppercase text-xl"
        } to="/traits-mint">traits mint</NavLink>
        <NavLink className={({ isActive }) =>
          isActive ? "text-ac text-xl uppercase" : "text-white uppercase text-xl"
        } to="/">Breed</NavLink>

        <div className=" flex items-center justify-center gap-4">
          <a target="__blank" href="">
            <img src="/images/facebook.png" alt="" />
          </a>
          <a target="__blank" href="">
            <img src="/images/youtube.png" alt="" />
          </a>
          <a target="__blank" href="">
            <img src="/images/twitter.png" alt="" />
          </a>
          <a target="__blank" href="">
            <img src="/images/linkedin.png" alt="" />
          </a>
        </div>
        <div className=" relative cursor-pointer block lg:hidden">
          <img src="/images/connect-wallet.png" className=" w-full h-full object-contain" alt="" />
          <div className=" absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
            <p className=" text-sm text-white uppercase">Connect Wallet</p>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Topbar;
