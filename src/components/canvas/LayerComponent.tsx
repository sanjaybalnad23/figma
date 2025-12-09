"use client";
// memo the component
import { useStorage } from "@liveblocks/react";
import Rectangle from "./Rectangle";
import { LayerType } from "~/types";
import Ellipse from "./Ellipse";
import Path from "./Path";
import Text from "./Text";

export default function LayerComponent({ layerId }: { layerId: string, onLayerPointerDown:(e: React.PointerEvent, layerId: string)=>void }) {
  const layer = useStorage(root => root.layers.get(layerId));
  if (!layer) return null;

  switch (layer.type) {
    case LayerType.Path:
      return <Path opacity={layer.opacity} points={layer.points} x={layer.x} y={layer.y} fill={layer.fill} stroke={layer.stroke} />

    case LayerType.Rectangle:
      return <Rectangle id={layerId} layer={layer} />;

    case LayerType.Ellipse:
      return <Ellipse id={layerId} layer={layer} />;

    case LayerType.Text:
      return <Text id={layerId} layer={layer}/>

    default:
      return null;
  }

  return (
    <g>
      <rect x={0} y={0} width={200} height={200} fill="green" />
    </g>
  );
}
