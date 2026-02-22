import { useOther } from "@liveblocks/react"
import { connectionIdToColor } from "../../utils";

export default function Cursor({ connectionId }: { connectionId: number }) {
    const cursor = useOther(connectionId, (other) => other.presence.cursor)
    if (cursor === null) return null
    return (
        <path
            style={{
                transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
            }}
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill={connectionIdToColor(connectionId)}
        />
    );
}