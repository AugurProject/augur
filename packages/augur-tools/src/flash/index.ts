import { seedFileIsOutOfDate, createSeedFile } from "./generate-ganache-seed";

import Vorpal from "vorpal";
import { AccountList, makeGanacheProvider, makeGanacheServer } from "./ganache";
import { ethers } from "ethers";
const vorpal = new Vorpal();

interface State {
  seedFilePath?: string;
  ganacheProvider?: ethers.providers.Web3Provider;
  accounts: AccountList;
}

const state: State = {
  accounts: [{
    secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
    publicKey: "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
    balance: 100000000000000000000,  // 100 ETH
  }, {
    secretKey: "0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
    publicKey: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb",
    balance: 100000000000000000000,  // 100 ETH
  }],
};

vorpal
  .command("ganache", "Start a Ganache node.")
  .option("--internal", "Prevent node from being available to browsers.")
  .action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    if (!state.seedFilePath) {
      this.log("ERROR: Must set seed file first. Call `create-seed-file`.");
      return;
    }

    if (args.options.internal) {
      state.ganacheProvider = await makeGanacheProvider(state.seedFilePath, state.accounts);
    } else {
      await makeGanacheServer(state.seedFilePath, state.accounts);
    }


  });

vorpal
  .command("create-seed-file", "Creates Ganache seed file from compiled Augur contracts.")
  .option("--filepath", `Where is the seed file? Defaults to "./seed.json"`)
  .action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    state.seedFilePath = args.options.filepath || `${__dirname}/seed.json`;
    if (await seedFileIsOutOfDate(state.seedFilePath)) {
      this.log("Seed file out of date. Creating/updating...");
      await createSeedFile(state.seedFilePath, state.accounts);
    } else {
      this.log("Seed file is up-to-date. No need to update.");
    }
  });

vorpal
  .delimiter("augur$")
  .show();
