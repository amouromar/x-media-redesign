"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

import Header from "../../Header/Header";
import { AudioWaveform } from "lucide-react";
import Engagement from "../../Engagement/Engagement";

interface VideoItem {
  id: string;
  src: string;
  name: string;
  username: string;
  caption: string;
  audio: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  aspectRatio?: "1:1" | "16:9" | "9:16";
}

// Sample videos data
const sampleVideos: VideoItem[] = [
  {
    id: "1",
    src: "/media/Strange.mp4",
    name: "SpaceX",
    username: "@spacex",
    caption:
      "Mars mission concept. Explore the red planet like never before. Witness the breathtaking landscapes and discover new wonders. Join us on this intergalactic journey. Get ready for liftoff. The future of space travel is now.\n\nOur mission is to make life multiplanetary. With cutting-edge technology and a passionate team, we are pushing the boundaries of space exploration. Be part of history as we embark on the greatest adventure known to humankind.",
    audio: "Original Sound",
    likes: 1000,
    comments: 100,
    shares: 50,
    impressions: 10000000,
    aspectRatio: "1:1",
  },
];

interface CarouselProps {
  videos?: VideoItem[];
  onVideoChange?: (index: number) => void;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
  onFollow?: (username: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  videos = sampleVideos,
  onVideoChange,
  onLike,
  onComment,
  onShare,
  onFollow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHD, setIsHD] = useState(false);
  const [isSubtitlesOn, setIsSubtitlesOn] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [overlayColor, setOverlayColor] = useState("#00000000");
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState("1080p");
  const [selectedSubtitle, setSelectedSubtitle] = useState("Off");
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset currentIndex if videos array changes and current index is out of bounds
  useEffect(() => {
    if (currentIndex >= videos.length) {
      setCurrentIndex(Math.max(0, videos.length - 1));
    }
  }, [videos.length, currentIndex]);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videos.length === 0) return;

    video.volume = volume;
    video.loop = true;
    video.playbackRate = playbackSpeed;

    if (isPlaying && hasUserInteracted) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    } else {
      video.pause();
    }

    if (onVideoChange) {
      onVideoChange(currentIndex);
    }
  }, [
    isPlaying,
    volume,
    currentIndex,
    onVideoChange,
    playbackSpeed,
    videos.length,
    hasUserInteracted,
  ]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
      if (e.code === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
      if (e.code === "ArrowDown" && currentIndex < videos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentIndex, videos.length]);

  // Handle touch/swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endY = touch.clientY;
      const diff = startY - endY;

      if (Math.abs(diff) > 50) {
        // Minimum swipe distance
        if (diff > 0 && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        } else if (diff < 0 && currentIndex < videos.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    };

    document.addEventListener("touchend", handleTouchEnd, { once: true });
  };

  const handlePlayPause = () => {
    setHasUserInteracted(true);
    setIsPlaying(!isPlaying);
  };
  const handleVolumeToggle = () => setVolume(volume === 0 ? 1 : 0);
  const handleDoubleClick = () => {
    if (onLike && videos.length > 0) onLike(videos[currentIndex].id);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Video event handlers for progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => {
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setCurrentTime(0);
    };
    
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("durationchange", updateTime);
    video.addEventListener("progress", updateTime);
    
    // Initial update
    if (video.readyState >= 2) {
      updateTime();
    }
    
    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("durationchange", updateTime);
      video.removeEventListener("progress", updateTime);
    };
  }, [currentIndex]);

  const handleProgressBarClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time helper function
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // When changing video, reset caption expansion
  useEffect(() => {
    setShowFullCaption(false);
  }, [currentIndex]);

  // If no videos are provided, show a placeholder
  if (videos.length === 0) {
    return (
      <div className="relative h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white">No videos available</p>
      </div>
    );
  }

  // Get container class and style based on fullscreen state
  const getContainerClass = () => {
    if (isFullscreen) {
      const video = videos[currentIndex];
      switch (video.aspectRatio) {
        case "16:9":
          return "aspect-video w-full h-full flex items-center justify-center";
        case "9:16":
          return "aspect-[9/16] w-full h-full flex items-center justify-center";
        default:
          return "aspect-square w-full h-full flex items-center justify-center";
      }
    }
    // Default: fixed 400x400 on mobile and 500x500 on desktop, no aspect ratio utility
    return "flex items-center justify-center";
  };

  const getVideoStyle = () => {
    if (isFullscreen) {
      return "w-full h-full object-cover rounded-lg";
    }
    // Default: fixed 400x400 on mobile and 500x500 on desktop
    return "w-[400px] md:w-[500px] h-[400px] md:h-[500px] object-cover rounded-lg";
  };

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "relative h-screen w-full bg-black flex items-center justify-center"
          : "relative w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-black flex items-center justify-center rounded-lg"
      }
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handlePlayPause}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
    >
      {/* Video Container */}
      <div className={getContainerClass()}>
        {/* Play Button Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
          >
            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
              <Image
                src="/media/controls/play.svg"
                alt="Play"
                width={32}
                height={32}
                className="ml-1"
              />
            </div>
          </div>
        )}
        {/* Accessibility overlay color */}
        {overlayColor !== "#00000000" && (
          <div
            className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
            style={{ background: overlayColor }}
          />
        )}
        {/* Blur overlay when caption expanded */}
        {showFullCaption && (
          <div className="absolute inset-0 z-10 backdrop-blur-sm pointer-events-none transition-all duration-300" />
        )}
        <video
          ref={videoRef}
          src={videos[currentIndex].src}
          className={getVideoStyle()}
          playsInline
          onError={() => console.error("Video failed to load")}
          style={{ filter: `brightness(${brightness}) contrast(${contrast})` }}
        />
      </div>

      {/* On-Screen Info and Right Sidebar: Only show in fullscreen */}
      {isFullscreen && (
        <>
          {/* On-Screen Info */}
          <div
            className="absolute bottom-26 left-5 text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Name and username */}
            <div className="flex flex-row items-center gap-2 py-1">
              <Header
                name={videos[currentIndex].name}
                username={videos[currentIndex].username}
                isVerified={true}
                showGrok={false}
                date={"now"}
                className="text-white"
              />
              {/* Follow button */}
              {!isFollowing && (
                <button
                  className="font-bold bg-white text-black px-4 py-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFollowing(true);
                    if (onFollow) onFollow(videos[currentIndex].username);
                  }}
                >
                  Follow
                </button>
              )}
            </div>
            {/* Caption */}
            <div className="flex flex-col items-start py-1 max-w-[24rem] w-96">
              <p
                className={`text-md font-extralight whitespace-pre-line transition-all duration-300 ${
                  showFullCaption ? "line-clamp-none" : "line-clamp-1"
                }`}
              >
                {videos[currentIndex].caption}
              </p>
              <button
                className="text-xs underline font-bold text-white/80 hover:text-white whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullCaption((prev) => !prev);
                }}
              >
                {showFullCaption ? "See less" : "See more"}
              </button>
            </div>
            {/* Audio */}
            <div
              className="w-fit flex flex-row items-center gap-2 py-1 bg-gray-900/20 rounded-full px-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <AudioWaveform className="w-4 h-4 text-white" />
              <p className="text-xs">{videos[currentIndex].audio}</p>
            </div>
          </div>
          {/* Right Sidebar */}
          <div
            className="absolute bottom-24 right-5 transform -translate-y-1/2 bg-gray-900/20 rounded-full px-2 py-1 text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Engagement
              commentCount={videos[currentIndex].comments}
              retweetCount={videos[currentIndex].shares}
              heartCount={videos[currentIndex].likes}
              impressionCount={videos[currentIndex].impressions}
              onCommentClick={() => {
                if (onComment) onComment(videos[currentIndex].id);
              }}
              onRetweetClick={() => {
                if (onShare) onShare(videos[currentIndex].id);
              }}
              className="text-white flex flex-col lg:flex-row gap-2 justify-between"
            />
          </div>
        </>
      )}

      {/* Control Bar */}
      <div
        className={`absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100 rounded-lg" : "opacity-0 rounded-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-white">
          <div className="w-full flex flex-col items-center gap-4">
            {/* Always show volume button, volume slider, progress bar, and fullscreen button */}
            <div className="flex flex-row items-center justify-between gap-2">
              {/* Volume button */}
              <div className="relative group flex items-center cursor-pointer">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVolumeToggle();
                  }}
                >
                  <Image
                    src={
                      volume === 0
                        ? "/media/controls/soundOff.svg"
                        : "/media/controls/soundOn.svg"
                    }
                    alt={volume === 0 ? "Unmute" : "Mute"}
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                </button>
                {/* Volume slider: hidden by default, shown on hover (desktop only) */}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 h-1 accent-white absolute -right-9 -top-12 hidden group-hover:block bg-black/80 rounded rotate-270"
                  style={{ verticalAlign: "middle" }}
                />
              </div>
              {/* Progress bar */}
              <div
                className={`h-2 bg-gray-400 rounded-full overflow-hidden cursor-pointer relative ${isFullscreen ? "w-7xl" : "w-80 md:w-96"}`}
                onClick={handleProgressBarClick}
                onMouseDown={handleProgressBarClick}
              >
                <div
                  className="h-full bg-white absolute top-0 left-0"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                  }}
                />
              </div>
              {/* Time display */}
              <div className="w-8">
                <span className="text-xs text-center whitespace-nowrap">
                  {formatTime(duration - currentTime)}
                </span>
              </div>
              {/* Fullscreen button */}
              <div className="mt-2 cursor-pointer">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreen();
                  }}
                >
                  <Image
                    src={
                      isFullscreen
                        ? "/media/controls/minimize.svg"
                        : "/media/controls/expand.svg"
                    }
                    alt={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    width={20}
                    height={20}
                    className="font-bold cursor-pointer"
                  />
                </button>
              </div>
            </div>
            {/* Show all controls only in fullscreen */}
            {isFullscreen && (
              <>
                {/* Subtitles, playback speed, HD, and settings (with submenus) */}
                <div className="flex flex-row items-center justify-between gap-2">
                  {/* Subtitles */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSubtitlesMenu((prev) => !prev);
                        setShowResolutionMenu(false);
                        setShowSpeedMenu(false);
                      }}
                    >
                      <Image
                        src={
                          isSubtitlesOn
                            ? "/media/controls/subtitlesON.svg"
                            : "/media/controls/subtitlesOFF.svg"
                        }
                        alt={
                          isSubtitlesOn
                            ? "Turn off subtitles"
                            : "Turn on subtitles"
                        }
                        width={24}
                        height={24}
                      />
                    </button>
                    {showSubtitlesMenu && (
                      <div
                        className="absolute bottom-10 left-0 bg-black/90 text-white rounded-lg p-2 z-50 min-w-[120px] flex flex-col gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["Off", "English", "Italian", "Spanish"].map(
                          (lang) => (
                            <button
                              key={lang}
                              className={`text-left px-2 py-1 rounded hover:bg-white/10 ${selectedSubtitle === lang ? "bg-white/10 font-bold" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubtitle(lang);
                                setIsSubtitlesOn(lang !== "Off");
                                setShowSubtitlesMenu(false);
                              }}
                            >
                              {lang}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  {/* Playback Speed */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSpeedMenu((prev) => !prev);
                        setShowResolutionMenu(false);
                        setShowSubtitlesMenu(false);
                      }}
                    >
                      <Image
                        src="/media/controls/playbackSpeed.svg"
                        alt={`Playback speed: ${playbackSpeed}x`}
                        width={24}
                        height={24}
                      />
                    </button>
                    {showSpeedMenu && (
                      <div
                        className="absolute bottom-10 left-0 bg-black/90 text-white rounded-lg p-2 z-50 min-w-[120px] flex flex-col gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[0.5, 1, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            className={`text-left px-2 py-1 rounded hover:bg-white/10 ${selectedSpeed === speed ? "bg-white/10 font-bold" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSpeed(speed);
                              setPlaybackSpeed(speed);
                              setShowSpeedMenu(false);
                            }}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* HD/Resolution */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowResolutionMenu((prev) => !prev);
                        setShowSpeedMenu(false);
                        setShowSubtitlesMenu(false);
                      }}
                    >
                      <Image
                        src={
                          isHD
                            ? "/media/controls/HDon.svg"
                            : "/media/controls/HDoff.svg"
                        }
                        alt={isHD ? "Turn off HD" : "Turn on HD"}
                        width={24}
                        height={24}
                      />
                    </button>
                    {showResolutionMenu && (
                      <div
                        className="absolute bottom-10 left-0 bg-black/90 text-white rounded-lg p-2 z-50 min-w-[120px] flex flex-col gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["1080p", "720p", "480p"].map((res) => (
                          <button
                            key={res}
                            className={`text-left px-2 py-1 rounded hover:bg-white/10 ${selectedResolution === res ? "bg-white/10 font-bold" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResolution(res);
                              setIsHD(res === "1080p");
                              setShowResolutionMenu(false);
                            }}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Settings */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(!showSettings);
                      setShowResolutionMenu(false);
                      setShowSubtitlesMenu(false);
                      setShowSpeedMenu(false);
                    }}
                  >
                    <Image
                      src="/media/controls/settings.svg"
                      alt="Settings"
                      width={24}
                      height={24}
                      className="mb-2 cursor-pointer"
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {isFullscreen && showSettings && (
        <div
          className="absolute bottom-16 right-xl bg-black/80 text-white p-4 rounded-lg min-w-[320px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold">Brightness</label>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.01}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-full accent-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold">Contrast</label>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.01}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-full accent-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold">Overlay Color</label>
              <input
                type="color"
                value={overlayColor}
                onChange={(e) => setOverlayColor(e.target.value + "80")}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-16 p-0 border-none bg-transparent"
              />
            </div>

            {/* Clear Overlay and Reset Buttons */}
            <div className="flex flex-row gap-2">
              {/* Clear Overlay Button */}
              <button
                className="text-xs underline text-white/80 hover:text-white mt-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setOverlayColor("#00000000");
                }}
              >
                Clear Overlay
              </button>
              {/* Reset Button */}
              <button
                className="text-xs underline text-white/80 hover:text-white mt-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrightness(1);
                  setContrast(1);
                  setOverlayColor("#00000000");
                  setIsSubtitlesOn(false);
                  setPlaybackSpeed(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
