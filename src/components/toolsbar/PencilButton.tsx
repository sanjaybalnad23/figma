import React from 'react'
import IconButton from './IconButton'
import { TiPencil } from "react-icons/ti";

export default function PencilButton({isActive, onClick}:{isActive:boolean, onClick:()=>void}) {
  return (
    <IconButton isActive={isActive} onClick={onClick}>
        <TiPencil color="#888888" size={22} />
    </IconButton>
  )
}
