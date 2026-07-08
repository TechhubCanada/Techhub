import type { QueryClient } from "@tanstack/react-query"
import type { RealtimeEvent } from "./types"

export const applyRealtimeEvent = async (
  queryClient: QueryClient,
  event: RealtimeEvent
) => {
  if (event.entity === "product" || event.entity === "inventory") {
    await Promise.all([
      queryClient.invalidateQueries({ exact: false, queryKey: ["products"] }),
      queryClient.invalidateQueries({ exact: false, queryKey: ["product"] }),
    ])
    return
  }

  if (event.entity === "collection") {
    await Promise.all([
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["collections"],
      }),
      queryClient.invalidateQueries({ exact: false, queryKey: ["products"] }),
    ])
    return
  }

  if (event.entity === "category") {
    await Promise.all([
      queryClient.invalidateQueries({ exact: false, queryKey: ["categories"] }),
      queryClient.invalidateQueries({ exact: false, queryKey: ["products"] }),
    ])
    return
  }

  if (event.entity === "product_type") {
    await Promise.all([
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["product-types"],
      }),
      queryClient.invalidateQueries({ exact: false, queryKey: ["products"] }),
    ])
  }
}
