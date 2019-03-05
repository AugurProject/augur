import { Provider } from "./ethereum/Provider";
import { Events } from "./api/Events";
import { Contracts } from "./api/Contracts";
import { Trade } from "./api/Trade";
import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";

export class Augur<TBigNumber> {
  public readonly provider: Provider;
  private readonly dependencies?:  GenericAugurInterfaces.Dependencies<TBigNumber>;

  public readonly networkId: NetworkId;
  public readonly events: Events;
  public readonly addresses: ContractAddresses;
  public readonly contracts: Contracts<TBigNumber>;
  public readonly trade: Trade<TBigNumber>;

  public constructor (provider: Provider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>, networkId: NetworkId, addresses: ContractAddresses) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.events = new Events(this.provider, this.addresses.Augur);
  }

  public static async create<TBigNumber>(provider: Provider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>, addresses: ContractAddresses): Promise<Augur<TBigNumber>> {
    const networkId = await provider.getNetworkId();
    return new Augur<TBigNumber>(provider, dependencies, networkId, addresses);
  }
}
