// Will be polyfilled, alls good
import { getRandomValues, subtle } from 'node:crypto'

function getRandomInt(min: number, max: number) {
  // Create byte array and fill with 1 random number
  const byteArray = new Uint8Array(1)
  getRandomValues(byteArray)

  const range = max - min + 1
  const max_range = 256
  if (byteArray[0] >= Math.floor(max_range / range) * range)
    return getRandomInt(min, max)
  return min + (byteArray[0] % range)
}

export function createVfnToken() {
  return getRandomInt(0, 1000000).toString().padStart(6, '0')
}

export async function createTokenHash(token: string, email: string) {
  const message = `${token}:${email}`
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return hashHex
}

export async function compareHash(token: string, email: string, hash: string) {
  // Not too safe, but given the likelihood of attack in a random server somewhere... seems unlikely
  return hash === await createTokenHash(token, email)
  // return timingSafeEqual(
  //   Buffer.from(hash),
  //   Buffer.from(createTokenHash(token, email)),
  // )
}
