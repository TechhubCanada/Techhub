"use server"
import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async function () {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next: { tags: ["regions"] },
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const listRegionsSafe = async function () {
  try {
    return await listRegions()
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `Failed to list regions: ${
          error instanceof Error ? error.message : "Unknown error"
        }.`
      )
    }
    return []
  }
}

export const retrieveRegion = async function (id: string) {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: { tags: [`regions`] },
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

export const listRegionCountryCodes = async function () {
  const regions = await listRegionsSafe()

  return regions.flatMap((region) =>
    region.countries
      ? region.countries
          .map((country) => country.iso_2)
          .filter(
            (value): value is string =>
              typeof value === "string" && Boolean(value)
          )
      : []
  )
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async function (countryCode: string) {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null
  }
}
