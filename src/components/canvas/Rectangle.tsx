import React from "react";
import type { RectangleLayer } from "~/types";
import { rgbToHex } from "~/utils";

export default function Rectangle({ id, layer }: { id: string; layer: RectangleLayer }) {
  const { cornerRadius, fill, height, opacity, stroke, type, width, x, y } = layer;
  return (
    <g>
      <rect
        style={{ transform: `translate(${x}px, ${y}px)` }}
        width={width}
        height={height}
        fill={fill ? rgbToHex(fill) : "#1e1e1e"}
        stroke={stroke ? rgbToHex(stroke) : "#1e1e1e"}
        opacity={opacity}
        strokeWidth={1}
        x={x}
        y={y}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
      ></rect>
    </g>
  );
}
