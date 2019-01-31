import { Provider } from './ethereum/Provider';
import { Events } from './api/Events';
import { Contracts } from './api/Contracts';
import { Trade } from './api/Trade';
import { GenericAugurInterfaces } from 'augur-core';
import { NetworkId, NetworkContractAddresses, ContractAddresses } from 'augur-artifacts';
import * as addressesJson from '../../augur-artifacts/addresses.json';

export class Augur<TBigNumber> {
  public readonly provider: Provider;
  private readonly dependencies?:  GenericAugurInterfaces.Dependencies<TBigNumber>;

  public readonly networkId: NetworkId;
  public readonly events: Events;
  public readonly networkAddresses: NetworkContractAddresses;
  public readonly addresses: ContractAddresses;
  public readonly contracts: Contracts<TBigNumber>;
  public readonly trade: Trade<TBigNumber>;

  public constructor (provider: Provider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>, networkId: NetworkId) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;

    // API
    this.networkAddresses = <NetworkContractAddresses>addressesJson;
    this.addresses = this.networkAddresses[this.networkId];
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.events = new Events(this.provider, this.addresses.Augur);
  }

  public static async create<TBigNumber>(provider: Provider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>): Promise<Augur<TBigNumber>> {
    const networkId = await provider.getNetworkId();
    return new Augur<TBigNumber>(provider, dependencies, networkId);
  }
}
