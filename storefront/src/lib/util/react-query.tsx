"use client"

import * as React from "react"
import { isServer } from "@tanstack/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const makeQueryClient = () => new QueryClient()

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

export const ReactQueryProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const withReactQueryProvider = <T extends {}>(
  Component: React.FC<T>
) => {
  const WrappedComponent = (props: T) => (
    <ReactQueryProvider>
      <Component {...props} />
    </ReactQueryProvider>
  )

  WrappedComponent.displayName = `withReactQueryProvider(${Component.displayName || Component.name || "Component"})`

  return WrappedComponent
}
