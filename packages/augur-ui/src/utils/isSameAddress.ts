export function isSameAddress(address1: string, address2: string) {
  if (!address1 || !address2) return false;
  return address1.toLowerCase() === address2.toLowerCase();
}
