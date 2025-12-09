import type { EllipseLayer } from "~/types";
import { rgbToHex } from "~/utils";

export default function Ellipse({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) {
  const { fill, height, opacity, stroke, width, x, y } = layer;
  return (
    <g>
      <ellipse
        onPointerDown={e => onPointerDown(e, id)}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        width={width}
        height={height}
        fill={fill ? rgbToHex(fill) : "#1e1e1e"}
        stroke={stroke ? rgbToHex(stroke) : "#1e1e1e"}
        opacity={opacity ?? 1}
        strokeWidth={1}
        cx={width / 2}
        cy={height / 2}
        rx={height}
        ry={width}
      ></ellipse>
    </g>
  );
}
