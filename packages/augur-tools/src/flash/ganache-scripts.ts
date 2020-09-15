const compilerOutput = require('@augurproject/artifacts/build/contracts.json');
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { SDKConfiguration } from '@augurproject/utils';
import * as fs from 'async-file';
import { BigNumber } from 'ethers/utils';
import { MemDown } from 'memdown';
import {
  createDb,
  createSeed,
  deployContracts,
  hashContracts,
  loadSeed,
  makeGanacheProvider,
  Seed,
  startGanacheServer,
  writeSeeds,
} from '..';
import { generateDoubleDeploy } from '../libs/seeds/double-deploy';
import { FlashArguments, FlashSession } from './flash';
import { LogReplayer } from './replay-logs';
import { LogReplayerV1 } from './replay-logs-v1';
import { sleep } from './util';

export const defaultSeedPath = '/tmp/augur/seed.json';

export function addGanacheScripts(flash: FlashSession) {
  flash.addScript({
    name: 'ganache',
    description: 'Start an empty Ganache node.',
    options: [
      {
        name: 'port',
        description: "Local node's port. Defaults to 8545.",
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const port = Number(args.port) || 8545;
      await startGanacheServer(this.accounts, port);
      while (true) await sleep(1000 * 60 * 60); // keep alive
    },
  });

  flash.addScript({
    name: 'create-basic-seed',
    description:
      'Creates a seed file of the ganache state after deploying Augur. Does not overwrite it if it exists.',
    ignoreNetwork: true,
    options: [
      {
        name: 'name',
        description: 'Name of seed. Defaults to "default".',
      },
      {
        name: 'filepath',
        description: 'Filepath of seed. Defaults to "/tmp/seed.json"',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const name = (args.name as string) || 'default';
      const filepath = (args.filepath as string) || defaultSeedPath;

      if (await fs.exists(filepath)) {
        const seed: Seed = await loadSeed(filepath);
        if (seed.contractsHash === hashContracts()) {
          console.log('Seed file exists and is up to date.');
          return; // no need to update seed
        }
      }

      console.log('Creating seed file.');
      const db = createDb();
      const web3Provider = await makeGanacheProvider(db, this.accounts);
      const provider = new EthersProvider(web3Provider, 10, 0, 40);

      provider.overrideGasPrice = new BigNumber(100);

      const config = this.deriveConfig({
        deploy: { normalTime: false, writeArtifacts: true },
      });
      const { addresses } = await deployContracts(
        this.network,
        provider,
        this.getAccount(),
        compilerOutput,
        config
      );
      config.addresses = addresses;

      const defaultSeed = await createSeed(provider, db, addresses, {});

      const doubleDeploy = await generateDoubleDeploy(
        config,
        defaultSeed,
        addresses,
        this.getAccount(),
        this.network
      );

      const seeds = {
        [name]: defaultSeed,
        doubleDeploy,
      };

      await writeSeeds(seeds, filepath);
    },
  });

  flash.addScript({
    name: 'create-seed-from-logs',
    ignoreNetwork: true,
    options: [
      {
        name: 'logs',
        description: 'Filepath for logs',
        required: true,
      },
      {
        name: 'seed',
        description: 'Filepath for seed',
        required: true,
      },
      {
        name: 'v1',
        description: 'Use this flag if the logs come from a V1 contract.',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const logsFilePath = args.logs as string;
      const seedFilePath = args.seed as string;
      const v1 = Boolean(args.v1);

      const logs = JSON.parse(await fs.readFile(logsFilePath));

      // Build a local environment to replay to.
      const { provider, db } = await startGanacheServer(this.accounts);
      const config = this.deriveConfig({
        deploy: { normalTime: false, writeArtifacts: false },
      });
      await deployContracts(
        this.network,
        provider,
        this.getAccount(),
        compilerOutput,
        config
      );

      // Replay the logs.
      const replayer = v1
        ? new LogReplayerV1(this.accounts, provider, this.config)
        : new LogReplayer(this.accounts, provider, this.config);
      await replayer.Replay(logs);

      // Save the replayed state to a seed for later use.
      await makeSeed(provider, db, this.config, name, seedFilePath);
    },
  });

  flash.addScript({
    name: 'replay-logs',
    options: [
      {
        name: 'logs',
        description: 'Filepath for logs',
        required: true,
      },
      {
        name: 'v1',
        description: 'Use this flag if the logs come from a V1 contract.',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      if (this.noProvider()) return;
      if (this.noAddresses()) return;
      const v1 = Boolean(args.v1);
      const logsFilePath = args.logs as string;

      const logs = JSON.parse(await fs.readFile(logsFilePath));

      // Replay the logs.
      const replayer = v1
        ? new LogReplayerV1(this.accounts, this.provider, this.config)
        : new LogReplayer(this.accounts, this.provider, this.config);
      await replayer.Replay(logs);
    },
  });
}

async function makeSeed(
  provider: EthersProvider,
  ganacheDb: MemDown,
  config: SDKConfiguration,
  name = 'default',
  filepath = defaultSeedPath
) {
  const seed = await createSeed(provider, ganacheDb, config.addresses);
  const seeds = {};
  seeds[name] = seed;
  await writeSeeds(seeds, filepath);
}
