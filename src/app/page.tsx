'use client'
import Link from 'next/link'
import '@/app/home.css'

const page = () => {
  return (
    <main className="grid min-h-screen place-content-center place-items-center overflow-hidden bg-gradient-to-b from-slate-900 to-black">
  
  <Link href="/character" id="main_container" 
  className="relative grid place-content-center place-items-center gap-2 before:bg-gradient-to-t before:from-teal-500/70 before:via-fuchsia-600 before:to-transparent before:blur-xl before:filter">
    <h1 className="title text-6xl font-black text-teal-500">Character</h1>
    <h2 className="cursive text-6xl font-thin text-fuchsia-600">Collections</h2>
  </Link>
</main>
  )
}

export default page