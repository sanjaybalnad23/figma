"use client";
import { IoEllipseOutline, IoSquareOutline, IoTextOutline } from 'react-icons/io5'
import { PiPathDuotone } from 'react-icons/pi'
import { type Layer, LayerType } from '~/types'

export default function LayerButton({ layer, onClick, isSelected }: { layer?: Layer, onClick?: () => void, isSelected?: boolean }) {
    if (!layer) return null
    return (
        <button onClick={() => onClick && onClick()} className={`flex items-center gap-2 rounded px-1.5 py-1 text-left text-[11px] hover:bg-gray-100 ${isSelected ? "bg-[#bce3ff]" : ""}`}>
            {layer.type === LayerType.Rectangle && <IoSquareOutline className='text-gray-500 size-5' />}
            {layer.type === LayerType.Path && <PiPathDuotone className='text-gray-500 size-5' />}
            {layer.type === LayerType.Text && <IoTextOutline className='text-gray-500 size-5' />}
            {layer.type === LayerType.Ellipse && <IoEllipseOutline className='text-gray-500 size-5' />}
            <span>
                {layer.type === LayerType.Rectangle && "Rectangle"}
                {layer.type === LayerType.Path && "Path"}
                {layer.type === LayerType.Text && layer.text}
                {layer.type === LayerType.Ellipse && "Ellipse"}
            </span>
        </button>
    )
}
