"use client";

import React from "react";
import Image from "next/image";
import Reach from "./Reach/Reach";
import Selection from "./Selection/Selection";
import Textarea from "./Textarea/Textarea";
import { RecordingProvider } from "./RecordingContext";

const Input = () => {
  return (
    <div className="w-full h-fit flex flex-row gap-4 p-4">
      {/* Left */}
      <div className="flex flex-col gap-4">
        <div>
          <Image
            src="/profile.png"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div className="hidden">Nothing</div>
      </div>

      {/* Right */}
      <RecordingProvider>
        <div className="w-full flex flex-col">
          <Textarea />
          <Reach />
          <Selection />
        </div>
      </RecordingProvider>
    </div>
  );
};

export default Input;
