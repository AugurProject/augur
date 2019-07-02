import { seedFileIsOutOfDate, createSeedFile } from "./generate-ganache-seed";
import { ContractAPI, Account } from "..";

import { GanacheServer } from "ganache-core";
import { ethers } from "ethers";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { loadSeed } from "../libs/ganache";

export interface FlashOption {
  name: string;
  description?: string;
  flag?: boolean;
  required?: boolean;
}

export interface FlashArguments {
  [name: string]: string|boolean;
}

export interface FlashScript {
  name: string;
  description?: string;
  options?: FlashOption[];
  call(this: FlashSession, args: FlashArguments): Promise<any>;
}

export class FlashSession {
  // Configuration
  accounts: Account[];
  user?: ContractAPI;
  readonly scripts: {[name: string]: FlashScript} = {};
  log: (s: string) => void = console.log;

  // Useful defaults
  market?: ContractInterfaces.Market;

  // Node miscellanea
  provider?: EthersProvider;
  seedFilePath = `${__dirname}/seed.json`;
  contractAddresses?: ContractAddresses;
  ganacheProvider?: ethers.providers.Web3Provider;
  ganacheServer?: GanacheServer;

  constructor(accounts: Account[], seedFilePath?: string, logger?: (s: string) => void) {
    this.accounts = accounts;
    this.seedFilePath = seedFilePath || this.seedFilePath;
    this.log = logger || this.log;
  }

  addScript(script: FlashScript) {
    this.scripts[script.name] = script;
  }

  async call(name: string, args: FlashArguments): Promise<any> {
    const script = this.scripts[name];

    // Make sure required parameters are present.
    for (const option of script.options || []) {
      if (option.required) {
        const arg = args[option.name];
        if (typeof arg === "undefined") {
          this.log(`ERROR: Must specify "--${option.name}"`);
          return;
        }
      }
    }

    return script.call.bind(this)(args);
  }

  loadSeed() {
    const seed = loadSeed(this.seedFilePath);
    this.contractAddresses = seed.addresses;
    return seed;
  }

  noProvider() {
    if (typeof this.provider === "undefined") {
      this.log("ERROR: Must first connect to node. Consider running `ganache`.");
      return true;
    }

    return false;
  }

  async ensureUser(): Promise<ContractAPI> {
    if (typeof this.contractAddresses === "undefined") {
      throw Error("ERROR: Must load contract addresses first. Maybe run `ganache`?");
    }

    this.user = await ContractAPI.userWrapper(this.accounts[0], this.provider, this.contractAddresses);
    await this.user.approveCentralAuthority();

    return this.user;
  }

  async ensureSeed() {
    if (await seedFileIsOutOfDate(this.seedFilePath)) {
      this.log("Seed file out of date. Creating/updating...");
      await createSeedFile(this.seedFilePath, this.accounts);
    }

    this.log("Seed file is up-to-date!");

    return this.loadSeed();
  }
}
