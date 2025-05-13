import React from "react";
import Image from "next/image";

const TopNavigation = () => {
  return (
    <div className="flex flex-row justify-between p-4 bg-white">
      <div className="flex items-center">
        <Image src="/xlogo.svg" alt="logo" width={32} height={32} />
        <p className="text-2xl font-bold">MEDIA FEED</p>
      </div>
      <div className="flex items-center">
        <p className="text-red-500 font-bold">CONCEPT</p>
      </div>
    </div>
  );
};

export default TopNavigation;
