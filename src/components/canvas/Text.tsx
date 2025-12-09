import { useMutation } from "@liveblocks/react";
import React, { useEffect, useRef, useState } from "react";
import type { TextLayer } from "~/types";
import { rgbToHex } from "~/utils";

export default function Text({ id, layer }: { id: string; layer: TextLayer }) {
  const { fill, height, opacity, stroke,  width, x, y, fontFamily, fontSize, fontWeight, text } = layer;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setInputValue(e.target.value)
  }

  const handleBlur = ()=>{
    setIsEditing(false)
    updateText(inputValue)
  }

  const handleDoubleClick = (e:React.MouseEvent)=>{
    setIsEditing(true)
  }

  const updateText = useMutation(({storage}, newText:string)=>{
    const liveLayers = storage.get("layers")
    const layer = liveLayers.get(id)

    if(layer){
      layer.update({text:newText})
    }
  },[id])

  useEffect(()=>{
    if(isEditing && inputRef.current){
      inputRef.current.focus()
    }
  },[isEditing])

const handleKeydown = (e:React.KeyboardEvent)=>{
    if(e.key !== "Enter") return;
    
    setIsEditing(false)
    updateText(inputValue)
    
  }
  return (
    <g onDoubleClick={handleDoubleClick}>
        {isEditing ? 
        <foreignObject x={x} y={y} width={width} height={height}>
            <input type="text" value={inputValue} placeholder="Enter text"
            style={{
                fontSize:fontSize+"px",
                color:rgbToHex(fill),
                background:"transparent",
                width:"100%",
                border:"none",
                // outline:"none"
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeydown}
            onChange={handleChange}
            />
        </foreignObject>
        :
        <text
          x={x}
          y={y + fontSize}
          height={height}
          width={width}
          opacity={`${opacity}%`}
          stroke={rgbToHex(stroke)}
          fill={rgbToHex(fill)}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
        >{text}</text> 
        }

    </g>
  );
}
