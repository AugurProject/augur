const compilerOutput = require('@augurproject/artifacts/build/contracts.json');
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ContractAddresses } from '@augurproject/utils';
import * as fs from 'async-file';
import crypto from 'crypto';
import { ethers } from 'ethers';
import * as ganache from 'ganache-core';
import memdown, { MemDown } from 'memdown';
import * as path from 'path';
import { Account } from '../constants';

const levelup = require('levelup');

interface Metadata {
  [item: string]: any;
}

export interface Seed {
  addresses: ContractAddresses;
  contractsHash: string;
  data: LevelDBRow[];
  metadata: Metadata;
}

export interface SeedFile {
  addresses: ContractAddresses;
  contractsHash: string;
  seeds: {
    [seedName: string]: Seed;
  };
}

export interface GanacheReturn {
  provider: EthersProvider;
  db: MemDown;
}
export async function startGanacheServer(
  accounts: Account[],
  port = 8545
): Promise<GanacheReturn> {
  const db = createDb();
  const ganacheServer = await makeGanacheServer(db, accounts);
  const ganacheProvider = new ethers.providers.Web3Provider(
    ganacheServer.ganacheProvider
  );
  ganacheServer.listen(port, () => null);
  console.log(`Server started on port ${port}`);
  const provider = new EthersProvider(ganacheProvider, 5, 0, 40);

  return { provider, db };
}

export async function makeGanacheProvider(
  db: MemDown,
  accounts: Account[]
): Promise<ethers.providers.Web3Provider> {
  return new ethers.providers.Web3Provider(
    ganache.provider(await makeGanacheOpts(accounts, db))
  );
}

export async function makeGanacheServer(
  db: MemDown,
  accounts: Account[]
): Promise<ganache.GanacheServer> {
  return ganache.server(await makeGanacheOpts(accounts, db));
}

function toGanacheAccounts(accounts: Account[]): ganache.Account[] {
  return accounts.map(account => {
    return {
      secretKey: account.privateKey,
      publicKey: account.address,
      balance: account.initialBalance,
    };
  });
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
      if (err) resolve(undefined);
      resolve(value);
    });
  });

  const maxBlockTimeStamp = maxBlock
    ? await new Promise<Date>((resolve, reject) => {
        if (!maxBlock) resolve(defaultDate);
        levelup(db).get(`!blocks!${maxBlock - 1}`, (err, value) => {
          if (err) resolve(defaultDate);

          const blockInfo = JSON.parse(value.toString());
          const timestamp = blockInfo['header']['timestamp'];
          resolve(new Date(Number(timestamp) * 1000));
        });
      })
    : defaultDate;

  // Need to do this to get a consistent timestamp for the the next block
  while (Date.now() % 1000 > 100) {}

  return {
    accounts: toGanacheAccounts(accounts),
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    db,
    gasLimit: 10000000,
    debug: false,
    network_id: 123456,
    _chainId: 123456,
    hardfork: 'istanbul',
    time: maxBlockTimeStamp,
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

export async function extractSeed(db: MemDown): Promise<LevelDBRow[]> {
  return new Promise((resolve, reject) => {
    const payload: LevelDBRow[] = [];
    levelup(db)
      .createReadStream({
        keyAsBuffer: false,
        valueAsBuffer: false,
      })
      .on('data', (data: LevelDBRow) => {
        payload.push({
          type: 'put',
          ...data,
        });
      })
      .on('error', (err: Error) => {
        console.log('Oh my!', err);
        reject(err);
      })
      .on('close', () => {
        console.log('Stream closed');
      })
      .on('end', () => {
        console.log('Stream ended');
        resolve(payload);
      });
  });
}

export function addSeedToSeedFile(
  seedName: string,
  seed: Seed,
  seedFile: SeedFile
): SeedFile {
  seedFile.seeds[seedName] = seed;
  return seedFile;
}

export function seedFromSeedFile(seedFile: SeedFile, seedName: string): Seed {
  const { contractsHash, addresses, seeds } = seedFile;
  const { data, metadata } = seeds[seedName];
  return { contractsHash, addresses, data, metadata };
}

export function seedFileFromSeed(seed: Seed): SeedFile {
  const { addresses, contractsHash } = seed;
  return {
    addresses,
    contractsHash,
    seeds: {},
  };
}

export async function createSeed(
  provider: EthersProvider,
  db: MemDown,
  addresses: ContractAddresses,
  metadata: Metadata = {}
): Promise<Seed> {
  return {
    addresses,
    contractsHash: hashContracts(),
    data: await extractSeed(db),
    metadata,
  };
}

export async function loadSeed(
  seedFilePath: string,
  seedToLoad = 'default'
): Promise<Seed> {
  return seedFromSeedFile(await loadSeedFile(seedFilePath), seedToLoad);
}

export async function writeSeeds(
  seeds: { [name: string]: Seed },
  filePath: string
): Promise<void> {
  if (Object.keys(seeds).length === 0)
    throw Error("writeSeed's first argument must contain at least one seed");

  const someSeed = Object.values(seeds)[0] as Seed;
  let seedFile = (await fs.exists(filePath))
    ? await loadSeedFile(filePath)
    : seedFileFromSeed(someSeed);
  for (const name of Object.keys(seeds)) {
    const seed = seeds[name];
    seedFile = addSeedToSeedFile(name, seed, seedFile);
  }
  await writeSeedFile(seedFile, filePath);
}

export async function writeSeed(
  seedName: string,
  seed: Seed,
  filePath: string
): Promise<void> {
  let seedFile = fs.exists(filePath)
    ? await loadSeedFile(filePath)
    : seedFileFromSeed(seed);
  seedFile = addSeedToSeedFile(seedName, seed, seedFile);
  await writeSeedFile(seedFile, filePath);
}

export async function loadSeedFile(seedFilePath: string): Promise<SeedFile> {
  return JSON.parse(await fs.readFile(seedFilePath));
}

export async function writeSeedFile(
  seedFile: SeedFile,
  filePath: string
): Promise<void> {
  // @TODO make this recursive.
  if (!(await fs.exists(path.dirname(filePath)))) {
    await fs.mkdir(path.dirname(filePath));
  }

  await fs.writeFile(path.resolve(filePath), JSON.stringify(seedFile));
}
