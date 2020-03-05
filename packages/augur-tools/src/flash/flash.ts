import { ContractAddresses, NetworkId } from '@augurproject/artifacts';
import { NetworkConfiguration } from '@augurproject/core';
import {
  Connectors,
  createClient,
  Events,
  SDKConfiguration,
  SubscriptionEventName,
} from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { LogFilterAggregatorInterface } from '@augurproject/sdk/build/state/logs/LogFilterAggregator';
import { configureDexieForNode } from '@augurproject/sdk/build/state/utils/DexieIDBShim';
import { BigNumber } from 'bignumber.js';
import { providers } from 'ethers';
import { Account } from '../constants';
import { makeSigner } from '../libs/blockchain';
import { ContractAPI } from '../libs/contract-api';
import { EthersProvider } from '@augurproject/ethersjs-provider';

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
  description?: string;
  options?: FlashOption[];
  call(this: FlashSession, args: FlashArguments): Promise<any>;
}

type Logger = (s: string) => void;

export class FlashSession {
  // Configuration
  user?: ContractAPI;
  api?: API;
  db?: Promise<DB>;
  readonly scripts: { [name: string]: FlashScript } = {};
  log: Logger = console.log;

  // Node miscellanea
  provider?: EthersProvider;
  contractAddresses?: ContractAddresses;
  account?: string;

  // Other values to store. This exists because e.g. Ganache can't exist in all environments.
  [key: string]: any;

  constructor(
    public accounts: Account[],
    public network?: NetworkConfiguration
  ) {}

  addScript(script: FlashScript) {
    this.scripts[script.name] = script;
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

  noAddresses() {
    if (typeof this.contractAddresses === 'undefined') {
      this.log('ERROR: Must first load contract addresses.');
      return true;
    }

    return false;
  }

  sdkReady = false;
  async ensureUser(
    network?: NetworkConfiguration,
    wireUpSdk: boolean|null = null,
    approveCentralAuthority = true,
    accountAddress: string|null = null,
    useZerox = false,
    useGSN = false
  ): Promise<ContractAPI> {
    if (typeof this.contractAddresses === 'undefined') {
      throw Error('ERROR: Must load contract addresses first.');
    }

    if (this.noProvider()) {
      throw new Error('ERROR: No provider');
    }

    const config: SDKConfiguration = {
      networkId: (await this.provider.getNetworkId()) as NetworkId,
      ethereum: {
        http: network ? network.http : undefined, // NB(pg): Currently some tests don't pass in this config
        rpcRetryCount: 5,
        rpcRetryInterval: 0,
        rpcConcurrency: 40
      },
      gsn: {
        enabled: useGSN,
      },
      zeroX: {
        rpc: {
          enabled: useZerox,
          ws: useZerox ? network.zeroxEndpoint : undefined
        },
        mesh: {
          enabled: false
        }
      },
      syncing: {
        enabled: wireUpSdk
      },
      addresses: this.contractAddresses,
    };
    // Initialize the user if this is the first time we are being called. This will create the provider and all of that jazz.
    if (!this.user) {
      console.log('--------- Connecting ---------')
      console.log('Network Id: ', config.networkId);
      if (config?.zeroX?.rpc?.enabled) {
        console.log('ZeroX Enabled:', config.zeroX.rpc.ws);
      }
      if (config?.gsn?.enabled) {
        console.log('GSN Enabled');
      }

      try {
        // Get an actual account for the provided public address. This also
        // handles the case where none is passed in, in which case it will use
        // the default account (0)
        const account = this.getAccount(accountAddress);
        console.log(`Account Address: ${account.publicKey}`);
        // Within flash we want to use an account with a private key as the signer
        // so we manually create our own signer here.
        const signer = await makeSigner(account, this.provider);

        // Run everything in one context, both syncing and this client code
        const connector = new Connectors.SingleThreadConnector();
        const client = await createClient(config, connector, account.publicKey, signer, this.provider);

        // Create a ContractAPI for this user with this particular augur client. This provides
        // a variety of nice wrapper functions which we should think about exporting
        this.user = new ContractAPI(client, this.provider, client.dependencies, account);
        this.user.augur.setGasPrice(new BigNumber(this.network.gasPrice.toString()));

        // IF we want this flash client to use a wallet associated with the past in
        // account, configure it at this point.
        if (config.gsn.enabled) {
          await this.user.getOrCreateWallet();
          this.user.augur.setGasPrice(new BigNumber(20*10e9));
          this.user.setUseWallet(true);
          this.user.setUseRelay(true);
        } else if (approveCentralAuthority) {
          await this.user.approveCentralAuthority();
        }
      } catch (e) {
        throw e;
      } finally {
        console.log('------------------------------')
      }
    }

    if (config.syncing.enabled && !this.api) {
      console.log('------ Starting Server -------')
      console.log('Syncing Enabled: Starting API Server')
      try {
        await this.user.augur.connector.connect(config);
        this.api = (this.user.augur.connector as Connectors.SingleThreadConnector).api;
        console.log('Syncing Started')

        // NB(pg): Augur#on should *not* be asynchronous and needs to be refactored
        // at another time.
        await this.user.augur.on(
          SubscriptionEventName.NewBlock,
          this.sdkNewBlock
        );
      } catch (e) {
        throw e;
      } finally {
        console.log('------------------------------')
      }
    }

    return this.user;
  }

  sdkNewBlock = (log: Events.NewBlock) => {
    if (log.blocksBehindCurrent === 0) {
      this.sdkReady = true;
    } else {
      this.log(`sdk ${log.blocksBehindCurrent} block behind`);
    }
  };

  getAccount(address: string = null): Account {
    // Default to first account
    let useAccount = this.accounts[0];

    // Find account from given address
    if (address) {
      const found = this._findAccount(address);
      if (found) useAccount = found;
    }

    // If an account already exists then ignore everything and return that
    if (this.account) {
      const findAccount = this._findAccount(this.account);
      if (findAccount) useAccount = findAccount;
    }

    return useAccount;
  }

  private _findAccount(address: string): Account|undefined {
    return this.accounts.find(
      a => a.publicKey.toLowerCase() === address.toLowerCase()
    );
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
    const ethersProvider = new EthersProvider(provider, 5, 0, 40);
    ethersProvider.overrideGasPrice = config.gasPrice;
    ethersProvider.gasLimit = config.gasLimit;
    return ethersProvider;
  }

  async getNetworkId(provider: EthersProvider): Promise<string> {
    return (await provider.getNetwork()).chainId.toString();
  }

  async makeDB() {
    const logFilterAggregator = ({
      getEventTopics: () => {},
    parseLogs: () => {},
    getEventContractAddress: () => {},
    } as unknown) as LogFilterAggregatorInterface;

    return DB.createAndInitializeDB(
      Number(this.user.augur.networkId),
      logFilterAggregator,
      this.user.augur,
      true
    );
  }
}
