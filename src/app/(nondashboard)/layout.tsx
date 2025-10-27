import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import { NAVBAR_HEIGHT } from "@/lib/constants"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className={`h-full w-full flex flex-col pt-[${NAVBAR_HEIGHT}px]`}>
        {children}
      </main>
    </div>
  )
}

export default Layout
