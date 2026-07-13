import { resolve4 } from "node:dns/promises"
import { request } from "node:https"
import { checkServerIdentity } from "node:tls"

const hosts =
  process.argv.length > 2
    ? process.argv.slice(2)
    : ["techhubcanada.com", "www.techhubcanada.com"]

const verificationPath =
  "/.well-known/apple-developer-merchantid-domain-association"
const expectedVerificationFileBytes = 9098

const fetchVerificationFile = (host, address) =>
  new Promise((resolve, reject) => {
    const req = request(
      {
        checkServerIdentity: (_servername, cert) =>
          checkServerIdentity(host, cert),
        headers: {
          host,
        },
        host: address ?? host,
        method: "GET",
        path: verificationPath,
        servername: host,
        timeout: 10000,
      },
      (res) => {
        const chunks = []

        res.on("data", (chunk) => {
          chunks.push(chunk)
        })

        res.on("end", () => {
          resolve({
            bytes: Buffer.concat(chunks).length,
            location: res.headers.location,
            statusCode: res.statusCode,
          })
        })
      }
    )

    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy(new Error(`Timed out checking ${host}`))
    })
    req.end()
  })

const resolveHostAddresses = async (host) => {
  const addresses = await resolve4(host).catch(() => [])
  return addresses.length ? [...new Set(addresses)] : [undefined]
}

for (const host of hosts) {
  const addresses = await resolveHostAddresses(host)

  for (const address of addresses) {
    const label = address ? `${host} (${address})` : host
    const result = await fetchVerificationFile(host, address).catch(
      (error) => ({
        error: error.message,
      })
    )

    if (result.error) {
      throw new Error(`${label}: ${result.error}`)
    }

    if (result.statusCode !== 200) {
      throw new Error(
        `${label}: expected 200 for ${verificationPath}, got ${
          result.statusCode
        }${result.location ? ` redirecting to ${result.location}` : ""}`
      )
    }

    if (result.bytes !== expectedVerificationFileBytes) {
      throw new Error(
        `${label}: expected ${expectedVerificationFileBytes} bytes for ${verificationPath}, got ${result.bytes}`
      )
    }

    console.log(
      `${label}: Apple Pay verification file OK (${result.bytes} bytes)`
    )
  }
}
