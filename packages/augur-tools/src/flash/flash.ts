import { seedFileIsOutOfDate, createSeedFile } from "./generate-ganache-seed";
import { ContractAPI, Account } from "..";

import { GanacheServer } from "ganache-core";
import { ethers } from "ethers";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractInterfaces } from "@augurproject/core";

export interface FlashOption {
  name: string;
  description?: string;
  flag?: boolean;
  required?: boolean;
}

export interface FlashArguments {
  [name: string]: string;
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
    this.user = await ContractAPI.userWrapper(this.accounts[0], this.provider, seed.addresses);
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
