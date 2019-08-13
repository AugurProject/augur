import {
  loadSeedFile,
  makeGanacheProvider,
  makeGanacheServer,
  createSeed,
  writeSeedFile,
  Seed,
  createDb, createDbFromSeed,
  hashContracts,
} from "../libs/ganache";
import { FlashArguments, FlashSession } from "./flash";

import { ethers } from "ethers";
import * as ganache from "ganache-core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { setAddresses, NetworkId } from "@augurproject/artifacts";
import * as fs from "async-file";
import { LogReplayer } from "./replay-logs";

export const defaultSeedPath = `/tmp/seed.json`;

export function addGanacheScripts(flash: FlashSession) {
  flash.seeds = {};

  flash.noGanache = function(this: FlashSession) {
    if (typeof this.ganacheDb === "undefined") {
      this.log("ERROR: Must be running ganache.");
      return true;
    }

    return false;
  };

  flash.createSeed = async function(this: FlashSession) {
    return createSeed(this.provider, this.ganacheDb, this.contractAddresses);
  };

  flash.addScript({
    name: "ganache",
    description: "Start an empty Ganache node.",
    options: [
      {
        name: "internal",
        description: "Prevent node from being available to browsers.",
        flag: true,
      },
      {
        name: "port",
        description: "Local node's port. Defaults to 8545.",
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      this.ganacheDb = createDb();

      if (args.internal) {
        this.ganacheProvider = await makeGanacheProvider(this.ganacheDb, this.accounts);
      } else {
        this.ganachePort = args.port || 8545;
        this.ganacheServer = await makeGanacheServer(this.ganacheDb, this.accounts);
        this.ganacheProvider = new ethers.providers.Web3Provider(this.ganacheServer.ganacheProvider);
        this.ganacheServer.listen(this.ganachePort, () => null);
        this.log(`Server started on port ${this.ganachePort}`);
      }

      this.provider = new EthersProvider(this.ganacheProvider, 5, 0, 40);
    },
  });

  flash.addScript({
    name: "stop-ganache",
    description: "Stop the ganache node.",
    async call(this: FlashSession) {
      if (typeof this.ganacheServer !== "undefined") {
        await this.ganacheServer.close();
        delete this.ganacheServer;
      }

      delete this.ganacheProvider;
      delete this.provider;
      delete this.contractAddresses;
    },
  });

  flash.addScript({
    name: "make-seed",
    description: "Creates Ganache seed from compiled Augur contracts.",
    options: [
      {
        name: "name",
        description: `Name of seed. Defaults to "default".`,
      },
      {
        name: "save",
        description: "Also save seed to file.",
        flag: true,
      },
      {
        name: "filepath",
        description: `Use with --save. Defaults to "/tmp/seed.json".`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      if (this.noGanache()) return;

      const name = args.name as string || "default";
      const seed = await this.createSeed();

      this.seeds[name] = seed;

      if (args.save as boolean) {
        const filepath = args.filepath as string || defaultSeedPath;
        await writeSeedFile(seed, filepath);
      }
    },
  });

  flash.addScript({
    name: "save-seed-to-file",
    description: "Saves given seed to a file.",
    options: [
      {
        name: "name",
        description: `Name of seed. Defaults to "default".`,
      },
      {
        name: "filepath",
        description: `Filepath of seed. Defaults to "/tmp/seed.json"`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const name = args.name as string || "default";
      const seedFilePath = args.filepath as string || defaultSeedPath;
      const seed = this.seeds[name];
      await writeSeedFile(seed, seedFilePath);
    },
  });

  flash.addScript({
    name: "load-seed-file",
    description: "Creates Ganache seed file from compiled Augur contracts.",
    options: [
      {
        name: "name",
        description: `Name of seed. Defaults to "default".`,
      },
      {
        name: "filepath",
        description: `Filepath of seed. Defaults to "/tmp/seed.json"`,
      },
      {
        name: "use",
        description: "Also use the seed, replacing ganache's state with the seed's state.",
        flag: true,
      },
      {
        name: "write-artifacts",
        description: "Only meaningful in conjunction with --use. Overwrite addresses.json to include seed file's addresses.",
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const name = args.name as string || "default";
      const seedFilePath = args.filepath as string || defaultSeedPath;

      this.seeds[name] = await loadSeedFile(seedFilePath);

      if (args.use as boolean) {
        await this.call("use-seed", { seed: name, write_artifacts:  args.writeArtifacts as boolean });
      }
    },
  });

  flash.addScript({
    name: "use-seed",
    description: "Replaces ganache's state with the state provided by the seed.",
    options: [
      {
        name: "seed",
        description: `Name of seed to use. Defaults to "default"`,
      },
      {
        name: "write-artifacts",
        description: "Overwrite addresses.json to include seed file's addresses.",
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const seedName = args.seed as string || "default";
      const writeArtifacts = args.write_artifacts as boolean;

      const seed = this.seeds[seedName] as Seed;

      this.ganacheDb = await createDbFromSeed(seed);

      if (this.ganacheServer) {
        this.ganacheServer.close();
        this.ganacheServer = await makeGanacheServer(this.ganacheDb, this.accounts);
        this.ganacheProvider = new ethers.providers.Web3Provider(this.ganacheServer.ganacheProvider);
        this.ganacheServer.listen(this.ganachePort, () => null);
        this.log(`Server started on port ${this.ganachePort}`);
      } else { // internal
        this.ganacheProvider = await makeGanacheProvider(this.ganacheDb, this.accounts);
      }

      flash.contractAddresses = seed.addresses;
      this.provider = new EthersProvider(this.ganacheProvider, 5, 0, 40);

      if (writeArtifacts) {
        const networkId = await this.provider.getNetworkId() as NetworkId;
        await setAddresses(networkId, seed.addresses);
      }
    },
  });

  flash.addScript({
    name: "list-seeds",
    description: "List ganache seeds",
    async call(this: FlashSession) {
      const seeds = Object.keys(this.seeds);

      this.log(`There are ${seeds.length} seeds:`);
      for (const name of seeds) {
        this.log(`\t${name}`);
      }
    },
  });

  flash.addScript({
    name: "create-basic-seed",
    description: "Creates a seed file of the ganache state after deploying Augur. Does not overwrite it if it exists.",
    options: [
      {
        name: "name",
        description: `Name of seed. Defaults to "default".`,
      },
      {
        name: "filepath",
        description: `Filepath of seed. Defaults to "/tmp/seed.json"`,
      },
      {
        name: "write-artifacts",
        description: "Overwrite addresses.json to include seed file's addresses.",
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const name = args.name as string || "default";
      const filepath = args.filepath as string || defaultSeedPath;
      const writeArtifacts = args.write_artifacts as boolean;

      if (fs.exists(filepath)) {
        const seed: Seed = await loadSeedFile(filepath);
        if (seed.contractsHash === hashContracts()) {
          return; // no need to update seed
        }
      }

      await this.call("ganache", { internal: true });
      await this.call("deploy", { write_artifacts: writeArtifacts, time_controlled: "true" });
      await this.call("make-seed", { name, filepath, save: true });
    },
  });

  flash.addScript({
    name: 'create-log-commands',
    options: [
      {
        name: "logs",
        description: `Filepath for logs`,
        required: true,
      },
      {
        name: "seed",
        description: "Filepath for seed",
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const logsFilePath = args.logs as string;
      const seedFilePath = args.seed as string;

      const logs = JSON.parse(await fs.readFile(logsFilePath));

      // Build a local environment to replay to.
      await this.call("ganache", { internal: true });
      await this.call("deploy", { write_artifacts: false, time_controlled: "true" });
      const user = await this.ensureUser();
      await user.approveCentralAuthority();

      const replayer = new LogReplayer(user);
      await replayer.Replay(logs);

      await this.call("make-seed", { name: "from-logs", save: true, filepath: seedFilePath });
    },
  });
}
