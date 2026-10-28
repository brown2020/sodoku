import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats seconds into MM:SS display format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/** Whole seconds since a game start, or 0 when the clock has not started. */
export const elapsedSeconds = (startTime: number, now = Date.now()): number => {
  if (!startTime || !Number.isFinite(startTime)) return 0;
  return Math.max(0, Math.floor((now - startTime) / 1000));
};
