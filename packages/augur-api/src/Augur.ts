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
    "DisputeCrowdsourcerCompleted",
    "DisputeCrowdsourcerCreated",
    "DisputeWindowCreated",
    "MarketCreated",
    "MarketFinalized",
    "MarketMigrated",
    "MarketParticipantsDisavowed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "UniverseCreated",
    "UniverseForked",
  ];
  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
  public readonly userSpecificEvents: Array<UserSpecificEvent> = [
  {
      "name": "CompleteSetsPurchased",
      "numAdditionalTopics": 3,
      "userTopicIndex": 2,
  },
  {
      "name": "CompleteSetsSold",
      "numAdditionalTopics": 3,
      "userTopicIndex": 2,
  },
  {
      "name": "DisputeCrowdsourcerContribution",
      "numAdditionalTopics": 3,
      "userTopicIndex": 1,
  },
  {
      "name": "DisputeCrowdsourcerRedeemed",
      "numAdditionalTopics": 3,
      "userTopicIndex": 1,
  },
  {
      "name": "InitialReporterRedeemed",
      "numAdditionalTopics": 3,
      "userTopicIndex": 1,
  },
  {
      "name": "InitialReportSubmitted",
      "numAdditionalTopics": 3,
      "userTopicIndex": 1,
  },
  {
      "name": "InitialReporterTransferred",
      "numAdditionalTopics": 2,
      "userTopicIndex": 2,
  },
  {
      "name": "MarketMailboxTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndex": 2,
  },
  {
      "name": "MarketTransferred",
      "numAdditionalTopics": 2,
      "userTopicIndex": 1,
  },
  {
      "name": "OrderCanceled",
      "numAdditionalTopics": 3,
      "userTopicIndex": 2,
  },
  {
      "name": "OrderCreated",
      "numAdditionalTopics": 3,
      "userTopicIndex": 0,
  },
  {
      "name": "OrderFilled",
      "numAdditionalTopics": 2,
      "userTopicIndex": 1,
  },
  {
      "name": "TokensTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndex": 2,
  },
  {
      "name": "TradingProceedsClaimed",
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
