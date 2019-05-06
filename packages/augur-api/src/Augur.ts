import { Provider } from "./ethereum/Provider";
import { Events } from "./api/Events";
import { Contracts } from "./api/Contracts";
import { Trade } from "./api/Trade";
import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";

export interface CustomEvent {
  name: string;
  eventName?: string;
  idFields?: Array<string>;
}

export interface UserSpecificEvent extends CustomEvent {
  numAdditionalTopics: number;
  userTopicIndicies: Array<number>;
}

export class Augur<TBigNumber, TProvider extends Provider = Provider> {
  public readonly provider: TProvider;
  private readonly dependencies:  GenericAugurInterfaces.Dependencies<TBigNumber>;

  public readonly networkId: NetworkId;
  public readonly events: Events;
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
    "MarketCreated",
    "MarketFinalized",
    "MarketMigrated",
    "MarketParticipantsDisavowed",
    "MarketTransferred",
    "MarketVolumeChanged",
    "OrderEvent",
    "ParticipationTokensRedeemed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "TradingProceedsClaimed",
    "UniverseCreated",
    "UniverseForked",
  ];

  public readonly customEvents: Array<CustomEvent> = [
    {
      "name": "CurrentOrders",
      "eventName": "OrderEvent",
      "idFields": ["orderId"]
    },
  ]

  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
  public readonly userSpecificEvents: Array<UserSpecificEvent> = [
    {
      "name": "TokensTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [1,2],
    },
    {
      "name": "ProfitLossChanged",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [2],
    },
    {
      "name": "TokenBalanceChanged",
      "numAdditionalTopics": 2,
      "userTopicIndicies": [1],
      "idFields": ["token"]
    },
  ];

  public constructor (provider: TProvider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>, networkId: NetworkId, addresses: ContractAddresses) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.trade = new Trade(this.provider, this.contracts);
    this.events = new Events(this.provider, this.addresses.Augur);
  }

  public static async create<TBigNumber, TProvider extends Provider=Provider>(provider: TProvider, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>, addresses: ContractAddresses): Promise<Augur<TBigNumber>> {
    const networkId = await provider.getNetworkId();
    const augur = new Augur<TBigNumber, TProvider>(provider, dependencies, networkId, addresses);

    await augur.contracts.setReputationToken(networkId);

    return augur;
  }

  public getMarket(address:string):GenericAugurInterfaces.Market<TBigNumber> {
    return new GenericAugurInterfaces.Market<TBigNumber>(this.dependencies, address);
  }

  public getOrders():GenericAugurInterfaces.Orders<TBigNumber> {
    return new GenericAugurInterfaces.Orders<TBigNumber>(this.dependencies, this.addresses.Orders);
  }
}
