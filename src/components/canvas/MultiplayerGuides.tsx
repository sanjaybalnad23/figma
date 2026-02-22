import { shallow, useOthersConnectionIds, useOthersMapped } from '@liveblocks/react'
import React from 'react'
import Cursor from './Cursor'
import Path from './Path'
import { rgbToHex } from '~/utils'


function Cursors() {
    const ids = useOthersConnectionIds()
    return (
        <>
            {ids.map(id => (<Cursor key={id} connectionId={id} />))}
        </>
    )
}

function Draft() {
    const others = useOthersMapped(other => ({ pencilDraft: other.presence.pencilDraft, penColor: other.presence.penColor }), shallow)

    return <>
        {others.map(([key, other]) => {
            if (other.pencilDraft) {
                return <Path key={key} x={0} y={0} points={other.pencilDraft} fill={other.penColor ?? undefined} opacity={104} />
            }
            return null
        })}
    </>
}

export default function MultiplayerGuides() {
    return (
        <>
            <Cursors />
            <Draft />
        </>
    )
}
