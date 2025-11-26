"use client"
import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { useGetPropertiesQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for missing marker icons in Next.js/Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Component to handle map center updates when filters change
function MapController({
  center,
  zoom,
}: {
  center: [number, number]
  zoom: number
}) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])

  return null
}

const MapComponent = () => {
  const { filters } = useAppSelector((state) => state.global)
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters)

  // Default center coordinates (longitude, latitude) - matching your original [-74.5, 40]
  // Leaflet expects [latitude, longitude], so we need to reverse them
  const defaultCenter: [number, number] = filters.coordinates
    ? [filters.coordinates[1], filters.coordinates[0]] // Convert [lng, lat] to [lat, lng]
    : [40, -74.5] // Default: [lat, lng] for NYC area
  const zoom = 9

  // Show loading or error state
  if (isLoading || isError || !properties) {
    return (
      <div className="md:basis-5/12 md:grow relative rounded-xl">
        <div
          className="map-container rounded-xl bg-gray-200 flex items-center justify-center"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {isLoading ? "Loading map..." : "Error loading map"}
        </div>
      </div>
    )
  }

  return (
    <div className="md:basis-5/12 md:grow h-[640px] relative rounded-xl md:z-10">
      <MapContainer
        className="h-[640px] md:h-screen"
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

        {/* Render markers for each property */}
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[
              property.location.coordinates.latitude,
              property.location.coordinates.longitude,
            ]}
          >
            <Popup>
              <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-gray-300 to-black/60 text-white p-4 m-0  rounded-md">
                <div className="w-10 h-10 object-cover bg-white rounded-lg"></div>
                <div>
                  <a
                    href={`/search/${property.id}`}
                    target="_blank"
                    className="cursor-pointer focus:outline-none hover:underline !text-blue-700 font-bold"
                  >
                    {property.name}
                  </a>
                  <p className="text-sm font-semibold text-green-700">
                    ${property.pricePerMonth}
                    <span className="text-sm text-primary-700 font-normal">
                      {" "}
                      / month
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapComponent
