// Taken directly from geth's source: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2288
// Modified for linting + import only
import { ethers } from "ethers";
/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {string} address the given HEX adress
 * @return {Boolean}
 */
export default function isAddress(address) {
  // make sure the address passed has `0x` to start it.
  const formattedAddress = `0x${address.replace("0x", "")}`;
  if (!/^(0x)?[0-9a-f]{40}$/i.test(formattedAddress)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(formattedAddress) ||
    /^(0x)?[0-9A-F]{40}$/.test(formattedAddress)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  }

  // Otherwise check each case
  return isChecksumAddress(formattedAddress);
}

// TODO: need to remove try catch, need better way to check if address is valid
function isChecksumAddress(address) {
  let isValid = false;
  try {
    ethers.utils.getAddress(address);
    isValid = true;
  } catch (err) {
    isValid = false;
  }
  return isValid;
}
