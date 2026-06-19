"use client";
import { useMutation, useSelf } from "@liveblocks/react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { useSelectionBounds } from "~/hooks/useSelectionBounds";
import { CanvasMode, type Camera, type CanvasState } from "~/types";

export default function SelectionTools({ camera, canvasState }: { camera: Camera; canvasState: CanvasState }) {
  const selectionBounds = useSelectionBounds();

  const selection = useSelf(me => me.presence.selection);

  const bringToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];

      const arr = liveLayerIds.toArray();

      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        if (element !== undefined && selection?.includes(element)) {
          indices.push(i);
        }
      }

      for (let i = indices.length - 1; i >= 0; i--) {
        const element = indices[i];
        if (element !== undefined) {
          liveLayerIds.move(element, liveLayerIds.length - 1 - (indices.length - 1 - i));
        }
      }
    },
    [selection]
  );

  const sendToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];

      const arr = liveLayerIds.toArray();

      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        if (element !== undefined && selection?.includes(element)) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        const element = indices[i];
        if (element !== undefined) {
          liveLayerIds.move(element, i);
        }
      }
    },
    [selection]
  );

  if (!selectionBounds || canvasState.mode !== CanvasMode.RightClick) return null;

  const x = (selectionBounds.width / 2 + selectionBounds.x) * camera.zoom + camera.x;
  const y = selectionBounds.y * camera.zoom + camera.y;
  return (
    <div
      style={{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 100%))` }}
      className="absolute flex min-w[150px] flex-col rounded-xl bg-[#1e1e1e] p-2 shadow-lg"
    >
      <button
        onClick={bringToFront}
        className="flex w-full items-center justify-between rounded-md px-1 py-1 text-white hover:bg-blue-500"
      >
        <span className="text-xs">Bring to front</span>
        <BsArrowDown className="size-4 mr-2" />
      </button>
      <button
        onClick={sendToFront}
        className="flex w-full items-center justify-between rounded-md px-1 py-1 text-white hover:bg-blue-500"
      >
        <span className="text-xs">Send to back</span>
        <BsArrowUp className="size-4 mr-2" />
      </button>
    </div>
  );
}
