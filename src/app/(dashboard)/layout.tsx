"use client"

import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import Sidedbar from "@/components/AppSidebar"
import Navbar from "@/components/Navbar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { NAVBAR_HEIGHT } from "@/lib/constants"
import { useGetAuthUserQuery } from "@/state/api"

const DashboardContent = ({ children }: { children: ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery()
  const { open } = useSidebar()
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

  if (authLoading || isLoading) return <>Loading...</>
  if (!authUser?.userRole) return null

  return (
    <div className="min-h-screen w-full bg-primary-100">
      <Navbar />
      <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
        <main className="flex">
          <Sidedbar userType={authUser?.userRole.toLowerCase()} />
          <div
            className="flex-grow transition-all duration-300"
            style={{
              marginLeft: open ? "12rem" : "4rem",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}

export default DashboardLayout
