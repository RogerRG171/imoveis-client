"use client"

import { Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api"

const ContentWidget = ({ onOpenModal, propertyId }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery()
  const { data: property, isLoading, isError } = useGetPropertyQuery(propertyId)

  const router = useRouter()

  const handleButtonClick = () => {
    if (authUser) {
      onOpenModal()
    } else {
      router.push("/signin")
    }
  }

  if (isLoading) return <>Loading...</>
  if (isError || !property || !property.manager) return <>Property not Found</>
  return (
    <div className="flex-1 bg-white border border-primary-200 rounded-2xl p-7 h-fit min-w-[300px]">
      <div className="flex items-center justify-center gap-5  mb-4 border border-primary-200 p-4 rounded-xl">
        <div className="flex items-center p-4 bg-primary-900 rounded-full">
          <Phone className="text-primary-50" size={15} />
        </div>
        <div>
          <p>Contact This Property</p>
          <div className="text-lg font-bold text-primary-800">
            {property.manager.phoneNumber}
          </div>
        </div>
      </div>
      <Button
        className="w-full bg-primary-700 text-white hover:bg-primary-600"
        onClick={handleButtonClick}
      >
        {authUser ? "Submit Application" : "Sign In to Apply"}
      </Button>
      <hr className="my-4" />
      <div className="text-sm">
        <div className="text-primary-600 mb-1">
          <span className="font-semibold">Language:</span> English
        </div>
        <div className="text-primary-600">
          <span className="font-semibold">Open by appointment on:</span> Monday
          - Sunday
        </div>
      </div>
    </div>
  )
}

export default ContentWidget
