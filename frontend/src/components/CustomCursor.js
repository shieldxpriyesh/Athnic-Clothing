"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, [role='button'], input, textarea, select, .interactive")) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseDown = () => setExpanded(true);
    const handleMouseUp = () => setExpanded(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Use a more robust check or just allow it (it's pointer-events: none anyway)
  // if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <div
      className={`custom-cursor ${expanded ? "expanded" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
