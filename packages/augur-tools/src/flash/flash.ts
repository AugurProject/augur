import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractAddresses } from "@augurproject/artifacts";
import { NetworkConfiguration } from "@augurproject/core";

import { ContractAPI } from "../libs/contract-api";
import { Account } from "../constants";
import { providers } from "ethers";
import { Connectors, Events, SubscriptionEventName } from "@augurproject/sdk";

export interface FlashOption {
  name: string;
  abbr?: string;
  description?: string;
  flag?: boolean;
  required?: boolean;
}

export interface FlashArguments {
  [name: string]: string | boolean;
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
  readonly scripts: { [name: string]: FlashScript } = {};
  log: Logger = console.log;

  // Node miscellanea
  provider?: EthersProvider;
  contractAddresses?: ContractAddresses;
  account?: string;

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

    const readyArgs: FlashArguments = {};
    Object.keys(args).map(name => {
      readyArgs[name.replace('-', '_')] = args[name];
    });

    if (typeof script === 'undefined') {
      throw Error(`No such script "${name}"`);
    }

    // Make sure required parameters are present.
    for (const option of script.options || []) {
      const optionName = option.name.replace('-', '_');

      const arg = readyArgs[optionName];

      if (option.required) {
        if (typeof arg === 'undefined') {
          this.log(`ERROR: Must specify "--${optionName}"`);
          return;
        }
      }
    }

    return script.call.bind(this)(readyArgs);
  }

  noProvider() {
    if (typeof this.provider === 'undefined') {
      this.log(
        'ERROR: Must first connect to node. Consider running `ganache`.'
      );
      return true;
    }

    return false;
  }

  usingSdk = false;
  sdkReady = false;
  async ensureUser(
    network?: NetworkConfiguration,
    wireUpSdk?: boolean
  ): Promise<ContractAPI> {
    if (typeof this.contractAddresses === 'undefined') {
      throw Error('ERROR: Must load contract addresses first.');
    }

    if (this.user) return this.user;
    if (wireUpSdk) this.usingSdk = true;

    let connector = null;
    if (wireUpSdk) connector = new Connectors.SEOConnector();

    this.user = await ContractAPI.userWrapper(
      this.getAccount(),
      this.provider,
      this.contractAddresses,
      connector
    );

    if (wireUpSdk) {
      this.user.augur.connect(network.http, this.getAccount().publicKey);
      this.user.augur.on(SubscriptionEventName.NewBlock, this.sdkNewBlock);
    }
    await this.user.approveCentralAuthority();

    return this.user;
  }

  sdkNewBlock = (log: Events.NewBlock) => {
    if (log.blocksBehindCurrent === 0) {
      this.sdkReady = true;
    } else {
      this.log(`sdk ${log.blocksBehindCurrent} block behind`);
    }
  };

  getAccount(): Account {
    let useAccount = this.accounts[0];
    if (this.account) {
      const findAccount = this.accounts.find(
        a => a.publicKey.toLowerCase() === this.account.toLowerCase()
      );
      if (findAccount) useAccount = findAccount;
    }
    return useAccount;
  }

  async contractOwner(): Promise<ContractAPI> {
    if (typeof this.contractAddresses === 'undefined') {
      throw Error('ERROR: Must load contract addresses first.');
    }

    return ContractAPI.userWrapper(
      this.accounts[0],
      this.provider,
      this.contractAddresses
    );
  }

  makeProvider(config: NetworkConfiguration): EthersProvider {
    const provider = new providers.JsonRpcProvider(config.http);
    return new EthersProvider(provider, 5, 0, 40);
  }

  async getNetworkId(provider: EthersProvider): Promise<string> {
    return (await provider.getNetwork()).chainId.toString();
  }
}
