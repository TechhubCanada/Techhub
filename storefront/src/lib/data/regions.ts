"use server"
import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async function () {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next: { tags: ["regions"] },
      cache: "no-store",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const listRegionsSafe = async function () {
  try {
    return await listRegions()
  } catch {
    return []
  }
}

export const retrieveRegion = async function (id: string) {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: { tags: [`regions`] },
      cache: "no-store",
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

export const getRegion = async function (countryCode: string) {
  try {
    const regions = await listRegions()

    if (!regions) {
      return null
    }

    const regionMap = new Map<string, HttpTypes.StoreRegion>()

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
