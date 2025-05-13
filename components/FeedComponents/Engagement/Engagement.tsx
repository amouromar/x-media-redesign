import React from "react";
import Image from "next/image";

interface EngagementProps {
  commentCount?: number;
  retweetCount?: number;
  heartCount?: number;
  impressionCount?: number;
  onCommentClick?: () => void;
  onRetweetClick?: () => void;
  onHeartClick?: () => void;
  onShareClick?: () => void;
  className?: string;
}

const Engagement: React.FC<EngagementProps> = ({
  commentCount = 0,
  retweetCount = 0,
  heartCount = 0,
  impressionCount = 0,
  onCommentClick,
  onRetweetClick,
  onHeartClick,
  onShareClick,
  className = "text-white",
}) => {
  const formatCount = (count: number): string => {
    if (!count && count !== 0) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Add filter class based on text color
  const getFilterClass = () => {
    if (className.includes('text-white')) return 'brightness-0 invert';
    if (className.includes('text-gray-500')) return 'brightness-0 opacity-50';
    return 'brightness-0'; // Default to black
  };

  return (
    <div className="flex flex-row gap-4 lg:gap-6 justify-between">
      {/* Comments */}
      <div 
        className="flex flex-row gap-1 items-center py-1 cursor-pointer"
        onClick={onCommentClick}
      >
        <Image src="/comment.svg" alt="comments" width={18} height={18} className={getFilterClass()} />
        <p className={`text-sm font-normal mt-0 ${className}`}>{formatCount(commentCount)}</p>
      </div>

      {/* Retweet */}
      <div 
        className="flex flex-row gap-1 items-center py-1 cursor-pointer"
        onClick={onRetweetClick}
      >
        <Image src="/retweet.svg" alt="retweet" width={18} height={18} className={getFilterClass()} />
        <p className={`text-sm font-normal mt-0 ${className}`}>{formatCount(retweetCount)}</p>
      </div>

      {/* Heart */}
      <div 
        className="flex flex-row gap-2 items-center py-1 cursor-pointer"
        onClick={onHeartClick}
      >
        <Image src="/heart.svg" alt="heart" width={18} height={18} className={getFilterClass()} />
        <p className={`text-sm font-normal mt-0 ${className}`}>{formatCount(heartCount)}</p>
      </div>

      {/* Impressions */}
      <div className="flex flex-row gap-2 items-center py-1">
        <Image
          src="/impressions.svg"
          alt="impressions"
          width={18}
          height={18}
          className={getFilterClass()}
        />
        <p className={`text-sm font-normal mt-0 ${className}`}>{formatCount(impressionCount)}</p>
      </div>

      {/* Share */}
      <div 
        className="flex flex-row gap-2 items-center py-1 cursor-pointer"
        onClick={onShareClick}
      >
        <Image
          src="/share.svg"
          alt="share"
          width={18}
          height={18}
          className={getFilterClass()}
        />
        <p className={`font-normal mt-1 ${className}`}></p>
      </div>
    </div>
  );
};

export default Engagement;
