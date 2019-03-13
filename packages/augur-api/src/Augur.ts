import { Provider } from "./ethereum/Provider";
import { Events } from "./api/Events";
import { Contracts } from "./api/Contracts";
import { Trade } from "./api/Trade";
import { GenericAugurInterfaces } from "@augurproject/core";
import { addresses, ContractAddresses, NetworkContractAddresses, NetworkId } from "@augurproject/artifacts";

export interface UserSpecificEvent {
  name: string;
  numAdditionalTopics: number;
  userTopicIndex: number;
}

export class Augur<TBigNumber> {
  public readonly provider: Provider;
  private readonly dependencies?:  GenericAugurInterfaces.Dependencies<TBigNumber>;

  public readonly networkId: NetworkId;
  public readonly events: Events;
  public readonly networkAddresses: NetworkContractAddresses;
  public readonly addresses: ContractAddresses;
  public readonly contracts: Contracts<TBigNumber>;
  public readonly trade: Trade<TBigNumber>;
  // TODO Set genericEventNames & userSpecificEvents using
  // GenericContractInterfaces instead of hardcoding them
  public readonly genericEventNames: Array<string> = [
    "CompleteSetsPurchased",
    "CompleteSetsSold",
    "DisputeCrowdsourcerCompleted",
    "DisputeCrowdsourcerContribution",
    "DisputeCrowdsourcerCreated",
    "DisputeCrowdsourcerRedeemed",
    "DisputeWindowCreated",
    "InitialReporterRedeemed",
    "InitialReportSubmitted",
    "InitialReporterTransferred",
    "MarketMailboxTransferred",
    "MarketCreated",
    "MarketFinalized",
    "MarketMigrated",
    "MarketTransferred",
    "MarketParticipantsDisavowed",
    "OrderCanceled",
    "OrderCreated",
    "OrderFilled",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "TradingProceedsClaimed",
    "UniverseCreated",
    "UniverseForked",
  ];
  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
  public readonly userSpecificEvents: Array<UserSpecificEvent> = [
    {
      "name": "TokensTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndex": 2,
    },
  ];

  public constructor (provider: Provider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>, networkId: NetworkId) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;

    // API
    this.networkAddresses = <NetworkContractAddresses>addresses;
    this.addresses = this.networkAddresses[this.networkId];
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.events = new Events(this.provider, this.addresses.Augur);
  }

  public static async create<TBigNumber>(provider: Provider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>): Promise<Augur<TBigNumber>> {
    const networkId = await provider.getNetworkId();
    return new Augur<TBigNumber>(provider, dependencies, networkId);
  }
}
