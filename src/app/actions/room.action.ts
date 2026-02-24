"use server"

import { redirect } from "next/navigation"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export async function createRoom() {
    const session = await auth()

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const room = await db.room.create({
        data: {
            ownerId: session.user.id,
        }
        , select: {
            id: true
        }
    })

    redirect(`/dashboard/${room.id}`)
}