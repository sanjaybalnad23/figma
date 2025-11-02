import type { Camera, Color, Point } from "./types";
import React from "react";

export function rgbToHex(color: Color) {
  return `#${[color.r, color.g, color.b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera): Point {
  return { x: Math.round(e.clientX) - camera.x, y: Math.round(e.clientY) - camera.y };
}
