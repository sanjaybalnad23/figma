"use client"
import React from 'react'
import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react";
import { hexToRbg } from "~/utils";
import Link from 'next/link';
import Image from 'next/image';
import { PiSidebarSimpleThin } from 'react-icons/pi';
import LayerButton from './LayerButton';

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
}

export default function Sidebars({ leftIsMinimized, setLeftIsMinimized }: { leftIsMinimized: boolean, setLeftIsMinimized: (value: boolean) => void }) {

    const me = useSelf()
    const otherUsers = useOthers()


    const selectedLayer = useSelf((me) => {
        const selection = me.presence.selection
        return selection.length === 1 ? selection[0] : null
    })

    const layer = useStorage((root) => {
        if (!selectedLayer) return null;
        return root.layers.get(selectedLayer)
    })

    const roomColor = useStorage((root) => root.roomColor)
    const layers = useStorage((root) => root.layers)
    const layerIds = useStorage((root) => root.layerIds)
    const reversedLayerIds = [...layerIds ?? []].reverse()
    const selection = useSelf((me) => me.presence.selection)

    const updateLayer = useMutation(({ storage, self }, updates: UpdateLayerType) => {
        if (!selectedLayer) return;
        const liveLayers = storage.get("layers")
        const layer = liveLayers.get(selectedLayer)
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
                ...(updates.fontFamily !== undefined && { fontFamily: updates.fontFamily })
            })
        }
    }, [selectedLayer])

    const updateSelection = useMutation(({ setMyPresence }, layerId: string) => {
        setMyPresence({ selection: [layerId] }, { addToHistory: true })
        // Focus on selectionbox
    }, [])


    return (
        <>
            {/* Left sidebar */}
            {!leftIsMinimized && (
                <div className='fixed left-0 flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white'>
                    <div className="p-4">
                        <div className="flex justify-between">
                            <Link href="/dashboard">
                                <Image
                                    src="/figma-icon.svg"
                                    alt="Logo"
                                    width={18}
                                    height={18}
                                    className='cursor-pointer'
                                />
                            </Link>
                            <PiSidebarSimpleThin onClick={() => setLeftIsMinimized(true)} className='size-5 cursor-pointer' />
                        </div>
                        <h2 className="mt-2 scroll-m-20 text-[13px] font-medium">Room Name</h2>
                    </div>
                    <div className="border-b border-gray-200" />
                    <div className="flex flex-col gap-1 p-4">
                        <span className="mb-2 text-[13px] font-medium">Layers</span>
                        {reversedLayerIds.map((id) => {
                            const layer = layers?.get(id)
                            const isSelected = selection?.includes(id)
                            return <LayerButton key={id} layer={layer} onClick={() => updateSelection(id)} isSelected={isSelected} />
                        })}
                    </div>
                </div>
            )}

            {/* Right sidebar */}
            {leftIsMinimized && (
                <div className='fixed left-3 top-3 h-[48px] w-[250px] flex items-center justify-between rounded-xl border bg-white p-4'>
                    <Link href="/dashboard">
                        <Image
                            src="/figma-icon.svg"
                            alt="Logo"
                            width={18}
                            height={18}
                            className='cursor-pointer'
                        />
                    </Link>
                    <h2 className='scroll-m-20 text-[13px] font-medium'>Room Name</h2>
                    <PiSidebarSimpleThin onClick={() => setLeftIsMinimized(false)} className='size-5 cursor-pointer' />
                </div>
            )}
        </>
    )
}
