"use client";
import { useMutation, useSelf, useStorage } from "@liveblocks/react";
import React, { useEffect, useState } from "react";
import { penPointsToPathLayer, pointerEventToCanvasPoint, rgbToHex } from "~/utils";
import LayerComponent from "./LayerComponent";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import {
  CanvasMode,
  LayerType,
  type Camera,
  type CanvasState,
  type EllipseLayer,
  type Layer,
  type Point,
  type RectangleLayer,
} from "~/types";
import ToolsBar from "../toolsbar/ToolsBar";
import Path from "./Path";

const MAX_LAYERS = 100;

export default function Canvas() {
  const roomColor = useStorage(root => root.roomColor);
  const layerIds = useStorage(root => root.layerIds);
  const [camera, setCamera] = useState<Camera>({ x: 100, y: 100, zoom: 1 });
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const pencilDraft = useSelf((me)=>me.presence.pencilDraft)


  const insertLayer = useMutation(({ storage, setMyPresence }, layerType: LayerType, position: Point) => {
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
  }, []);

  const startDrawing = useMutation(({setMyPresence}, point:Point, pressure:number)=>{
    setMyPresence({
      pencilDraft:[[point.x, point.y, pressure]],
      penColor:{r:34, g:32, b:46}
    })
  },[])

  const continueDrawing = useMutation(({setMyPresence, self}, point:Point, e:React.PointerEvent)=>{
    const {pencilDraft} = self.presence
    if(canvasState.mode !== CanvasMode.Pencil || pencilDraft === null || e.buttons !== 1){
      return
    }
    setMyPresence({
      pencilDraft:[...pencilDraft,[point.x, point.y, e.pressure]],
      // penColor:{r:34, g:32, b:46}
    })
  },[])

  const insertPath = useMutation(({storage, self, setMyPresence})=>{
    const liveLayers = storage.get("layers")
    const {pencilDraft} = self.presence

    if(pencilDraft === null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS){
      setMyPresence({pencilDraft:null})
      return;
    }

    const id = nanoid()
    liveLayers.set(
      id,
      new LiveObject(
        penPointsToPathLayer(pencilDraft, {r:217, g:217, b:217})
      )
    )
    const liveLayerIds = storage.get("layerIds")
    liveLayerIds.push(id)
    setMyPresence({pencilDraft:null})
    setCanvasState({mode:CanvasMode.Pencil})
  },[])

  useEffect(() => {
    setTimeout(() => {
      // waiting to load storage
      console.log(LayerType.Rectangle);
      insertLayer(LayerType.Rectangle, { x: 200, y: 100 });
    }, 3000);
  }, []);

  const handlePointerUp = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);
    if (canvasState.mode === CanvasMode.None) {
      setCanvasState({ mode: CanvasMode.None });
    } else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    }
    else if(canvasState.mode === CanvasMode.Dragging){
      setCanvasState({mode:CanvasMode.Dragging, origin:null})
    }
    else if(canvasState.mode === CanvasMode.Pencil){
      insertPath();
    }
  };

  const handleWheel = (e:React.WheelEvent)=>{
    setCamera((camera)=>({
      x:camera.x - e.deltaX,
      y:camera.y - e.deltaY,
      zoom:camera.zoom
    }))
  }

  // TODO
  const handlePointerDown = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);
    if (canvasState.mode === CanvasMode.Dragging) {
      setCanvasState({ mode: CanvasMode.Dragging, origin:point });
      return
    }

    if(canvasState.mode === CanvasMode.Pencil){
      startDrawing(point, e.pressure)
    }
  };


  const handlePointerMove = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);
    if (canvasState.mode === CanvasMode.Dragging && canvasState.origin !== null) {
      const deltaX = e.movementX;
      const deltaY = e.movementY;

      setCamera(()=>({
        x:camera.x + deltaX,
        y:camera.y + deltaY,
        zoom:camera.zoom
      }))
    }
    else if(canvasState.mode === CanvasMode.Pencil){
        continueDrawing(point,e)
    }
  };



  return (
    <div className=" flex h-screen w-full">
      <main className="fixed left-0 right-0 h-screen w-full overflow-y-auto">
        <div
          className="h-full w-full touch-none"
          style={{ backgroundColor: roomColor ? rgbToHex(roomColor) : "royalblue" }}
        >
          <svg
           onWheel={handleWheel} 
           onPointerUp={handlePointerUp}
           onPointerDown={handlePointerDown}
           onPointerMove={handlePointerMove}
            className="h-full w-full">
            <g
              style={{
                transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
              }}
            >
              {layerIds?.map(layerId => (
                <LayerComponent key={layerId} layerId={layerId} />
              ))}

              {pencilDraft !== null && pencilDraft.length > 0 && <Path x={0} y={0} stroke={{r:217, g:217, b:217}} fill={{r:217, g:217, b:217}} opacity={1} points={pencilDraft} />}
            </g>
          </svg>
        </div>
      </main>
      <ToolsBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        zoomIn={function () {
          setCamera(camera => ({ ...camera, zoom: camera.zoom + 0.1 }));
        }}
        canZoomIn={camera.zoom < 2}
        zoomOut={function () {
          setCamera(camera => ({ ...camera, zoom: camera.zoom - 0.1 }));
        }}
        canZoomOut={camera.zoom > 0.5}
      />
    </div>
  );
}
