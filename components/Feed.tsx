import React from "react";
import Post from "./FeedComponents/Post";

const Feed = () => {
  return (
    <div className="w-full max-h-[500px] flex flex-row gap-4">
      {/* Right */}
      <div className="w-full flex flex-col">
        <Post />
        <hr className="text-gray-200" />
        {/* <Post />
        <hr className="text-gray-200" />
        <Post />
        <hr className="text-gray-200" />
        <Post />
        <hr className="text-gray-200" />
        <Post />
        <hr className="text-gray-200" />
        <Post />
        <hr className="text-gray-200" />
        <Post /> */}
      </div>
    </div>
  );
};

export default Feed;
