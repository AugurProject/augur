import { WSClient } from '@0x/mesh-rpc-client';
import { ContractAddresses } from '@augurproject/artifacts';
import { NetworkConfiguration } from '@augurproject/core';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { GnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { Connectors, EmptyConnector, Events, SDKConfiguration, SubscriptionEventName } from "@augurproject/sdk";
import { BaseConnector } from "@augurproject/sdk/build/connector";
import { BlockAndLogStreamerListenerInterface } from "@augurproject/sdk/build/state/db/BlockAndLogStreamerListener";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { API } from "@augurproject/sdk/build/state/getter/API";
import { configureDexieForNode } from "@augurproject/sdk/build/state/utils/DexieIDBShim";
import { BigNumber } from 'bignumber.js';
import { providers } from "ethers";
import { Account } from "../constants";
import { ContractAPI } from "../libs/contract-api";

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

  usingSdk = false;
  sdkReady = false;
  async ensureUser(
    network?: NetworkConfiguration,
    wireUpSdk = null,
    approveCentralAuthority = true,
    accountAddress = null,
    meshEndpoint = null,
    useGnosis = false
  ): Promise<ContractAPI> {
    if (typeof this.contractAddresses === 'undefined') {
      throw Error('ERROR: Must load contract addresses first.');
    }

    if (this.user && (wireUpSdk === null || wireUpSdk === this.usingSdk)) {
      return this.user;
    }

    network = network || this.network;

    if (wireUpSdk) this.usingSdk = true;

    const config: SDKConfiguration = {
      networkId: await this.provider.getNetworkId(),
    };

    const connector: BaseConnector = wireUpSdk
      ? new Connectors.DirectConnector()
      : new EmptyConnector();
    const gnosisRelay = useGnosis
      ? new GnosisRelayAPI('http://localhost:8000/api/')
      : undefined;
    const meshClient = !!meshEndpoint ? new WSClient(meshEndpoint) : undefined;
    this.user = await ContractAPI.userWrapper(
      this.getAccount(accountAddress),
      this.provider,
      this.contractAddresses,
      connector,
      gnosisRelay,
      meshClient
    );

    if (useGnosis) {
      const safe = await this.user.fundSafe();
      const safeStatus = await this.user.getSafeStatus(safe);
      console.log(`Safe ${safe}: ${safeStatus}`);
      await this.user.augur.setGasPrice(new BigNumber(90000));
      this.user.setGnosisSafeAddress(safe);
      this.user.setUseGnosisSafe(true);
      this.user.setUseGnosisRelay(true);
    }

    if (wireUpSdk) {
      if (!network) throw Error('Cannot wire up sdk if network is not set.');
      await connector.connect(config, this.getAccount().publicKey);
      await this.user.augur.on(
        SubscriptionEventName.NewBlock,
        this.sdkNewBlock
      );
      this.db = this.makeDB();
      this.api = new API(this.user.augur, this.db);
    }

    if (approveCentralAuthority) {
      await this.user.approveCentralAuthority();
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
    let useAccount = this.accounts[0];
    if (address) {
      const found = this.accounts.find(
        a => a.publicKey.toLowerCase() === address.toLowerCase()
      );
      if (found) useAccount = found;
    }
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
    const ethersProvider = new EthersProvider(provider, 5, 0, 40);
    ethersProvider.overrideGasPrice = config.gasPrice;
    ethersProvider.gasLimit = config.gasLimit;
    return ethersProvider;
  }

  async getNetworkId(provider: EthersProvider): Promise<string> {
    return (await provider.getNetwork()).chainId.toString();
  }

  async makeDB(): Promise<DB> {
    const listener = ({
      listenForBlockRemoved: () => {},
      listenForBlockAdded: () => {},
      listenForEvent: () => {},
      startBlockStreamListener: () => {},
    } as unknown) as BlockAndLogStreamerListenerInterface;

    return DB.createAndInitializeDB(
      Number(this.user.augur.networkId),
      0,
      0,
      this.user.augur,
      listener
    );
  }
}
