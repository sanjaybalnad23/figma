import { useSelf, useStorage } from "@liveblocks/react";
import { useEffect, useRef, useState } from "react";
import { LayerType } from "~/types";

const PADDING = 16;
const HANDLE_WIDTH = 10;

export default function SelectionBox() {
  const soleLayerId = useSelf(me => (me.presence.selection.length === 1 ? me.presence.selection[0] : null));
  const isShowingHandles = useStorage(root => soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path);
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  const layers = useStorage(root => root.layers);
  const layer = soleLayerId ? layers?.get(soleLayerId) : null;

  useEffect(() => {
    if (!textRef.current) return;

    const bbox = textRef.current.getBBox();
    setTextWidth(bbox.width);
  }, [layer]);

  if (!layer) return null;
  return (
    <>
      <rect
        className="pointer-events-none fill-transparent stroke-[royalblue] stroke-[1px]"
        style={{ transform: `translate(${layer.x}px, ${layer.y}px)` }}
        width={layer?.width}
        height={layer?.height}
      />
      <rect
        width={textWidth + PADDING}
        className="fill-[royalblue]"
        x={layer.x + layer.width / 2 - (textWidth + PADDING) / 2}
        y={layer.y + layer.height + 10}
        height={20}
        rx={4}
      />
      <text
        ref={textRef}
        style={{ transform: `translate(${layer.x + layer.width / 2}px, ${layer.y + layer.height + 25}px)` }}
        className="pointer-events-none fill-white text-[11px]"
        textAnchor="middle"
      >
        {Math.round(layer.width)} x {Math.round(layer.height)}
      </text>
      {isShowingHandles && (
        <>
          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${layer.x - HANDLE_WIDTH / 2}px, ${layer.y - HANDLE_WIDTH / 2}px)` }}
          />
          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{
              transform: `translate(${layer.x + layer.width / 2 - HANDLE_WIDTH / 2}px, ${layer.y - HANDLE_WIDTH / 2}px)`,
            }}
          />
          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{
              transform: `translate(${layer.x + layer.width - HANDLE_WIDTH / 2}px, ${layer.y - HANDLE_WIDTH / 2}px)`,
            }}
          />

          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${layer.x - HANDLE_WIDTH / 2}px, ${layer.y +layer.height / 2 - HANDLE_WIDTH / 2}px)` }}
          />

          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${layer.x - HANDLE_WIDTH / 2}px, ${layer.y +layer.height - HANDLE_WIDTH / 2}px)` }}
          />


          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${layer.x +layer.width- HANDLE_WIDTH / 2}px, ${layer.y +layer.height / 2 - HANDLE_WIDTH / 2}px)` }}
          />

          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${layer.x +layer.width- HANDLE_WIDTH / 2}px, ${layer.y +layer.height - HANDLE_WIDTH / 2}px)` }}
          />

          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${layer.x +layer.width / 2- HANDLE_WIDTH / 2}px, ${layer.y +layer.height - HANDLE_WIDTH / 2}px)` }}
          />
        </>
      )}
    </>
  );
}
