"use client";
import { useState, useRef, useEffect } from "react";

export function useResizablePanels() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(25); // percentage
  const [rightPanelWidth, setRightPanelWidth] = useState(25); // percentage
  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (divider: "left" | "right") => {
    setIsDragging(divider);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const relativeX = e.clientX - rect.left;
      const percentage = (relativeX / containerWidth) * 100;

      if (isDragging === "left") {
        // Left divider controls left panel width - ensure minimum 280px
        const minWidthPercent = (280 / containerWidth) * 100;
        const maxWidthPercent = 60; // Allow up to 60% for left panel
        const newLeftWidth = Math.min(Math.max(percentage, minWidthPercent), maxWidthPercent);
        setLeftPanelWidth(newLeftWidth);
      } else if (isDragging === "right") {
        // Right divider controls right panel width - ensure minimum 280px
        const minWidthPercent = (280 / containerWidth) * 100;
        const maxWidthPercent = 60; // Allow up to 60% for right panel
        const newRightWidth = Math.min(
          Math.max(100 - percentage, minWidthPercent),
          maxWidthPercent
        );
        setRightPanelWidth(newRightWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Calculate middle panel width
  const middlePanelWidth = 100 - leftPanelWidth - rightPanelWidth;

  return {
    leftPanelWidth,
    rightPanelWidth,
    middlePanelWidth,
    isDragging,
    containerRef,
    handleMouseDown,
  };
}
