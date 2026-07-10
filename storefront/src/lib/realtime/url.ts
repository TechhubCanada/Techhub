export const getRealtimeUrl = () => {
  const params = new URLSearchParams()

  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    params.set(
      "publishable_key",
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    )
  }

  const query = params.toString()

  return `/medusa/store/realtime${query ? `?${query}` : ""}`
}
