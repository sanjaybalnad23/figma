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
    <g>
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
