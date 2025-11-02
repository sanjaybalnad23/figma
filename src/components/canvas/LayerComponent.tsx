"use client"
// memo the component
import { useStorage } from "@liveblocks/react"
import Rectangle from "./Rectangle";
import { LayerType } from "~/types";
import Ellipse from "./Ellipse";



export default function LayerComponent({layerId}:{layerId:string}) {
    const layer = useStorage(root=>root.layers.get(layerId))
    if(!layer) return null;

    switch(layer.type){
        case LayerType.Rectangle:
            return <Rectangle id={layerId} layer={layer}/>

        case LayerType.Ellipse:
          return <Ellipse id={layerId} layer={layer} />

        default:
            return null
    }
    
  return (
    <g>
        <rect x={0} y={0} width={200} height={200} fill="green"/>
    </g>
  )
}
