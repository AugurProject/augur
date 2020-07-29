import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Connectors, createClient } from '@augurproject/sdk';
import { NewBlock, SubscriptionEventName } from '@augurproject/sdk-lite';
import { configureDexieForNode } from '@augurproject/sdk/build/state/utils/DexieIDBShim';
import {
  mergeConfig,
  RecursivePartial,
  SDKConfiguration,
  validConfigOrDie,
} from '@augurproject/utils';
import { ContractAPI, makeSigner, providerFromConfig, Seed } from '..';
import { Account } from '../constants';

configureDexieForNode(true);

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
  ignoreNetwork?: boolean;
  syncDatabase?: boolean;
  description?: string;
  options?: FlashOption[];
  call(this: FlashSession, args: FlashArguments): Promise<void>;
}

export class FlashSession {
  // Configuration
  readonly scripts: { [name: string]: FlashScript } = {};

  // Node miscellanea
  provider?: EthersProvider;

  constructor(
    public accounts: Account[],
    public network?: string,
    public config?: SDKConfiguration,
  ) {}

  addScript(script: FlashScript) {
    this.scripts[script.name] = script;
  }

  async call(name: string, args: FlashArguments): Promise<void> {
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
          console.log(`must specify "--${optionName}"`);
          return;
        }
      }
    }

    return script.call.bind(this)(readyArgs);
  }

  noProvider() {
    if (typeof this.provider === 'undefined') {
      console.error(
        'must first connect to node. Consider running `ganache`'
      );
      return true;
    }

    return false;
  }

  noAddresses() {
    if (typeof this.config?.addresses === 'undefined') {
      console.error('must first load contract addresses');
      return true;
    }

    return false;
  }

  deriveConfig(overwrite: RecursivePartial<SDKConfiguration>): SDKConfiguration {
    return validConfigOrDie(mergeConfig(this.config, overwrite));
  }

  _configs: SDKConfiguration[] = [];
  pushConfig(overwrite: RecursivePartial<SDKConfiguration>): SDKConfiguration {
    this._configs.push(this.config);
    const newConfig = validConfigOrDie(mergeConfig(this.config, overwrite));
    this.config = newConfig;
    return newConfig;
  }
  popConfig(): SDKConfiguration {
    const oldConfig = this._configs.pop();
    if (!oldConfig) throw Error('Cannot pop config when no configs are pushed');
    return this.config;
  }

  sdkReady = false;
  async createUser(
    account: Account,
    config: SDKConfiguration,
  ): Promise<ContractAPI> {
    const provider = await providerFromConfig(config);
    const connector = new Connectors.SingleThreadConnector();
    const signer = await makeSigner(account, provider);
    const client = await createClient(config, connector, signer, provider);
    const user = new ContractAPI(client, provider, account);

    if (!config.flash?.skipApproval) {
      await user.approveIfNecessary();
    }

    if (config.flash?.syncSDK) {
      await user.augur.connector.connect(this.config);
      // NB(pg): Augur#on should *not* be asynchronous and needs to be refactored
      // at another time.
      await user.augur.on(
        SubscriptionEventName.NewBlock,
        this.sdkNewBlock
      );
    }

    return user;
  }

  sdkNewBlock = (log: NewBlock) => {
    if (log.blocksBehindCurrent === 0) {
      this.sdkReady = true;
    } else {
      console.log(`sdk ${log.blocksBehindCurrent} block behind`);
    }
  };

  getAccount(): Account {
    return this.accounts[0];
  }

  async contractOwner(): Promise<ContractAPI> {
    if (typeof this.config?.addresses === 'undefined') {
      throw Error('ERROR: Must load contract addresses first.');
    }

    return ContractAPI.userWrapper(
      this.accounts[0],
      this.provider,
      this.config,
    );
  }

  makeProvider(config: SDKConfiguration): EthersProvider {
    return providerFromConfig(config);
  }

  async getNetworkId(provider: EthersProvider): Promise<string> {
    return (await provider.getNetwork()).chainId.toString();
  }

  seeds: {[name: string]: Seed} = {};
}
