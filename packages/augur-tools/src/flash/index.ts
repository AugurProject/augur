import { seedFileIsOutOfDate, createSeedFile } from "./generate-ganache-seed";
import { AccountList, makeGanacheProvider, makeGanacheServer } from "./ganache";
import { ContractAPI } from "./contract-api";

import { GanacheServer } from "ganache-core";
import { ethers } from "ethers";
import * as ganache from "ganache-core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractInterfaces } from "@augurproject/core";

import Vorpal from "vorpal";
const vorpal = new Vorpal();

function loadSeed(seedFilePath: string) {
  return require(seedFilePath);
}

function noProvider(command: Vorpal.CommandInstance) {
  if (typeof state.provider === "undefined") {
    command.log("ERROR: Must first connect to node. Consider running `ganache`.");
    return true;
  }

  return false;
}

async function ensureUser(): Promise<ContractAPI> {
  const seed = loadSeed(state.seedFilePath);
  state.user = await ContractAPI.userWrapper(state.accounts, 0, state.provider, seed.addresses);
  await state.user.approveCentralAuthority();

  return state.user;
}

async function ensureSeed(command: Vorpal.CommandInstance) {
  if (await seedFileIsOutOfDate(state.seedFilePath)) {
    command.log("Seed file out of date. Creating/updating...");
    await createSeedFile(state.seedFilePath, state.accounts);
  }

  command.log("Seed file is up-to-date!");
}


interface State {
  // Configuration
  accounts: AccountList;
  user?: ContractAPI;

  // Useful defaults
  market?: ContractInterfaces.Market;

  // Node miscellania
  provider?: EthersProvider;
  seedFilePath: string;
  ganacheProvider?: ethers.providers.Web3Provider;
  ganacheServer?: GanacheServer;
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
  seedFilePath: `${__dirname}/seed.json`,
};

vorpal
  .command("create-seed-file", "Creates Ganache seed file from compiled Augur contracts.")
  .option("--filepath", `Where is the seed file? Defaults to "./seed.json"`)
  .action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    state.seedFilePath = args.options.filepath || state.seedFilePath;

    await ensureSeed(this);
  });

vorpal
  .command("ganache", "Start a Ganache node.")
  .option("--internal", "Prevent node from being available to browsers.")
  .action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    await ensureSeed(this);

    if (args.options.internal) {
      state.ganacheProvider = await makeGanacheProvider(state.seedFilePath, state.accounts);
    } else {
      state.ganacheServer = await makeGanacheServer(state.seedFilePath, state.accounts);
      state.ganacheProvider = new ethers.providers.Web3Provider(state.ganacheServer.ganacheProvider);
    }

    state.provider = new EthersProvider(state.ganacheProvider, 5, 0, 40);
  });

vorpal
  .command("gas-limit")
  .action(async function(this: Vorpal.CommandInstance) {
    if (noProvider(this)) return;

    const block = await state.provider.getBlock("latest");
    this.log(`Gas limit: ${block.gasLimit.toNumber()}`);
  });

vorpal
  .command("create-reasonable-yes-no-market")
  .action(async function(this: Vorpal.CommandInstance) {
    if (noProvider(this)) return;
    const user = await ensureUser();

    state.market = await user.createReasonableYesNoMarket(user.augur.contracts.universe);

    this.log(`Created market "${state.market.address}".`);
  });

vorpal
  .delimiter("augur$")
  .show();
