import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
type RegionMap = Map<string, HttpTypes.StoreRegion | number>

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion | number>(),
  regionMapUpdated: Date.now(),
}

function setDefaultRegionFallback() {
  regionMapCache.regionMap = new Map([[DEFAULT_REGION, 1]])
  regionMapCache.regionMapUpdated = Date.now()

  return regionMapCache.regionMap
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
      return setDefaultRegionFallback()
    }

    try {
      // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        next: {
          revalidate: 3600,
          tags: ["regions"],
        },
      })

      if (!response.ok) {
        throw new Error(`Medusa returned ${response.status}`)
      }

      const contentType = response.headers.get("content-type")

      if (!contentType?.includes("application/json")) {
        throw new Error("Medusa returned a non-JSON response")
      }

      const { regions } = await response.json()

      if (!regions?.length) {
        return setDefaultRegionFallback()
      }

      regionMapCache.regionMap.clear()

      // Create a map of country codes to regions.
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      if (!regionMapCache.regionMap.size) {
        return setDefaultRegionFallback()
      }

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error(
        `proxy.ts: Failed to load regions from Medusa: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Falling back to ${DEFAULT_REGION}.`
      )

      return setDefaultRegionFallback()
    }
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: RegionMap
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "proxy.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Proxy to handle region selection and onboarding status.
 */
export async function proxy(request: NextRequest) {
  const regionMap = await getRegionMap()
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (urlHasCountryCode) {
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|images|robots.txt).*)",
  ],
}
