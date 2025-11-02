"use client"

import { useRef, useState } from "react"
import { CanvasMode } from "~/types"
import IconButton from "./IconButton"
import { BiPointer } from "react-icons/bi"

export default function SelectionButton({isActive, canvasMode, onClick}: {
    isActive:boolean,
    canvasMode:CanvasMode,
    onClick:(canvasMode:CanvasMode.None)=>void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex" ref={menuRef}>
        <IconButton isActive={isActive} onClick={()=>onClick(CanvasMode.None)}>
            {canvasMode === CanvasMode.None && <BiPointer className="h-5 w-5"/>}
        </IconButton>
    </div>
  )
}
