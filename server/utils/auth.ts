// Will be polyfilled, alls good
import { getRandomValues } from 'node:crypto'
import { scrypt } from '@noble/hashes/scrypt'

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

export function createTokenHash(token: string, email: string) {
  return scrypt(token, email, { N: 2 ** 16, r: 8, p: 1, dkLen: 32 }).toString()
}

export function compareHash(token: string, email: string, hash: string) {
  // Not too safe, but given the likelihood of attack in a random server somewhere... seems unlikely
  return hash === createTokenHash(token, email)
  // return timingSafeEqual(
  //   Buffer.from(hash),
  //   Buffer.from(createTokenHash(token, email)),
  // )
}
