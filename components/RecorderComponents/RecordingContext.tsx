"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

interface RecordingContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioUrl: string | null;
  isPlaying: boolean;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  handlePlayback: () => void;
  handleRestart: () => void;
  handleDiscard: () => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined,
);

export const useRecording = () => {
  const ctx = useContext(RecordingContext);
  if (!ctx)
    throw new Error("useRecording must be used within a RecordingProvider");
  return ctx;
};

export const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setRecordingTime(0);
      setIsPaused(false);
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handlePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    startRecording();
  };

  const handleDiscard = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setIsRecording(false);
    setIsPaused(false);
  };

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingTime,
        audioUrl,
        isPlaying,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        handlePlayback,
        handleRestart,
        handleDiscard,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};
