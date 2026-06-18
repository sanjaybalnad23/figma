"use client";
import { useCanRedo, useCanUndo, useMutation, useMyPresence, useSelf, useStorage } from "@liveblocks/react";
import React, { useEffect, useState } from "react";
import {
  findIntersectionLayerWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
  rgbToHex,
} from "~/utils";
import LayerComponent from "./LayerComponent";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import {
  CanvasMode,
  LayerType,
  type TextLayer,
  type Camera,
  type CanvasState,
  type EllipseLayer,
  type Layer,
  type Point,
  type RectangleLayer,
  type XYWH,
  Side,
} from "~/types";
import ToolsBar from "../toolsbar/ToolsBar";
import Path from "./Path";
import SelectionBox from "./SelectionBox";
import { useHistory } from "@liveblocks/react";
import useDeleteLayers from "~/hooks/useDeleteLayers";
import SelectionTools from "./SelectionTools";
import Sidebars from "../sidebars/Sidebars";
import MultiplayerGuides from "./MultiplayerGuides";
import type { User } from "@prisma/client";

const MAX_LAYERS = 100;

export default function Canvas({
  othersWithAccessToRoom,
  roomId,
  roomName,
}: {
  roomName: string;
  roomId: string;
  othersWithAccessToRoom: User[];
}) {
  const roomColor = useStorage(root => root.roomColor);
  const layerIds = useStorage(root => root.layerIds);
  const [leftIsMinimized, setLeftIsMinimized] = useState(false);
  const [camera, setCamera] = useState<Camera>({ x: 100, y: 100, zoom: 1 });
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const pencilDraft = useSelf(me => me.presence.pencilDraft);
  const deleteLayers = useDeleteLayers();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onResizeHandlePointerDown = (corner: Side, initialBounds: XYWH) => {
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner,
    });
  };

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
        fill: { r: 128, g: 128, b: 128 },
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

    if (layerType === LayerType.Text) {
      layer = new LiveObject<TextLayer>({
        type: LayerType.Text,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        text: "dummy text",
        fontSize: 16,
        fill: { r: 217, g: 217, b: 217 },
        stroke: { r: 217, g: 217, b: 217 },
        opacity: 100,
        fontWeight: 400,
        fontFamily: "monospace",
      });
    }

    if (layer) {
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);
      console.log("Layer added to storage");
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    }
  }, []);

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point);

      // Update layers to set new width and height of the layer

      const liveLayers = storage.get("layers");

      if (self.presence.selection.length > 0) {
        const layer = liveLayers.get(self.presence.selection[0]!);
        if (layer) {
          layer.update(bounds);
        }
      }
    },
    [canvasState]
  );

  const selectAllLayers = useMutation(
    ({ storage, self, setMyPresence }) => {
      if (!layerIds?.length) return;
      setMyPresence({ selection: [...layerIds] }, { addToHistory: true });
    },
    [layerIds]
  );

  const unselectLayers = useMutation(
    ({ self, setMyPresence }) => {
      if (self.presence.selection.length > 0) {
        setMyPresence({ selection: [] }, { addToHistory: true });
      }
    },
    [canvasState]
  );

  const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: { r: 217, g: 217, b: 217 },
    });
  }, []);

  const continueDrawing = useMutation(
    ({ setMyPresence, self }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;
      if (canvasState.mode !== CanvasMode.Pencil || pencilDraft === null || e.buttons !== 1) {
        return;
      }
      setMyPresence(
        {
          cursor: point,
          pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]],
          // penColor:{r:34, g:32, b:46}
        },
        { addToHistory: true }
      );
    },
    [canvasState]
  );

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if (pencilDraft === null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, { r: 217, g: 217, b: 217 })));
      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);
      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [canvasState]
  );

  // set canvas state to selection net
  const startMultiSelection = (current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + (current.y - origin.y) > 5) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  };

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      if (layerIds) {
        const layers = storage.get("layers").toImmutable();
        setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
        const ids = findIntersectionLayerWithRectangle(layerIds, layers, origin, current);
        setMyPresence({ selection: ids }, { addToHistory: true });
      }
    },
    [canvasState]
  );

  useEffect(() => {
    // setTimeout(() => {
    //   // waiting to load storage
    //   console.log(LayerType.Rectangle);
    //   insertLayer(LayerType.Rectangle, { x: 200, y: 100 });
    // }, 3000);

    function handleKeyDown(e: KeyboardEvent) {
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
      if (isInput) {
        return;
      }

      switch (e.key) {
        case "Backspace":
          deleteLayers();
          break;

        case "z":
          if (e.ctrlKey || e.metaKey) {
            history.undo();
            console.log("undo");
          }
          break;

        case "y":
          if (e.ctrlKey || e.metaKey) {
            history.redo();
            console.log("redo");
          }
          break;

        case "a":
          if (e.ctrlKey || e.metaKey) {
            selectAllLayers();
          }
          break;

        default:
          break;
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteLayers]);

  const handlePointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.RightClick) {
        return;
      }
      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
        unselectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Dragging) {
        setCanvasState({ mode: CanvasMode.Dragging, origin: null });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
      history.resume();
    },
    [unselectLayers, canvasState, history]
  );

  const handleWheel = (e: React.WheelEvent) => {
    setCamera(camera => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
      zoom: camera.zoom,
    }));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.RightClick) {
      return;
    }

    if (canvasState.mode === CanvasMode.Dragging) {
      setCanvasState({ mode: CanvasMode.Dragging, origin: point });
      return;
    }

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure);
      return;
    }

    if (canvasState.mode === CanvasMode.Inserting) {
      return;
    }

    setCanvasState({ mode: CanvasMode.Pressing, origin: point });
  };

  const handlePointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(point, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(point, canvasState.origin);
        return;
      } else if (canvasState.mode === CanvasMode.Dragging && canvasState.origin !== null) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;

        setCamera(() => ({
          x: camera.x + deltaX,
          y: camera.y + deltaY,
          zoom: camera.zoom,
        }));
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(point, e);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(point);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(point);
      }
      setMyPresence({ cursor: point });
    },
    [canvasState, translateSelectedLayers, continueDrawing, resizeSelectedLayer, updateSelectionNet, camera]
  );

  const handleLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return;

      history.pause();
      e.stopPropagation();
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({
          selection: [layerId],
        });
      }

      if (e.nativeEvent.button === 2) {
        e.preventDefault();
        setCanvasState({ mode: CanvasMode.RightClick });
        return;
      }
      const point = pointerEventToCanvasPoint(e, camera);
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [camera, canvasState.mode, history]
  );

  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  return (
    <div className=" flex h-screen w-full select-none" onContextMenu={e => e.preventDefault()}>
      <main className="fixed left-0 right-0 h-screen w-full overflow-y-auto">
        <div
          className="h-full w-full touch-none"
          style={{ backgroundColor: roomColor ? rgbToHex(roomColor) : "royalblue" }}
        >
          <SelectionTools canvasState={canvasState} camera={camera} />
          <div style={{ position: "fixed", top: 0, color: "wheat" }}>Current canvas State:{canvasState.mode}</div>
          <svg
            style={{ userSelect: canvasState.mode === CanvasMode.Pencil ? "none" : "auto" }}
            onWheel={handleWheel}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="h-full w-full"
          >
            <g
              style={{
                transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
              }}
            >
              {layerIds?.map(layerId => (
                <LayerComponent onLayerPointerDown={handleLayerPointerDown} key={layerId} layerId={layerId} />
              ))}

              <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
              {canvasState.mode === CanvasMode.SelectionNet && canvasState.current && (
                <rect
                  className="fill-blue-600/5 stroke-blue-600 stroke-[0.5]"
                  x={Math.min(canvasState.current.x, canvasState.origin.x)}
                  y={Math.min(canvasState.current.y, canvasState.origin.y)}
                  width={Math.abs(canvasState.current.x - canvasState.origin.x)}
                  height={Math.abs(canvasState.current.y - canvasState.origin.y)}
                />
              )}
              <MultiplayerGuides />
              {pencilDraft !== null && pencilDraft.length > 0 && (
                <Path
                  x={0}
                  y={0}
                  stroke={{ r: 217, g: 217, b: 217 }}
                  fill={{ r: 217, g: 217, b: 217 }}
                  opacity={1}
                  points={pencilDraft}
                />
              )}
            </g>
          </svg>
        </div>
      </main>
      <ToolsBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        redo={() => history.redo()}
        undo={() => history.undo()}
        canRedo={canRedo}
        canUndo={canUndo}
        zoomIn={function () {
          setCamera(camera => ({ ...camera, zoom: camera.zoom + 0.1 }));
        }}
        canZoomIn={camera.zoom < 2}
        zoomOut={function () {
          setCamera(camera => ({ ...camera, zoom: camera.zoom - 0.1 }));
        }}
        canZoomOut={camera.zoom > 0.5}
      />
      <Sidebars
        roomName={roomName}
        roomId={roomId}
        othersWithAccessToRoom={othersWithAccessToRoom}
        leftIsMinimized={leftIsMinimized}
        setLeftIsMinimized={setLeftIsMinimized}
      />
    </div>
  );
}
