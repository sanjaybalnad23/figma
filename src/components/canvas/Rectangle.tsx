import type { RectangleLayer } from "~/types";
import { rgbToHex } from "~/utils";

export default function Rectangle({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) {
  const { cornerRadius, fill, height, opacity, stroke, type, width, x, y } = layer;
  return (
    <g className="group">
      {/* Hover border */}
      <rect
      style={{ transform: `translate(${x}px, ${y}px)` }}
      className="pointer-event-none opacity-0 group-hover:opacity-100"
      width={width}
      height={height}
      fill="none"
      stroke="#0b99ff"
      strokeWidth={4}
      ></rect>
      {/* Hover border */}
      <rect
        onPointerDown={e => onPointerDown(e, id)}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        width={width}
        height={height}
        fill={fill ? rgbToHex(fill) : "#1e1e1e"}
        stroke={stroke ? rgbToHex(stroke) : "#1e1e1e"}
        opacity={opacity}
        strokeWidth={1}
        // x={x}
        // y={y}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
      ></rect>
    </g>
  );
}
