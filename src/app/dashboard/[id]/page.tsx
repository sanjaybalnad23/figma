import React from 'react'
import { auth } from '~/server/auth';

type ParamsType = Promise<{id:string}>

export default async function page({params}:{params:ParamsType}) {
    const {id} = await params;
    const session = await auth()
    //  Implementation pending
  return (
    <div>page</div>
  )
}
