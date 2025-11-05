"use client"

import { Authenticator } from "@aws-amplify/ui-react"
import type { ReactNode } from "react"
import StoreProvider from "@/state/redux"
import Auth from "./(auth)/authProvider"

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  )
}

export default Providers
