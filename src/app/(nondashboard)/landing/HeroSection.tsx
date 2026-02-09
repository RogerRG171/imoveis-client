"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setFilters } from "@/state"

const HeroSection = () => {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState("")

  const router = useRouter()

  const handleLocationSearch = async () => {
    try {
      const trimmedQuery = searchQuery.trim()

      if (!trimmedQuery) return

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          trimmedQuery,
        )}&format=json&limit=1&addressdetails=1`,
        {
          headers: {
            "User-Agent": "MercadoImobiliario/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Geocoding request failed")
      }

      const data = await response.json()
      if (data && data.length > 0) {
        const result = data[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        dispatch(
          setFilters({
            location: trimmedQuery,
            coordinates: [lng, lat],
          }),
        )
        const params = new URLSearchParams({
          location: trimmedQuery,
          lat: lat.toString(),
          lng: lng.toString(),
        })
        router.push(`/search?${params.toString()}`)
      } else {
        console.warn("No location found at: ", trimmedQuery)
      }
    } catch (error) {
      console.error("Error search loaction: ", error)
    }
  }

  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        fill
        alt="hero landing image"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
      >
        <div className="flex flex-col gap-8 max-w-4xl mx-auto px-2 lg:px-16 sm:px-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="text-xl text-gray-300 bg-gray-900/40 rounded-lg mb-8 p-2">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!!!
          </p>
          <div className="flex  justify-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, neighborhood or address"
              className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12 "
            />
            <Button
              onClick={handleLocationSearch}
              className="bg-secondary-500 text-white rounded-none border-none rounded-r-xl h-12 hover:bg-secondary-600 "
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection
