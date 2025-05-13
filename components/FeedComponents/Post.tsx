import React from "react";
import Image from "next/image";
import Header from "./Header/Header";
import Description from "./Description/Description";
import Engagement from "./Engagement/Engagement";
import Media from "./Media/Media";

interface PostProps {
  name?: string;
  username?: string;
  date?: string;
  isVerified?: boolean;
  description?: string;
  commentCount?: number;
  retweetCount?: number;
  heartCount?: number;
  impressionCount?: number;
  onCommentClick?: () => void;
  onRetweetClick?: () => void;
  onHeartClick?: () => void;
  onShareClick?: () => void;
}

const Post: React.FC<PostProps> = ({
  name = "Amour Omar",
  username = "@amouromar",
  date = "now",
  isVerified = true,
  description = "Testing the post component",
  commentCount = 230,
  retweetCount = 100,
  heartCount = 1000,
  impressionCount = 10000,
  onCommentClick,
  onRetweetClick,
  onHeartClick,
  onShareClick,
}) => {
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
      <div className="w-fit flex flex-col">
        <Header 
          name={name}
          username={username}
          date={date}
          isVerified={isVerified}
        />
        <Description text={description} />
        <Media />
        <Engagement 
          commentCount={commentCount}
          retweetCount={retweetCount}
          heartCount={heartCount}
          impressionCount={impressionCount}
          onCommentClick={onCommentClick}
          onRetweetClick={onRetweetClick}
          onHeartClick={onHeartClick}
          onShareClick={onShareClick}
          className="text-gray-500"
        />
      </div>
    </div>
  );
};

export default Post;
