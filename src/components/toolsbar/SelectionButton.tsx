"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasMode } from "~/types";
import IconButton from "./IconButton";
import { BiPointer } from "react-icons/bi";
import { RiHand } from "react-icons/ri";
import { GoTriangleUp } from "react-icons/go";

export default function SelectionButton({
  isActive,
  canvasMode,
  onClick,
}: {
  isActive: boolean;
  canvasMode: CanvasMode;
  onClick: (canvasMode: CanvasMode.None | CanvasMode.Dragging) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[]);

  const handleClick = (canvasMode: CanvasMode.None | CanvasMode.Dragging) => {
    onClick(canvasMode);
    setIsOpen(false);
  };
  


  return (
    <div className="relative flex" ref={menuRef}>
      <IconButton isActive={isActive} onClick={() => onClick(CanvasMode.None)}>
        {canvasMode === CanvasMode.None || !canvasMode && (<BiPointer className="size-5" />)}
        {canvasMode === CanvasMode.Dragging && <RiHand className="size-5" />}
        {canvasMode === CanvasMode.None && <BiPointer className="size-5" />}
        {canvasMode === CanvasMode.Inserting && <BiPointer className="size-5" />}
      </IconButton>
      <button onClick={() => setIsOpen(!isOpen)} className="ml-1 rotate-180">
        <GoTriangleUp />
      </button>
      {isOpen && (
        <div className="absolute -top-20 mt-1 min-w-[150px] bg-[#1e1e1e] p-2 shadow-lg">
          <button
            className={`${canvasMode === CanvasMode.None ? "bg-blue-500" : ""} flex w-full items-center rounded-md p-1 text-white hover:bg-blue-300`}
            onClick={() => handleClick(CanvasMode.None)}
          >
            <span className="w-5 text-xs">{canvasMode === CanvasMode.None && "✔"}</span>
            <BiPointer className="mr-2 h-4 w-4" />
            <span className="text-xs">Move</span>
          </button>

          <button
            className={`${canvasMode === CanvasMode.Dragging ? "bg-blue-500" : ""} flex w-full items-center rounded-md p-1 text-white hover:bg-blue-300`}
            onClick={() => handleClick(CanvasMode.Dragging)}
          >
            <span className="w-5 text-xs">{canvasMode === CanvasMode.Dragging && "✔"}</span>
            <RiHand className="mr-2 h-4 w-4" />
            <span className="text-xs">Hand tool</span>
          </button>
        </div>
      )}
    </div>
  );
}
