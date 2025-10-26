import { Liveblocks } from "@liveblocks/node"
import { auth } from "~/server/auth"
import { db } from "~/server/db";
const liveblocks = new Liveblocks({secret:""})

export async function POST(req:Request){
    const userSession = await auth();
    const user = await db.user.findUniqueOrThrow({
        where:{id:userSession?.user.id}
    })

    const session = liveblocks.prepareSession(user.id, {
        userInfo:{
            name:user.name ?? "Anonymous"+Math.random()+Date.now()
        }
    })
    session.allow(`room:${"testing"}`, session.FULL_ACCESS)

    const {status, body} = await session.authorize()

    return new Response(body, {status})
}