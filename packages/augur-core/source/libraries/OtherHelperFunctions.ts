import { TextEncoder } from "util";
import { Bytes32 } from "../";

export function stringTo32ByteHex(stringToEncode: string): Bytes32 {
// encode the string as a UTF-8 byte array
    const encoded = (new TextEncoder()).encode(stringToEncode);
// create a Bytes32 to put it in
    const padded = new Bytes32();
// make sure the string isn't too long after encoding
    if (encoded.length > 32) throw new Error(`${stringToEncode} is too long once encoded as UTF-8`);
// put the encoded bytes at the _beginning_ of the Bytes32 (BigEndian)
    padded.set(encoded, 0);

    return padded;
}
