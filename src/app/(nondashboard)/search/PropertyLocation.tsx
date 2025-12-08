import { Compass, MapPin } from "lucide-react"
import { useEffect } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useGetPropertyQuery } from "@/state/api"
import { MapController } from "./Map"

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const { data: property, isLoading, isError } = useGetPropertyQuery(propertyId)

  useEffect(() => {
    if (isLoading || isError || !property) return
  }, [isLoading, isError, property])

  if (isLoading) return <>Loading...</>
  if (isError || !property) return <>Property not Found</>

  const defaultCenter: [number, number] = [
    property.location!.coordinates.latitude,
    property.location!.coordinates.longitude,
  ]
  const zoom = 14

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-800">
        Map Location
      </h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            `${property.location?.address} ${property.location?.city} ${property.location?.state}` ||
              "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      <div className="relative mt-4 h-[380px] rounded-lg overflow-hidden">
        <MapContainer
          className="h-[380px]"
          center={defaultCenter}
          zoom={zoom}
          style={{ width: "100%", borderRadius: "0.75rem" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={defaultCenter} zoom={zoom} />
          <Marker
            key={property.id}
            position={[
              property.location!.coordinates.latitude,
              property.location!.coordinates.longitude,
            ]}
          />
        </MapContainer>
      </div>
    </div>
  )
}

export default PropertyLocation
