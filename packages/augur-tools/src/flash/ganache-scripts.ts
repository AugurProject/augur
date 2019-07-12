import { makeGanacheProvider, makeGanacheServer, loadSeed } from "../libs/ganache";
import { seedFileIsOutOfDate, createSeedFile } from "./generate-ganache-seed";
import { FlashSession, FlashArguments } from "./flash";

import { ethers } from "ethers";
import * as ganache from "ganache-core";
import { EthersProvider } from "@augurproject/ethersjs-provider";

export function addGanacheScripts(flash: FlashSession) {

  flash.seedFilePath = `${__dirname}/seed.json`;

  flash.loadSeed = function(this: FlashSession) {
    const seed = loadSeed(this.seedFilePath);
    this.contractAddresses = seed.addresses;
    return seed;
  };

  flash.ensureSeed = async function(this: FlashSession, writeArtifacts = false) {
    if (await seedFileIsOutOfDate(this.seedFilePath)) {
      this.log("Seed file out of date. Creating/updating...");
      await createSeedFile(this.seedFilePath, this.accounts, writeArtifacts);
    }

    this.log("Seed file is up-to-date!");

    return this.loadSeed();
  };

  flash.addScript({
    name: "create-seed-file",
    description: "Creates Ganache seed file from compiled Augur contracts.",
    options: [
      {
        name: "filepath",
        description: `Sets seed filepath. Initially set to "./seed.json"`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      this.seedFilePath = args.filepath as string || this.seedFilePath;

      await this.ensureSeed();
    },
  });

  flash.addScript({
    name: "ganache",
    description: "Start a Ganache node.",
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
      const writeArtifacts = !(args.internal as boolean);
      await this.ensureSeed(writeArtifacts);

      if (args.internal) {
        this.ganacheProvider = await makeGanacheProvider(this.seedFilePath, this.accounts);
      } else {
        const port = args.port || 8545;

        this.ganacheServer = await makeGanacheServer(this.seedFilePath, this.accounts);
        this.ganacheProvider = new ethers.providers.Web3Provider(this.ganacheServer.ganacheProvider);
        this.ganacheServer.listen(8545, () => null);
        this.log(`Server started on port ${port}`);
      }

      this.provider = new EthersProvider(this.ganacheProvider, 5, 0, 40);
    },
  });
}
