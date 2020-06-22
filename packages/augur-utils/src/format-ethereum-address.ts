import { prefixHex } from "./hex";
import { strip0xPrefix } from "./strip-0x-prefix";

export function formatEthereumAddress(addr) {
  if (addr == null) return addr;
  if (Array.isArray(addr)) {
    for (let i = 0, n = addr.length; i < n; ++i) {
      addr[i] = formatEthereumAddress(addr[i]);
    }
    return addr;
  }
  if (addr && addr.constructor === String) {
    addr = strip0xPrefix(addr);
    while (addr.length > 40 && addr.slice(0, 1) === "0") {
      addr = addr.slice(1);
    }
    while (addr.length < 40) {
      addr = "0" + addr;
    }
    return prefixHex(addr);
  }
}


