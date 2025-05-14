"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Header from "./Header/Header";
import Description from "./Description/Description";
import Engagement from "./Engagement/Engagement";
import Media from "./Media/Media";
import { AudioWaveform, UserRound, MapPin, ChevronDown } from "lucide-react";

interface TaggedUser {
  id: string;
  name: string;
  avatar: string;
}

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
  taggedUsers?: TaggedUser[];
}

const Post: React.FC<PostProps> = ({
  name = "Amour Omar",
  username = "@amouromar",
  date = "now",
  isVerified = true,
  description = "Testing the new media component",
  commentCount = 230,
  retweetCount = 100,
  heartCount = 1000,
  impressionCount = 10000,
  onCommentClick,
  onRetweetClick,
  onHeartClick,
  onShareClick,
  taggedUsers = [
    { id: "1", name: "User 1", avatar: "/profile.png" },
    { id: "2", name: "User 2", avatar: "/profile.png" },
    { id: "3", name: "User 3", avatar: "/profile.png" },
    { id: "4", name: "User 4", avatar: "/profile.png" },
  ],
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  const visibleUsers = taggedUsers.slice(0, 3);
  const hasMoreUsers = taggedUsers.length > 3;

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
        {/* This serves no purpose, it's just a placeholder */}
        <div className="hidden">Nothing</div>
      </div>

      {/* Right */}
      <div className="w-fit flex flex-col">
        <Header
          name={name}
          username={username}
          date={date}
          isVerified={isVerified}
          showGrok={true}
        />
        <Description text={description} />
        <Media />
        {/* Audio and Tagged Users */}
        <div className="flex flex-row items-center gap-2 justify-between mb-2">
          <div className="flex flex-row items-center gap-2">
            {/* Audio */}
            <div
              className="max-w-fit flex flex-row items-center gap-2 py-1 bg-gray-900/10 rounded-full px-2 cursor-pointer overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AudioWaveform className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="text-xs text-gray-500 max-w-26 hover:max-w-48 relative overflow-hidden group">
                <div className="flex transition-transform duration-300 ease-in-out group-hover:-translate-x-2 group-hover:pl-2">
                  <span className="whitespace-nowrap">
                    Original audio of the post: test test!
                  </span>
                </div>
              </div>
            </div>
            {/* Tagged Users */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className="max-w-fit flex flex-row items-center gap-2 py-1 bg-gray-900/10 rounded-full px-2 cursor-pointer"
                onClick={() => hasMoreUsers && setShowDropdown(!showDropdown)}
              >
                <UserRound className="w-4 h-4 text-gray-500" />
                <div className="text-xs text-gray-500 max-w-24 relative overflow-hidden group">
                  <div className="flex items-center gap-2 transition-transform duration-300 ease-in-out group-hover:-translate-x-2 group-hover:pl-2">
                    {/* Initial state - show number */}
                    <span className={`whitespace-nowrap ${showDropdown ? 'hidden' : 'group-hover:hidden'}`}>
                      {taggedUsers.length}
                    </span>
                    
                    {/* Hover state - show avatars */}
                    <div className={`${showDropdown ? 'flex' : 'hidden group-hover:flex'} items-center gap-2`}>
                      {visibleUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={16}
                            height={16}
                            className="rounded-full border border-white"
                          />
                          {index < visibleUsers.length - 1 && <div className="w-0.5" />}
                        </div>
                      ))}
                      {hasMoreUsers && (
                        <>
                          <div className="w-0.5" />
                          <div 
                            className="flex items-center justify-center w-4 h-4 bg-gray-200 rounded-full cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDropdown(!showDropdown);
                            }}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-10 border-t-0 border-t-gray-400">
                  <div className="flex flex-col gap-2">
                    {taggedUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={24}
                          height={24}
                          className="rounded-full text-gray-500"
                        />
                        <span className="text-sm text-gray-500">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-fit flex flex-row items-center gap-2 py-1 bg-gray-900/10 rounded-full px-2 cursor-pointer">
            <MapPin className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500">Tampa, FL</p>
          </div>
        </div>
        <Engagement
          commentCount={commentCount}
          retweetCount={retweetCount}
          heartCount={heartCount}
          impressionCount={impressionCount}
          onCommentClick={onCommentClick}
          onRetweetClick={onRetweetClick}
          onHeartClick={onHeartClick}
          onShareClick={onShareClick}
          className="text-gray-500 flex flex-row gap-2 justify-between"
        />
      </div>
    </div>
  );
};

export default Post;
