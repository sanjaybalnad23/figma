"use client";
import { CanvasMode, LayerType, type CanvasState } from "~/types";
import SelectionButton from "./SelectionButton";
import ShapesSelectionButton from "./ShapesSelectionButton";

export default function ToolsBar({
  canvasState,
  setCanvasState,
}: {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-1 shadow-[0_0_3px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-center gap-3">
        <SelectionButton
          canvasMode={canvasState.mode}
          isActive={canvasState.mode === CanvasMode.None}
          onClick={canvasMode =>
            setCanvasState(
              canvasMode === CanvasMode.Dragging ? { mode: canvasMode, origin: null } : { mode: canvasMode }
            )
          }
        />
        <ShapesSelectionButton isActive={canvasState.mode === CanvasMode.Inserting && [LayerType.Rectangle, LayerType.Ellipse].includes(canvasState.layerType)}
        canvasState={canvasState}
        onClick={(layerType)=>setCanvasState({mode:CanvasMode.Inserting, layerType})}
        />
      </div>
    </div>
  );
}
