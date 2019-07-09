import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractAddresses } from "@augurproject/artifacts";

import { ContractAPI } from "../libs/contract-api";
import { Account } from "../constants";

// interface GanacheServer {
//   ganacheProvider: ethers.providers.Web3Provider;
//   listen(port: number, cb: () => void): void;
// }


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

type Logger = (s: string) => void;

export class FlashSession {
  // Configuration
  accounts: Account[];
  user?: ContractAPI;
  readonly scripts: {[name: string]: FlashScript} = {};
  log: Logger = console.log;

  // Node miscellanea
  provider?: EthersProvider;
  contractAddresses?: ContractAddresses;

  // Other values to store. This exists because e.g. Ganache can't exist in all environments.
  [key: string]: any;

  constructor(accounts: Account[]) {
    this.accounts = accounts;
  }

  addScript(script: FlashScript) {
    this.scripts[script.name] = script;
  }

  setLogger(logger: Logger) {
    this.log = logger;
  }

  async call(name: string, args: FlashArguments): Promise<any> {
    const script = this.scripts[name];

    if (typeof script === "undefined") {
      throw Error(`No such script "${name}"`);
    }

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
}
