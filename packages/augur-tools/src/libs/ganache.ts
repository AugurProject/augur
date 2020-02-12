import * as ganache from 'ganache-core';
import { ethers } from 'ethers';
import memdown from 'memdown';
import { MemDown } from 'memdown';
import { Contracts as compilerOutput, ContractAddresses } from '@augurproject/artifacts';
import { Account } from '../constants';
import crypto from 'crypto';
import { EthersProvider } from '@augurproject/ethersjs-provider';
const levelup = require('levelup');
import * as path from 'path';
import * as fs from 'async-file';

interface SeedCommon {
  addresses: ContractAddresses;
  contractsHash: string;
}

export interface SeedFile extends SeedCommon{
  seeds: {
    [seedName:string]: LevelDBRow[];
  };
}

export interface Seed extends SeedCommon {
  data: LevelDBRow[];
}

export async function makeGanacheProvider(db: MemDown, accounts: Account[]): Promise<ethers.providers.Web3Provider> {
  return new ethers.providers.Web3Provider(ganache.provider(await makeGanacheOpts(accounts, db)));
}

export async function makeGanacheServer(db: MemDown, accounts: Account[]): Promise<ganache.GanacheServer> {
  return ganache.server(await makeGanacheOpts(accounts, db));
}

export function createDb(): MemDown {
  return memdown('');
}

export async function createDbFromSeed(seed: Seed): Promise<MemDown> {
  const db = createDb();

  await new Promise((resolve, reject) => {
    db.batch(seed.data, (err: Error) => {
      if (err) reject(err);
      resolve();
    });
  });

  return db;
}

async function makeGanacheOpts(accounts: Account[], db: MemDown) {
  // Arbitrary date.
  const defaultDate = new Date('2012-09-27');

  // Determine the max timestamp of the previous seed.
  const maxBlock = await new Promise<number | undefined>((resolve, reject) => {
    levelup(db).get('!blockLogs!length', (err, value) => {
      if(err) resolve(undefined);
      resolve(value);
    });
  });

  const maxBlockTimeStamp = maxBlock ? await new Promise<Date>((resolve, reject) => {
    if(!maxBlock) resolve(defaultDate);
    levelup(db).get(`!blocks!${maxBlock - 1}`, (err, value) => {
      if(err) resolve(defaultDate);

      const blockInfo = JSON.parse(value.toString());
      const timestamp = blockInfo['header']['timestamp'];
      resolve(new Date(Number(timestamp) * 1000));
    });
  }) : defaultDate;

  // Need to do this to get a consistent timestamp for the the next block
  while(Date.now() % 1000 > 100) {
    true;
  }

  return {
    accounts,
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    db,
    gasLimit: 75000000000,
    debug: false,
    network_id: 123456,
    _chainId: 123456,
    hardfork: "istanbul",
    time: maxBlockTimeStamp
    // vmErrorsOnRPCResponse: false,
  };
}

export function hashContracts(): string {
  const md5 = crypto.createHash('md5');
  md5.update(JSON.stringify(compilerOutput));
  return md5.digest('hex');
}

export interface LevelDBRow {
  key: string;
  value: string;
  type: 'put';
}

export async function extractSeed(db: MemDown):Promise<LevelDBRow[]> {
  return new Promise((resolve, reject) => {
    const payload: LevelDBRow[] = [];
    levelup(db).createReadStream({
      keyAsBuffer: false,
      valueAsBuffer: false,
    }).on('data', (data: LevelDBRow) => {
      payload.push({
        type: 'put',
        ...data,
      });
    }).on('error', (err: Error) => {
      console.log('Oh my!', err);
      reject(err);
    }).on('close', () => {
      console.log('Stream closed');
    }).on('end', () => {
      console.log('Stream ended');
      resolve(payload);
    });
  });

}

export async function createSeed(provider: EthersProvider, db: MemDown, addresses: ContractAddresses): Promise<Seed> {
  return {
    addresses,
    contractsHash: hashContracts(),
    data: await extractSeed(db),
  };
}

export async function writeSeedFile(seed: SeedFile, filePath: string): Promise<void> {
  await fs.writeFile(path.resolve(filePath), JSON.stringify(seed));
}

export async function loadSeedFile(seedFilePath: string, seedToLoad = 'default'): Promise<Seed> {
  const {contractsHash, addresses, seeds}:SeedFile = JSON.parse(await fs.readFile(seedFilePath));

  return {
    contractsHash,
    addresses,
    data: seeds[seedToLoad]
  }
}
