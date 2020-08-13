import BigNumber from 'bignumber.js';

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN,
});

export const version = '2.1.4';
export * from './constants';
export { unrollArray } from './unroll-array';
export { byteArrayToUtf8String } from './byte-array-to-utf8-string';
export { byteArrayToHexString } from './byte-array-to-hex-string';
export {
  abiEncodeShortStringAsInt256,
} from './abi-encode-short-string-as-int256';
export {
  abiDecodeShortStringAsInt256,
} from './abi-decode-short-string-as-int256';
export { abiEncodeBytes } from './abi-encode-bytes';
export { abiDecodeBytes } from './abi-decode-bytes';
export { unfork } from './unfork';
export { isHex } from './is-hex';
export { formatInt256 } from './format-int256';
export { formatEthereumAddress } from './format-ethereum-address';
export { strip0xPrefix } from './strip-0x-prefix';
export { prefixHex } from './hex';
export { bignum } from './bignum';
export { fix } from './fix';
export { unfix } from './unfix';
export { unfixSigned } from './unfix-signed';
export { encodeNumberAsBase10String } from './encode-number-as-base10-string';
export { encodeNumberAsJSNumber } from './encode-number-as-js-number';
export { padRight } from './pad-right';
export { padLeft } from './pad-left';
export { abiEncodeInt256 } from './abi-encode-int256';
export { abiEncodeData } from './abi-encode-data';
export { abiEncodeTransactionPayload } from './abi-encode-transaction-payload';
export { abiDecodeData } from './abi-decode-data';
export { abiDecodeRpcResponse } from './abi-decode-rpc-response';
export {
  formatAbiRawDecodedDataArray,
} from './format-abi-raw-decoded-data-array';
export { formatAbiRawDecodedData } from './format-abi-raw-decoded-data';
export { chunkRange } from './generators';
export { serialize } from './serialize';
export * from './hex';
export * from './logger';
export * from './repeat';
export * from './configuration';
export * from './conversions';
export * from './gasStation';
export * from './extract-ipfs-url';
