"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { useGetAuthUserQuery } from "@/state/api"
import PropertyLocation from "../PropertyLocation"
import ApplicationModal from "./ApplicationModal"
import ImagePreviews from "./ImagePreviews"
import PropertyDetails from "./PropertyDetails"
import PropertyOverview from "./PropertyOverview"

const SingleListing = () => {
  const { id } = useParams()
  const propertyId = Number(id)
  const { data: authUser } = useGetAuthUserQuery()

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <ImagePreviews
        images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
      />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview
            propertyId={propertyId}
            setIsModalOpen={setIsModalOpen}
          />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>
        <div className="order-1 md:order-2"></div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  )
}

export default SingleListing
