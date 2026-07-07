export const getDefaultCountryCode = function () {
  return process.env.NEXT_PUBLIC_DEFAULT_REGION || "ca"
}

export const getStaticCountryCodes = function () {
  return [getDefaultCountryCode()]
}
