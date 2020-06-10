import readline from 'readline';
import { ContractAPI } from '..';
import { RLP, keccak256 } from 'ethers/utils';

export function waitForSigint(): Promise<void> {
  process.removeAllListeners('SIGINT');
  process.removeAllListeners('SIGTERM');
  process.removeAllListeners('SIGHUP');

  process.stdin.resume();
  return new Promise((resolve) => {
    process.prependListener('SIGINT', () => {
      resolve();
    });
    process.prependListener('SIGTERM', () => {
      resolve();
    });
    process.prependListener('SIGHUP', () => {
      resolve();
    });
  });
}

export function awaitUserInput(question: string): Promise<void> {
  const talker = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    talker.question(question, () => {
      talker.close();
      resolve();
    });
  });
}

export function waitForFunding(user: ContractAPI, count = 60*7, intervalMS = 1000): Promise<void> {
  return waitFor(async (): Promise<boolean> => {
    const balance = await user.getEthBalance();
    return balance.gt(0);
  }, count, intervalMS)
}

export function waitForSync(user: ContractAPI, count = 90, intervalMS = 1000): Promise<void> {
  let i = 1;

  return waitFor(async (): Promise<boolean> => {
    console.log(`Awaiting SDKReady #${i}/${count}`);
    i++;
    return user.augur.sdkReady;
  }, count, intervalMS)
}

export async function waitFor(fn: () => Promise<boolean>, count: number, intervalMS: number) {
  await new Promise(async (resolve, reject) => {
    for (let i = 0; i < count; i++) {
      if (await fn()) return resolve();
      await sleep(intervalMS);
    }
    reject();
  })
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

export interface AddressFormatting {
  lower?: boolean;
  prefix?: boolean;
}

export function formatAddress(address: string, formatting: AddressFormatting): string {
  if (formatting.lower === true) {
    address = address.toLowerCase();
  }

  const hasPrefix = address.slice(0, 2) === '0x';
  if (formatting.prefix === true && !hasPrefix) {
    address = `0x${address}`;
  } else if (formatting.prefix === false && hasPrefix) {
    address = address.slice(2);
  }

  return address
}

export function flatten<T>(listOfLists: T[][]): T[] {
  return listOfLists.reduce((flat, list) => flat.concat(list), []);
}

export function randomSelect<T>(list: T[]): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function randomBoolean():boolean {
  return Math.random() > 0.5;
}

export function cycle<T>(list: T[]): () => T {
  const shallowCopy = [...list];
  let index = 0;
  return () => {
    const nextItem = shallowCopy[index];
    index++;
    if (index >= shallowCopy.length) index = 0;
    return nextItem;
  }
}

export function range(start: number, end: number) {
  if (start >= end) throw Error(`range start must be larger than end. start=${start}, end=${end}`);
  const count = end - start;
  return Array.from(new Array(count).keys()).map((n) => n + start)

}

export type ReadiedPromise<T> = () => Promise<T>;

export async function mapPromises<T>(readiedPromises: Array<ReadiedPromise<T>>, serial): Promise<T[]> {
  if (serial) {
    const results = [];
    for (const promise of readiedPromises) {
      results.push(await promise());
    }
    return results;
  } else {
    return Promise.all(readiedPromises.map((promise) => promise()));
  }
}

export async function getOrCreateMarket(user: ContractAPI, marketId?: string|boolean, title?: string): Promise<string> {
  marketId = (marketId as string) || null;
  if (marketId === null) {
    const market = await user.createReasonableYesNoMarket(title);
    marketId = market.address;
    console.log(`Created market ${marketId}`);
  }
  return marketId
}

export function generateAddress(creator: string, nonce: number): string { 
  const rlpData = RLP.encode([creator, `0x${nonce.toString(16)}`]);
  let contractAddress = keccak256(rlpData);
  return `0x${contractAddress.substring(26)}`;
}