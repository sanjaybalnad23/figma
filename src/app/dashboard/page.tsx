"use client"
import React from 'react'
import { signout } from 'src/app/actions/auth.action'

export default function Page() {
  return (
    <div>
        <h2>dashboard</h2>
        <button onClick={signout}>Signout</button>
    </div>
  )
}
