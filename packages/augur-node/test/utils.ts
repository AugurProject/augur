import { formatInt256 } from "speedomatic";

export function hashEventSignature(eventName) {
  return formatInt256(keccak256(Buffer.from(eventName, "utf8")).toString("hex"));
}
