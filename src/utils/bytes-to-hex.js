export function bytesToHex(byteArray) {
  return `0x${byteArray.reduce((hexString, byte) => hexString + byte.toString(16), '')}`
}
