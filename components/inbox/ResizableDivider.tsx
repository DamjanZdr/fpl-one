"use client";
import { useRef, useEffect } from "react";

interface ResizableDividerProps {
  position: "left" | "right";
  onMouseDown: (position: "left" | "right") => void;
  isDragging: boolean;
}

export default function ResizableDivider({
  position,
  onMouseDown,
  isDragging,
}: ResizableDividerProps) {
  return (
    <div
      className="w-1 cursor-col-resize flex-shrink-0 relative z-50"
      onMouseDown={() => onMouseDown(position)}
      style={{ height: "100%", minWidth: "4px" }}
    >
      {/* Visible divider line - ensure it's on top */}
      <div className="absolute inset-0 bg-slate-400 border-l-2 border-slate-300 z-50" />
      {/* Hover/drag area */}
      <div className="absolute inset-y-0 -inset-x-3 cursor-col-resize z-50" />
    </div>
  );
}
