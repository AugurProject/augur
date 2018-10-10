// import isAddress from "modules/auth/helpers/is-address";

export default function formatAddress(address) {
  // if (!isAddress(address)) return address;
  // 0x3b583BC3f9Dc1A0310c54E93B2D3Bb70Db9a4216 this address didn't pass check
  // todo: verify is-address

  return `${address.slice(0, 6)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
}
