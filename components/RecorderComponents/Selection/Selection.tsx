"use client";

import React from "react";
import Image from "next/image";
import { useRecording } from "../RecordingContext";
import { Mic } from "lucide-react";

const Selection: React.FC = () => {
  const { isRecording, startRecording } = useRecording();
  return (
    <div className="w-full h-fit flex mt-2">
      <div className="w-full h-fit flex flex-row items-center gap-4">
        {/* Left */}
        <div className="w-full h-fit flex flex-row gap-4">
          <div className="cursor-pointer">
            <Image src="/gallery.svg" alt="gallery" width={18} height={18} />
          </div>
          <div className="cursor-pointer">
            <Image src="/gif.svg" alt="gif" width={18} height={18} />
          </div>
          <div className="cursor-pointer">
            <Image src="/grok.svg" alt="grok" width={18} height={18} />
          </div>
          <div className="cursor-pointer">
            <Image src="/emoji.svg" alt="emoji" width={18} height={18} />
          </div>
          <div className="cursor-pointer">
            <Image src="/location.svg" alt="location" width={18} height={18} />
          </div>
          <div
            className={`cursor-pointer ${isRecording ? "text-red-500" : ""}`}
            onClick={startRecording}
          >
            <Mic size={18} className="text-gray-500"/>
          </div>
        </div>

        {/* Right */}
        <div className="px-2">
          <div className="cursor-pointer">
            <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
