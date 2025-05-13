import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";

interface HeaderProps {
  name: string;
  username: string;
  date: string;
  isVerified: boolean;
  showGrok?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  name,
  username,
  date,
  isVerified,
  showGrok = false,
  className = "",
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      {/* Name */}
      <div className="flex flex-row gap-1 items-baseline">
        <div>
          <p className={`text-sm lg:text-base whitespace-nowrap font-bold cursor-pointer hover:underline ${className}`}>
            {name}
          </p>
        </div>
        {isVerified && (
          <div>
            <VerifiedIcon
              className="text-blue-500"
              style={{ width: "18px", height: "18px" }}
            />
          </div>
        )}
        <div>
          <p className={`text-sm lg:text-base whitespace-nowrap font-extralight hover:underline cursor-pointer ${className}`}>
            {username}
          </p>
        </div>
        <div className={`font-extralight ${className}`}>&#x2022;</div>
        <div className={`text-sm lg:text-base whitespace-nowrap font-extralight ${className}`}>
          {date}
        </div>
      </div>
      {/* Menu */}
      <div className="flex flex-row gap-2">
        {showGrok && (
          <Image
            src="/grok.svg"
            alt="grok"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <MoreVertIcon
          className="text-gray-500 cursor-pointer"
          style={{ width: "24px", height: "24px" }}
        />
      </div>
    </div>
  );
};

export default Header;
