import  { useEffect, useRef, useState } from "react";
import  { BiPointer } from "react-icons/bi";
import { GoTriangleUp } from "react-icons/go";
import  { RiHand } from "react-icons/ri";
import { LayerType,  CanvasMode, type CanvasState } from "~/types";
import IconButton from "./IconButton";
import { IoEllipseOutline, IoSquareOutline } from "react-icons/io5";

export default function ShapesSelectionButton({
  isActive,
  canvasState,
  onClick,
}: {
  isActive: boolean;
  canvasState: CanvasState;
  onClick: (layerType: LayerType) => void;
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
  }, []);

  const handleClick = (layerType: LayerType) => {
    onClick(layerType);
    setIsOpen(false);
  };

  return (
    <div className="relative flex" ref={menuRef}>
      <IconButton isActive={isActive} onClick={() => onClick(LayerType.Rectangle)}>
        {canvasState.mode !== CanvasMode.Inserting && <IoSquareOutline className="size-5"/>}

        {canvasState.mode === CanvasMode.Inserting &&  (canvasState.layerType === LayerType.Rectangle || canvasState.layerType === LayerType.Text) &&( <IoSquareOutline className="size-5"/>)}

        {canvasState.mode === CanvasMode.Inserting && canvasState.layerType=== LayerType.Ellipse &&( <IoEllipseOutline className="size-5"/>)}
      </IconButton>

      <button onClick={() => setIsOpen(!isOpen)} className="ml-1 rotate-180">
        <GoTriangleUp />
      </button>

      {isOpen && (
        <div className="absolute -top-20 mt-1 min-w-[150px] bg-[#1e1e1e] p-2 shadow-lg">
          {/* Rectangle */}
          <button
            className={`${canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle? "bg-blue-500" : ""} flex w-full items-center rounded-md p-1 text-white hover:bg-blue-300`}
            onClick={() => handleClick(LayerType.Rectangle)}
          >
            <span className="w-5 text-xs">{canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle && "✔"}</span>
            <IoSquareOutline className="mr-2 h-4 w-4" />
            <span className="text-xs">Rectangle</span>
          </button>

          {/* Ellipse */}
          <button
            className={`${canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse ? "bg-blue-500" : ""} flex w-full items-center rounded-md p-1 text-white hover:bg-blue-300`}
            onClick={() => handleClick(LayerType.Ellipse)}
          >
            <span className="w-5 text-xs">{canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse&& "✔"}</span>
            <IoEllipseOutline className="mr-2 h-4 w-4" />
            <span className="text-xs">Ellipse</span>
          </button>
        </div>
      )}
    </div>
  );
}
