import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import { NAVBAR_HEIGHT } from "@/lib/constants"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`h-full w-full flex flex-col `}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  )
}

export default Layout
