"use client";

import { TextareaAutosize } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { Globe, Users, Pause, Play, Square, X, RotateCcw } from "lucide-react";
import { useRecording } from "../RecordingContext";
import WaveSurfer from "wavesurfer.js";
import Image from "next/image";

const Textarea: React.FC = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [audience] = React.useState("Everyone");
  const [replySettings] = React.useState("Everyone");
  const containerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [showWaveform, setShowWaveform] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioUrl,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    handleRestart,
    handleDiscard,
  } = useRecording();

  useEffect(() => {
    if (showWaveform && audioUrl && waveformRef.current) {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#888", // lighter black for unplayed
        progressColor: "#000", // black for played
        cursorColor: "#000",
        cursorWidth: 0, // Hide the vertical line
        barWidth: 2,
        barRadius: 2,
        height: 48,
        normalize: false,
      });
      wavesurferRef.current.load(audioUrl);

      // Add event listeners for play/pause states
      wavesurferRef.current.on("play", () => {
        setIsPlaying(true);
      });
      wavesurferRef.current.on("pause", () => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [showWaveform, audioUrl]);

  const handlePlayback = () => {
    if (!wavesurferRef.current) return;

    try {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDone = () => {
    stopRecording();
    setShowWaveform(true);
  };

  const handleRestartAll = () => {
    setShowWaveform(false);
    handleRestart();
  };

  const handleDiscardAll = () => {
    setShowWaveform(false);
    handleDiscard();
  };

  const handlePost = () => {
    setIsPosting(true);
    // Simulate posting...
    setTimeout(() => {
      setIsPosting(false);
      setShowWaveform(false);
      handleDiscard();
      // Optionally show a toast or feedback
    }, 1200);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {isFocused && (
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">{audience}</span>
        </div>
      )}

      {/* Textarea or Recording UI */}
      {!isRecording && !showWaveform ? (
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="What's happening?"
          className={`w-full resize-none outline-none bg-transparent ${
            isFocused ? "text-black" : "text-gray-500"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : null}

      {/* Recording UI */}
      {isRecording && !showWaveform && (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <div>
              <span className="text-lg font-medium">
                {formatTime(recordingTime)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="p-2 rounded-full hover:bg-gray-300"
              >
                {isPaused ? <Play size={24} /> : <Pause size={24} />}
              </button>
              <button
                onClick={handleDone}
                className="p-4 rounded-full hover:bg-blue-100 text-blue-600 border border-blue-200"
              >
                <Image src="/done.svg" alt="Done" width={24} height={24} />
              </button>
              <button
                onClick={stopRecording}
                className="p-2 rounded-full hover:bg-red-300"
              >
                <Square size={24} className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waveform Playback UI */}
      {showWaveform && audioUrl && (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg gap-4">
          <div ref={waveformRef} className="w-full" />
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayback}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <span className="text-lg font-medium">
              {formatTime(recordingTime)}
            </span>
          </div>

          {/* After recording */}
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={handleRestartAll}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full p-2"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={handleDiscardAll}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-600 hover:bg-gray-300 rounded-full p-2"
            >
              <X size={24} />
            </button>
            <button
              onClick={handlePost}
              className="flex items-center gap-2 bg-green-500 text-white p-2 rounded-full font-bold hover:bg-green-600 disabled:opacity-100"
              disabled={isPosting}
            >
              {isPosting ? (
                <div className="flex items-center gap-2 rounded-full">
                  <span>
                    <svg width="60" height="20" viewBox="0 0 120 30">
                      <circle cx="30" cy="15" r="10" fill="#ffffff">
                        <animate
                          attributeName="cy"
                          from="15"
                          to="15"
                          dur="0.6s"
                          begin="0s"
                          repeatCount="indefinite"
                          values="15;5;15"
                          keyTimes="0;0.5;1"
                        ></animate>
                      </circle>
                      <circle cx="60" cy="15" r="10" fill="#ffffff">
                        <animate
                          attributeName="cy"
                          from="15"
                          to="15"
                          dur="0.6s"
                          begin="0.2s"
                          repeatCount="indefinite"
                          values="15;5;15"
                          keyTimes="0;0.5;1"
                        ></animate>
                      </circle>
                      <circle cx="90" cy="15" r="10" fill="#ffffff">
                        <animate
                          attributeName="cy"
                          from="15"
                          to="15"
                          dur="0.6s"
                          begin="0.4s"
                          repeatCount="indefinite"
                          values="15;5;15"
                          keyTimes="0;0.5;1"
                        ></animate>
                      </circle>
                    </svg>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src="/up-arrow.svg"
                    alt="Post"
                    width={24}
                    height={24}
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      <hr
        className={`w-full border-t ${
          isFocused ? "border-gray-400" : "border-gray-200"
        } transition-colors duration-200`}
      />

      {isFocused && (
        <div className="flex items-center gap-2 mt-2">
          <Users size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">{replySettings}</span>
        </div>
      )}
    </div>
  );
};

export default Textarea;
