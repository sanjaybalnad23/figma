"use client";

import React from "react";
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import type { Layer } from "~/types";

export default function Room({ children, roomId }: { children: React.ReactNode; roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ selection: [], cursor: null, penColor: null, pencilDraft: null }}
        initialStorage={{
          roomColor: { r: 30, g: 30, b: 30 },
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
        }}
        
      >
        <ClientSideSuspense
          fallback={
            <div className="h-screen flex justify-center items-center">
              <img className="animate-bounce size-[50px]" src="/favicon.ico" alt="Logo" />
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
