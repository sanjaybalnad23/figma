"use client";

import React from "react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";

export default function Room({ children, roomId }: { children: React.ReactNode; roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ selection: [], cursor: null, penColor: null, pencilDraft: null }}
        initialStorage={{
          roomColor: { r: 30, g: 30, b: 30 },
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
        }}
      >
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
