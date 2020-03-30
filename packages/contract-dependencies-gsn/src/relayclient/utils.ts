import * as ethUtils from 'ethereumjs-util';
import * as web3Utils from 'web3-utils';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';

const relayHubAbi = require('./IRelayHub');
const relayRecipientAbi = require('./IRelayRecipient');

const abiDecoder = require('abi-decoder');
abiDecoder.addABI(relayHubAbi);

const RELAY_PREFIX = 'rlx:';

export function toUint256_noPrefix(int: number): string {
  const hexString = new BigNumber(int).toString(16);
  const paddedHexString = hexString.padStart(64, "0")
  return paddedHexString;
}

export function removeHexPrefix(hex: string): string {
  return hex.replace(/^0x/, '');
}

export const zeroPad = '0000000000000000000000000000000000000000000000000000000000000000';

export function padTo64(hex: string): string {
  if (hex.length < 64) {
    hex = (zeroPad + hex).slice(-64);
  }
  return hex;
}

export function bytesToHex_noPrefix(bytes: string | number): string {
  let hex = removeHexPrefix(web3Utils.toHex(bytes));
  if (hex.length % 2 != 0) {
    hex = '0' + hex;
  }
  return hex;
}

export function getTransactionHash(from: string, to: string, tx: string, txfee: number, gas_price: number, gas_limit: number, nonce: number, relay_hub_address: string, relay_address: string): string {
  let txhstr = bytesToHex_noPrefix(tx);
  let dataToHash =
    Buffer.from(RELAY_PREFIX).toString('hex') +
    removeHexPrefix(from) +
    removeHexPrefix(to) +
    txhstr +
    toUint256_noPrefix(txfee) +
    toUint256_noPrefix(gas_price) +
    toUint256_noPrefix(gas_limit) +
    toUint256_noPrefix(nonce) +
    removeHexPrefix(relay_hub_address) +
    removeHexPrefix(relay_address);
  return web3Utils.sha3('0x' + dataToHash);
}

export function getEcRecoverMeta(message: string, signature: string): string {
  const sig = ethers.utils.splitSignature(signature);

  const msg = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32'),
    Buffer.from(removeHexPrefix(message), 'hex'),
  ]);
  const signed = web3Utils.sha3('0x' + msg.toString('hex'));
  const buf_signed = Buffer.from(removeHexPrefix(signed), 'hex');
  const signer = ethUtils.bufferToHex(
    ethUtils.pubToAddress(ethUtils.ecrecover(buf_signed, sig.v, Buffer.from(removeHexPrefix(sig.r), "hex"), Buffer.from(removeHexPrefix(sig.s), "hex"))),
  );
  return signer;
}

export function parseHexString(str: string): number[] {
  const result: number[] = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
}

export function appendAddress(data, address) {
  return data + ethUtils.setLengthLeft(ethUtils.toBuffer(address), 32).toString('hex');
}

export function callAsJsonRpc(fn, args, id, callback, mapResponseFn = x => ({ result: x })) {
  const response = { jsonrpc: '2.0', id };
  try {
    fn(...args)
      .then(result => {
        callback(null, { ...response, ...mapResponseFn(result) });
      })
      .catch(err => {
        callback({ ...response, error: err.toString() }, null);
      });
  } catch (err) {
    callback({ ...response, error: err.toString() });
  }
}

export function toInt(value) {
  return new BigNumber(value).toNumber();
}

export function preconditionCodeToDescription(code) {
  switch (parseInt(code)) {
    case 1:
      return 'wrong signature';
    case 2:
      return 'wrong nonce';
    case 3:
      return 'recipient reverted in acceptRelayedCall';
    case 4:
      return 'invalid status code returned by the recipient';
    default:
      return `error ${code}`;
  }
}

export function fixTransactionReceiptResponse(resp, debug = false) {
  if (!resp || !resp.result || !resp.result.logs) return resp;

  const logs = abiDecoder.decodeLogs(resp.result.logs);
  const canRelayFailed = logs.find(e => e && e.name == 'CanRelayFailed');
  const transactionRelayed = logs.find(e => e && e.name == 'TransactionRelayed');

  const setErrorStatus = reason => {
    if (debug) console.log(`Setting tx receipt status to zero while fetching tx receipt (${reason})`);
    resp.result.status = 0;
  };

  if (canRelayFailed) {
    setErrorStatus(`canRelay failed with ${canRelayFailed.events.find(e => e.name == 'reason').value}`);
  } else if (transactionRelayed) {
    const status = transactionRelayed.events.find(e => e.name == 'status').value;
    if (parseInt(status) !== 0) {
      // 0 signifies success
      setErrorStatus(`reverted relayed transaction with status code ${status}`);
    }
  }

  return resp;
}

export async function createRelayHubFromRecipient(provider, recipientAddress) {
  const relayRecipient = createRelayRecipient(provider, recipientAddress);
  let relayHubAddress;
  try {
    relayHubAddress = await relayRecipient.getHubAddr();
  } catch (err) {
    throw new Error(
      `Could not get relay hub address from recipient at ${recipientAddress} (${err.message}). Make sure it is a valid recipient contract.`,
    );
  }

  if (!relayHubAddress || ethUtils.isZeroAddress(relayHubAddress)) {
    throw new Error(
      `The relay hub address is set to zero in recipient at ${recipientAddress}. Make sure it is a valid recipient contract.`,
    );
  }

  const code = await provider.getCode(relayHubAddress);
  if (code.length <= 2) {
    throw new Error(`Relay hub is not deployed at address ${relayHubAddress}`);
  }

  const relayHub = createRelayHub(provider, relayHubAddress);
  let hubVersion;
  try {
    hubVersion = await relayHub.version();
  } catch (err) {
    throw new Error(
      `Could not query relay hub version at ${relayHubAddress} (${err.message}). Make sure the address corresponds to a relay hub.`,
    );
  }

  if (!hubVersion.startsWith('1')) {
    throw new Error(`Unsupported relay hub version '${hubVersion}'.`);
  }

  return relayHub;
}

export function createRelayRecipient(provider, addr) {
  return new ethers.Contract(addr, relayRecipientAbi, provider);
}

export function createRelayHub(provider, addr) {
  return new ethers.Contract(addr, relayHubAbi, provider);
}
