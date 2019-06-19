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


export interface FlashOption {
  name: string;
  description?: string;
  flag: boolean;
}

export interface FlashArguments {
  [name: string]: any;
}

export interface FlashScript {
  name: string;
  description?: string;
  options?: FlashOption[];
  call(this: FlashSession, args: FlashArguments): Promise<any>;
}


export class FlashSession {
  // Configuration
  accounts: AccountList;
  user?: ContractAPI;
  readonly scripts: FlashScript[] = [];
  log: (s: string) => void = console.log;

  // Useful defaults
  market?: ContractInterfaces.Market;

  // Node miscellania
  provider?: EthersProvider;
  seedFilePath = `${__dirname}/seed.json`;
  ganacheProvider?: ethers.providers.Web3Provider;
  ganacheServer?: GanacheServer;

  constructor(accounts: AccountList, seedFilePath?: string, logger?: (s: string) => void) {
    this.accounts = accounts;
    this.seedFilePath = seedFilePath || this.seedFilePath;
    this.log = logger || this.log;
  }

  addScript(script: FlashScript) {
    this.scripts.push(script);
  }

  loadSeed() {
    return require(this.seedFilePath);
  }

  noProvider() {
    if (typeof this.provider === "undefined") {
      this.log("ERROR: Must first connect to node. Consider running `ganache`.");
      return true;
    }

    return false;
  }

  async ensureUser(): Promise<ContractAPI> {
    const seed = this.loadSeed();
    this.user = await ContractAPI.userWrapper(this.accounts, 0, this.provider, seed.addresses);
    await this.user.approveCentralAuthority();

    return this.user;
  }

  async ensureSeed() {
    if (await seedFileIsOutOfDate(this.seedFilePath)) {
      this.log("Seed file out of date. Creating/updating...");
      await createSeedFile(this.seedFilePath, this.accounts);
    }

    this.log("Seed file is up-to-date!");
  }
}

const _100_ETH = 100000000000000000000;

const flash = new FlashSession([
  {
    secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
    publicKey: "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
    balance: _100_ETH,
  },
  {
    secretKey: "0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
    publicKey: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb",
    balance: _100_ETH,
  }],
  `${__dirname}/seed.json`,
  vorpal.log.bind(vorpal));

flash.addScript({
  name: "create-seed-file",
  description: "Creates Ganache seed file from compiled Augur contracts.",
  options: [
    {
      name: "filepath",
      description: `Where is the seed file? Defaults to previous or "./seed.json"`,
      flag: false,
    }],
  async call(this: FlashSession, args) {
    this.seedFilePath = args.filepath || this.seedFilePath;

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
  ],
  async call(this: FlashSession, args) {
    await this.ensureSeed();

    if (args.internal) {
      this.ganacheProvider = await makeGanacheProvider(this.seedFilePath, this.accounts);
    } else {
      this.ganacheServer = await makeGanacheServer(this.seedFilePath, this.accounts);
      this.ganacheProvider = new ethers.providers.Web3Provider(this.ganacheServer.ganacheProvider);
    }

    this.provider = new EthersProvider(this.ganacheProvider, 5, 0, 40);
  },
});

flash.addScript({
  name: "gas-limit",
  async call(this: FlashSession, args) {
    if (this.noProvider()) return;

    const block = await this.provider.getBlock("latest");
    this.log(`Gas limit: ${block.gasLimit.toNumber()}`);
  },
});

flash.addScript({
  name: "create-reasonable-yes-no-market",
  async call(this: FlashSession, args) {
    if (this.noProvider()) return;
    const user = await this.ensureUser();

    this.market = await user.createReasonableYesNoMarket(user.augur.contracts.universe);

    this.log(`Created market "${this.market.address}".`);
  },
});

for (const script of flash.scripts) {
  let v: Vorpal|Vorpal.Command = vorpal;
  v = v.command(script.name, script.description || "");

  for (const option of script.options || []) {
    v = v.option(`--${option.name}${option.flag ? "" : ` <arg>`}`, option.description);
  }

  v = v.action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    return script.call.bind(flash)(args.options);
  });
}

vorpal
  .delimiter("augur$")
  .show();
