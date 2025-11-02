"use client";
import { useMutation, useStorage } from "@liveblocks/react";
import React, { useEffect, useState } from "react";
import { pointerEventToCanvasPoint, rgbToHex } from "~/utils";
import LayerComponent from "./LayerComponent";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { CanvasMode, LayerType, type Camera, type CanvasState, type EllipseLayer, type Layer, type Point, type RectangleLayer } from "~/types";
import ToolsBar from "../toolsbar/ToolsBar";

const MAX_LAYERS = 100;

export default function Canvas() {
  const roomColor = useStorage(root => root.roomColor);
  const layerIds = useStorage(root => root.layerIds);
  const [camera, setCamera] = useState<Camera>({ x: 100, y: 100, zoom: 1 });
  const [canvasState, setCanvasState] = useState<CanvasState>({mode:CanvasMode.None});


  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      let layer: LiveObject<Layer> | null = null;

      if (layerType === LayerType.Rectangle) {
        layer = new LiveObject<RectangleLayer>({
          type: LayerType.Rectangle,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
          cornerRadius: 0,
        });
      }

      if (layerType === LayerType.Ellipse) {
        layer = new LiveObject<EllipseLayer>({
          type: LayerType.Ellipse,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,   
        });
      }

      if (layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);
        console.log("Layer added to storage");
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
    },
    []
  );

  useEffect(() => {
    setTimeout(() => {
      // waiting to load storage
      console.log(LayerType.Rectangle);
      insertLayer(LayerType.Rectangle, { x: 200, y: 100 });
    }, 3000);
  }, []);

  const handlePointerUp = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);
    console.log("HHHHHH");
    insertLayer(LayerType.Ellipse, point);
  };

  return (
    <div className=" flex h-screen w-full">
      <main className="fixed left-0 right-0 h-screen w-full overflow-y-auto">
        <div
          className="h-full w-full touch-none"
          style={{ backgroundColor: roomColor ? rgbToHex(roomColor) : "royalblue" }}
        >
          <svg onPointerUp={handlePointerUp} className="h-full w-full">
            <g>
              {layerIds?.map(layerId => (
                <LayerComponent key={layerId} layerId={layerId} />
              ))}
            </g>
          </svg>
        </div>
      </main>
      <ToolsBar canvasState={canvasState} setCanvasState={setCanvasState}/>
    </div>
  );
}
