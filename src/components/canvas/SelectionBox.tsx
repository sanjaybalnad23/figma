import { useSelf, useStorage } from "@liveblocks/react";
import { useEffect, useRef, useState } from "react";
import { useSelectionBounds } from "~/hooks/useSelectionBounds";
import { LayerType, Side, type XYWH } from "~/types";

const PADDING = 16;
const HANDLE_WIDTH = 10;

export default function SelectionBox({onResizeHandlePointerDown}:{onResizeHandlePointerDown:(corner:Side, initialBuild:XYWH)=>void}) {
  const soleLayerId = useSelf(me => (me.presence.selection.length === 1 ? me.presence.selection[0] : null));
  const isShowingHandles = useStorage(root => soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path);
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const bounds = useSelectionBounds()

  

  useEffect(() => {
    if (!textRef.current) return;

    const bbox = textRef.current.getBBox();
    setTextWidth(bbox.width);
  }, [bounds]);

  if (!bounds) return null;
  return (
    <>
      <rect
        className="pointer-events-none fill-transparent stroke-[royalblue] stroke-[1px]"
        style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
        width={bounds.width}
        height={bounds.height}
      />
      <rect
        width={textWidth + PADDING}
        className="fill-[royalblue]"
        x={bounds.x + bounds.width / 2 - (textWidth + PADDING) / 2}
        y={bounds.y + bounds.height + 10}
        height={20}
        rx={4}
      />
      <text
        ref={textRef}
        style={{ transform: `translate(${bounds.x + bounds.width / 2}px, ${bounds.y + bounds.height + 25}px)` }}
        className="pointer-events-none fill-white text-[11px]"
        textAnchor="middle"
      >
        {Math.round(bounds.width)} x {Math.round(bounds.height)}
      </text>
      {isShowingHandles && (
        <>
          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)` }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Top + Side.Left, bounds)
            }}
          />
          <rect
            cursor={"ns-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Top, bounds)
            }}
          />
          <rect
            cursor={"nesw-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Top + Side.Right, bounds)
            }}
          />

          <rect
            cursor={"ew-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y +bounds.height / 2 - HANDLE_WIDTH / 2}px)` }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Left, bounds)
            }}
          />

          <rect
            cursor={"nesw-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y +bounds.height - HANDLE_WIDTH / 2}px)` }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds)
            }}
          />


          <rect
            cursor={"ew-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${bounds.x +bounds.width- HANDLE_WIDTH / 2}px, ${bounds.y +bounds.height / 2 - HANDLE_WIDTH / 2}px)` }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Right, bounds)
            }}
          />

          <rect
            cursor={"nwse-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${bounds.x +bounds.width- HANDLE_WIDTH / 2}px, ${bounds.y +bounds.height - HANDLE_WIDTH / 2}px)` }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds)
            }}
          />

          <rect
            cursor={"ns-resize"}
            className="fill-white stroke-[royalblue] stroke-[1px]"
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ transform: `translate(${bounds.x +bounds.width / 2- HANDLE_WIDTH / 2}px, ${bounds.y +bounds.height - HANDLE_WIDTH / 2}px)` }}
            onPointerDown={(e)=>{
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Bottom, bounds)
            }}
          />
        </>
      )}
    </>
  );
}
