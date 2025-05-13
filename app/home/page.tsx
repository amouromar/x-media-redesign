import React from "react";
import TopNavigation from "@/components/TopNavigation";
import Feed from "@/components/Feed";
import RecordComponent from "@/components/RecordComponent";

export default function Home() {
  return (
    <div className="w-full px-0 md:px-[20%] lg:px-[35%] flex flex-col h-screen">
      <div className="sticky top-0 z-10">
        <TopNavigation />
      </div>

      <hr className="text-gray-200" />

      <div className="flex-1">
        <RecordComponent />
        <hr className="text-gray-200" />
        <Feed />
      </div>
    </div>
  );
}
