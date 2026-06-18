"use client";
import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react";
import { connectionIdToColor, hexToRbg, rgbToHex } from "~/utils";
import Link from "next/link";
import Image from "next/image";
import { PiSidebarSimpleThin } from "react-icons/pi";
import LayerButton from "./LayerButton";
import NumberInput from "./NumberInput";
import { LayerType } from "~/types";
import { BsCircleHalf } from "react-icons/bs";
import { RiRoundedCorner } from "react-icons/ri";
import ColorPicker from "./ColorPicker";
import Dropdown from "./Dropdown";
import UserAvatar from "./UserAvatar";
import type { User } from "@prisma/client";

type UpdateLayerType = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  cornerRadius?: number;
  fill?: string;
  stroke?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
};

export default function Sidebars({
  roomName,
  roomId,
  othersWithAccessToRoom,
  leftIsMinimized,
  setLeftIsMinimized,
}: {
  roomName: string;
  roomId: string;
  othersWithAccessToRoom: User[];
  leftIsMinimized: boolean;
  setLeftIsMinimized: (value: boolean) => void;
}) {
  const FONTS = [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Lucida Sans Unicode",
    "Palatino Linotype",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "monospace",
    "sans-serif",
    "serif",
    "Inter",
  ];
  const FONT_WEIGHTS = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
  const me = useSelf();
  const others = useOthers();

  const selectedLayer = useSelf(me => {
    const selection = me.presence.selection;
    return selection.length === 1 ? selection[0] : null;
  });

  const layer = useStorage(root => {
    if (!selectedLayer) return null;
    return root.layers.get(selectedLayer);
  });

  const roomColor = useStorage(root => root.roomColor);
  const layers = useStorage(root => root.layers);
  const layerIds = useStorage(root => root.layerIds);
  const reversedLayerIds = [...(layerIds ?? [])].reverse();
  const selection = useSelf(me => me.presence.selection);

  const setRoomColor = useMutation(({ storage, self }, newColor: string) => {
    storage.set("roomColor", hexToRbg(newColor));
  }, []);

  const updateLayer = useMutation(
    ({ storage, self }, updates: UpdateLayerType) => {
      if (!selectedLayer) return;
      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(selectedLayer);
      if (layer) {
        layer.update({
          ...(updates.x !== undefined && { x: updates.x }),
          ...(updates.y !== undefined && { y: updates.y }),
          ...(updates.width !== undefined && { width: updates.width }),
          ...(updates.height !== undefined && { height: updates.height }),
          ...(updates.opacity !== undefined && { opacity: updates.opacity }),
          ...(updates.cornerRadius !== undefined && { cornerRadius: updates.cornerRadius }),
          ...(updates.fill !== undefined && { fill: hexToRbg(updates.fill) }),
          ...(updates.stroke !== undefined && { stroke: hexToRbg(updates.stroke) }),
          ...(updates.fontSize !== undefined && { fontSize: updates.fontSize }),
          ...(updates.fontWeight !== undefined && { fontWeight: updates.fontWeight }),
          ...(updates.fontFamily !== undefined && { fontFamily: updates.fontFamily }),
        });
      }
    },
    [selectedLayer]
  );

  const updateSelection = useMutation(({ setMyPresence }, layerId: string) => {
    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    // Focus on selectionbox
  }, []);

  return (
    <>
      {/* Left sidebar */}
      {!leftIsMinimized && (
        <div className="fixed left-0 flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white">
          <div className="p-4">
            <div className="flex justify-between">
              <Link href="/dashboard">
                <Image src="/figma-icon.svg" alt="Logo" width={18} height={18} className="cursor-pointer" />
              </Link>
              <PiSidebarSimpleThin onClick={() => setLeftIsMinimized(true)} className="size-5 cursor-pointer" />
            </div>
            <h2 className="mt-2 scroll-m-20 text-[13px] font-medium">{roomName}</h2>
          </div>
          <div className="border-b border-gray-200" />
          <div className="flex flex-col gap-1 p-4">
            <span className="mb-2 text-[13px] font-medium">Layers</span>
            {reversedLayerIds.map(id => {
              const layer = layers?.get(id);
              const isSelected = selection?.includes(id);
              return <LayerButton key={id} layer={layer} onClick={() => updateSelection(id)} isSelected={isSelected} />;
            })}
          </div>
        </div>
      )}

      {/* Right sidebar */}
      {leftIsMinimized && (
        <div className="fixed left-3 top-3 h-[48px] w-[250px] flex items-center justify-between rounded-xl border bg-white p-4">
          <Link href="/dashboard">
            <Image src="/figma-icon.svg" alt="Logo" width={18} height={18} className="cursor-pointer" />
          </Link>
          <h2 className="scroll-m-20 text-[13px] font-medium">{roomName}</h2>
          <PiSidebarSimpleThin onClick={() => setLeftIsMinimized(false)} className="size-5 cursor-pointer" />
        </div>
      )}

      {(!leftIsMinimized || layer) && (
        <div
          className={`fixed ${leftIsMinimized && layer ? "bottom-3 right-3 top-3 rounded-xl" : ""} ${!leftIsMinimized && !layer ? "h-screen" : ""} ${!leftIsMinimized && layer ? "bottom-0 top-0 h-screen" : ""} right-0 flex w-[240px] flex-col border-l border-gray-200 bg-white`}
        >
          <div className="flex items-center justify-between pr-2 ">
            <div className="max-36 flex w-full gap-2 overflow-x-scroll p-3 text-xs">
              {me && <UserAvatar color={connectionIdToColor(me.connectionId)} name={me.info.name} />}

              {others &&
                others.map(other => (
                  <UserAvatar
                    key={other.connectionId}
                    color={connectionIdToColor(other.connectionId)}
                    name={other.info.name}
                  />
                ))}
            </div>

            <p>Share button</p>
          </div>
          <div className="border-b border-gray-200"></div>
          {layer ? (
            <>
              <div className="flex flex-col gap-1 p-4">
                <span className="mb-2 text-[11px] font-medium">Position</span>
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] font-medium text-gray-500">Position</p>
                </div>
                <div className="flex w-full gap-2">
                  <NumberInput
                    value={layer.x}
                    className="w-1/2"
                    onChange={value => updateLayer({ x: value })}
                    icon={<p>X</p>}
                  />
                  <NumberInput
                    value={layer.y}
                    className="w-1/2"
                    onChange={value => updateLayer({ y: value })}
                    icon={<p>Y</p>}
                  />
                </div>
              </div>
              {layer.type !== LayerType.Path && (
                <>
                  <div className="border-b border-gray-200"></div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="mb-2 text-[11px] font-medium">Layout</span>
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-medium text-gray-500">Dimensions</p>
                    </div>
                    <div className="flex w-full gap-2">
                      <NumberInput
                        value={layer.width}
                        className="w-1/2"
                        onChange={value => updateLayer({ width: value })}
                        icon={<p>W</p>}
                      />
                      <NumberInput
                        value={layer.height}
                        className="w-1/2"
                        onChange={value => updateLayer({ height: value })}
                        icon={<p>H</p>}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="border-b border-gray-200"></div>
              <div className="flex flex-col gap-2 p-4">
                <span className="mb-2 text-[11px] font-medium">Appearance</span>
                <div className="flex w-full gap-2">
                  <div className="flex w-1/2 flex-col gap-1">
                    <p className="text-[9px] font-medium text-gray-500">Opacity</p>
                    <NumberInput
                      value={layer.opacity}
                      min={0}
                      max={100}
                      onChange={number => {
                        updateLayer({ opacity: number });
                      }}
                      className="w-full"
                      icon={<BsCircleHalf />}
                    />
                  </div>
                  {layer.type === LayerType.Rectangle && (
                    <div className="flex w-1/2 flex-col gap-1">
                      <p className="text-[9px] font-medium text-gray-500">Corner radius</p>
                      <NumberInput
                        value={layer.cornerRadius ?? 0}
                        min={0}
                        max={100}
                        onChange={number => {
                          updateLayer({ cornerRadius: number });
                        }}
                        className="w-full"
                        icon={<RiRoundedCorner />}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200" />
              <div className="flex flex-col gap-2 p-4">
                <span className="mb-2 text-[11px] font-medium text-gray-500">Fill</span>
                <ColorPicker
                  onChange={color => {
                    updateLayer({ fill: color });
                  }}
                  value={rgbToHex(layer.fill)}
                />
              </div>

              <div className="border-b border-gray-200" />
              <div className="flex flex-col gap-2 p-4">
                <span className="mb-2 text-[11px] font-medium text-gray-500">Stroke</span>
                <ColorPicker
                  onChange={color => {
                    updateLayer({ stroke: color });
                  }}
                  value={rgbToHex(layer.stroke)}
                />
              </div>

              {layer.type === LayerType.Text && (
                <>
                  <div className="border-b border-gray-200" />
                  <div className="flex flex-col gap-2 p-4">
                    <span className="mb-2 text-[11px] font-medium text-gray-500">Typography</span>
                    <Dropdown
                      value={layer.fontFamily}
                      onChange={value => updateLayer({ fontFamily: value })}
                      options={FONTS}
                    />

                    <div className="flex w-full gap-2">
                      <div className="flex w-full flex-col gap-1">
                        <p className="text-[9px] font-medium text-gray-500">Size</p>
                        <NumberInput
                          icon={<p>W</p>}
                          value={layer.fontSize}
                          onChange={value => updateLayer({ fontSize: value })}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-1">
                        <p className="text-[9px] font-medium text-gray-500">Size</p>
                        <Dropdown
                          value={layer.fontWeight.toString()}
                          onChange={value => updateLayer({ fontWeight: Number(value) })}
                          options={FONT_WEIGHTS}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              <span className="mb-2 text-[11px] font-medium text-gray-500">Page</span>
              <ColorPicker
                onChange={color => {
                  setRoomColor(color);
                }}
                value={roomColor ? rgbToHex(roomColor) : "#ffffff"}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
