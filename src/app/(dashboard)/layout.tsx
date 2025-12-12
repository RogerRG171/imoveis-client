"use client"

import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import Sidedbar from "@/components/AppSidebar"
import Navbar from "@/components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { NAVBAR_HEIGHT } from "@/lib/constants"
import { useGetAuthUserQuery } from "@/state/api"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery()

  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole.toLowerCase()
      if (
        (userRole === "manager" && pathname.startsWith("/tenants")) ||
        (userRole === "tenant" && pathname.startsWith("/managers"))
      )
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/tenants/favorites",
          { scroll: false },
        )
    } else {
      setIsLoading(false)
    }
  }, [authUser, router, pathname])

  if (authLoading && isLoading) return <>Loading...</>
  if (!authUser?.userRole) return null

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />
        <div
          style={{
            marginTop: `${NAVBAR_HEIGHT}px`,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
          className="overflow-y-auto"
        >
          <main className="flex h-full">
            <Sidedbar userType={authUser?.userRole.toLowerCase()} />
            <div className="flex-grow transition-all duration-300 overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
