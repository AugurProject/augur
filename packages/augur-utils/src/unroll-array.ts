import { encodeNumberAsBase10String } from "./encode-number-as-base10-string";
import { prefixHex } from "./hex";
import { unfixSigned } from "./unfix-signed";

// Unroll an abi-encoded string into an array
export function unrollArray(string, returns, stride, init) {
  if (string && string.length >= 66) {
    stride = stride || 64;
    let elements = Math.ceil((string.length - 2) / stride);
    let array = new Array(elements);
    let position = init || 2;
    for (let i = 0; i < elements; ++i) {
      array[i] = prefixHex(string.slice(position, position + stride));
      position += stride;
    }
    if (array.length) {
      if (parseInt(array[1], 16) === array.length - 2 || parseInt(array[1], 16) / 32 === array.length - 2) {
        array.splice(0, 2);
      }
    }
    for (let i = 0; i < array.length; ++i) {
      if (returns === "number[]") {
        array[i] = encodeNumberAsBase10String(array[i]);
      } else if (returns === "unfix[]") {
        array[i] = unfixSigned(array[i], "string");
      }
    }
    return array;
  }
  return string;
}
