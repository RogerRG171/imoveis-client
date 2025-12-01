"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { NAVBAR_HEIGHT } from "@/lib/constants"
import { cleanParams } from "@/lib/utils"
import { setFilters } from "@/state"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import FiltersBar from "./FiltersBar"
import FiltersFull from "./FiltersFull"
import Listings from "./Listings"
import MapComponent from "./Map"

const SearchPage = () => {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <no need>
  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)))
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number)
        } else {
          acc[key] = value === "any" ? null : value
        }

        return acc
      },
      {},
    )

    const cleanedFilters = cleanParams(initialFilters)
    dispatch(setFilters(cleanedFilters))
  }, [])

  return (
    <div
      className="w-full mx-auto px-5 flex flex-col"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />
      <div className="flex flex-col md:flex-row justify-between flex-1 overflow-visible md:overflow-hidden gap-3 mb-5">
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "relative w-[100%] md:w-3/12 lg:w-2/12 md:block opacity-100 visible"
              : "w-0 opacity-0 invisible"
          }`}
        >
          <FiltersFull />
        </div>
        <MapComponent />
        <div className="md:basis-4/12 overflow-y-visible md:overflow-y-auto scrollbar-hide">
          <Listings />
        </div>
      </div>
    </div>
  )
}

export default SearchPage
