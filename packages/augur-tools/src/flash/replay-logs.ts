import { NULL_ADDRESS } from "../constants";
import { ContractAPI } from "..";
import { ParsedLog } from "@augurproject/types";
import { BigNumber } from "bignumber.js";
import _ from "lodash";
import { inOneMonths } from "./time";
import { formatBytes32String } from "ethers/utils";

const EVENTS = {
  "MarketCreated": {
    "universe": "IUniverse",
    "endTime": "uint256",
    "extraInfo": "string",
    "market": "IMarket",
    "marketCreator": "address",
    "designatedReporter": "address",
    "feeDivisor": "uint256",
    "prices": "int256[]",
    "marketType": "IMarket.MarketType",
    "numTicks": "uint256",
    "outcomes": "bytes32[]",
    "timestamp": "uint256",
  },
  "InitialReportSubmitted": {
    "universe": "address",
    "reporter": "address",
    "market": "address",
    "amountStaked": "uint256",
    "isDesignatedReporter": "bool",
    "payoutNumerators": "uint256[]",
    "description": "string",
    "timestamp": "uint256",
  },
  "DisputeCrowdsourcerCreated": {
    "universe": "address",
    "market": "address",
    "disputeCrowdsourcer": "address",
    "payoutNumerators": "uint256[]",
    "size": "uint256",
  },
  "DisputeCrowdsourcerContribution": {
    "universe": "address",
    "reporter": "address",
    "market": "address",
    "disputeCrowdsourcer": "address",
    "amountStaked": "uint256",
    "description": "string",
    "timestamp": "uint256",
  },
  "DisputeCrowdsourcerCompleted": {
    "universe": "address",
    "market": "address",
    "disputeCrowdsourcer": "address",
    "nextWindowStartTime": "uint256",
    "pacingOn": "bool",
  },
  "InitialReporterRedeemed": {
    "universe": "address",
    "reporter": "address",
    "market": "address",
    "amountRedeemed": "uint256",
    "repReceived": "uint256",
    "payoutNumerators": "uint256[]",
    "timestamp": "uint256",
  },
  "DisputeCrowdsourcerRedeemed": {
    "universe": "address",
    "reporter": "address",
    "market": "address",
    "disputeCrowdsourcer": "address",
    "amountRedeemed": "uint256",
    "repReceived": "uint256",
    "payoutNumerators": "uint256[]",
    "timestamp": "uint256",
  },
  "ReportingParticipantDisavowed": {
    "universe": "address",
    "market": "address",
    "reportingParticipant": "address",
  },
  "MarketParticipantsDisavowed": {
    "universe": "address",
    "market": "address",
  },
  "MarketFinalized": {
    "universe": "address",
    "market": "address",
    "timestamp": "uint256",
    "winningPayoutNumerators": "uint256[]",
  },
  "MarketMigrated": {
    "market": "address",
    "originalUniverse": "address",
    "newUniverse": "address",
  },
  "UniverseForked": {
    "universe": "address",
    "forkingMarket": "IMarket",
  },
  "UniverseCreated": {
    "parentUniverse": "address",
    "childUniverse": "address",
    "payoutNumerators": "uint256[]",
  },
  "OrderEvent": {
    "universe": "address",
    "market": "address",
    "eventType": "OrderEventType",
    "orderType": "Order.Types",
    "orderId": "bytes32",
    "tradeGroupId": "bytes32",
    "addressData": "address[]",
    "uint256Data": "uint256[]",
  },
  "CompleteSetsPurchased": {
    "universe": "address",
    "market": "address",
    "account": "address",
    "numCompleteSets": "uint256",
    "timestamp": "uint256",
  },
  "CompleteSetsSold": {
    "universe": "address",
    "market": "address",
    "account": "address",
    "numCompleteSets": "uint256",
    "fees": "uint256",
    "timestamp": "uint256",
  },
  "TradingProceedsClaimed": {
    "universe": "address",
    "shareToken": "address",
    "sender": "address",
    "market": "address",
    "outcome": "uint256",
    "numShares": "uint256",
    "numPayoutTokens": "uint256",
    "finalTokenBalance": "uint256",
    "fees": "uint256",
    "timestamp": "uint256",
  },
  "TokensTransferred": {
    "universe": "address",
    "token": "address",
    "from": "address",
    "to": "address",
    "value": "uint256",
    "tokenType": "TokenType",
    "market": "address",
  },
  "TokensMinted": {
    "universe": "address",
    "token": "address",
    "target": "address",
    "amount": "uint256",
    "tokenType": "TokenType",
    "market": "address",
    "totalSupply": "uint256",
  },
  "TokensBurned": {
    "universe": "address",
    "token": "address",
    "target": "address",
    "amount": "uint256",
    "tokenType": "TokenType",
    "market": "address",
    "totalSupply": "uint256",
  },
  "TokenBalanceChanged": {
    "universe": "address",
    "owner": "address",
    "token": "address",
    "tokenType": "TokenType",
    "market": "address",
    "balance": "uint256",
    "outcome": "uint256",
  },
  "DisputeWindowCreated": {
    "universe": "address",
    "disputeWindow": "address",
    "startTime": "uint256",
    "endTime": "uint256",
    "id": "uint256",
    "initial": "bool",
  },
  "InitialReporterTransferred": {
    "universe": "address",
    "market": "address",
    "from": "address",
    "to": "address",
  },
  "MarketTransferred": {
    "universe": "address",
    "market": "address",
    "from": "address",
    "to": "address",
  },
  "MarketVolumeChanged": {
    "universe": "address",
    "market": "address",
    "volume": "uint256",
    "outcomeVolumes": "uint256[]",
  },
  "MarketOIChanged": {
    "universe": "address",
    "market": "address",
    "marketOI": "uint256",
  },
  "ProfitLossChanged": {
    "universe": "address",
    "market": "address",
    "account": "address",
    "outcome": "uint256",
    "netPosition": "int256",
    "avgPrice": "uint256",
    "realizedProfit": "int256",
    "frozenFunds": "int256",
    "realizedCost": "int256",
    "timestamp": "uint256",
  },
  "ParticipationTokensRedeemed": {
    "universe": "address",
    "disputeWindow": "address",
    "account": "address",
    "attoParticipationTokens": "uint256",
    "feePayoutShare": "uint256",
    "timestamp": "uint256",
  },
  "TimestampSet": {
    'newTimestamp': "uint256",
  },
};

const COMMON_FIELDS = [
  "blockHash",
  "blockNumber",
  "logIndex",
  "removed",
  "topics",
  "transactionHash",
  "transactionIndex",
  "transactionLogIndex",
];

interface AddressMapping { [addr1: string]: string; }

export class LogReplayer {
  accounts: AddressMapping = {};
  universes: AddressMapping = {};
  markets: AddressMapping = {};

  constructor(private user: ContractAPI) {
    this.universes[NULL_ADDRESS] = NULL_ADDRESS;
  }

  async Replay(logs: ParsedLog[]) {
    for (const log of logs) {
      await this.ReplayLog(log);
    }
  }

  async ReplayLog(log: ParsedLog) {
    switch(log.name) {
      case "UniverseCreated": return this.UniverseCreated(log);
      case "MarketCreated": return this.MarketCreated(log);
      case "OrderEvent": return this.OrderEvent(log);
      default:// console.log(`x ${log.name}`);
    }
  }

  async UniverseCreated(log: ParsedLog) {
    const { parentUniverse, childUniverse, payoutNumberators } = log;

    console.log("> UniverseCreated", parentUniverse, childUniverse);

    if (parentUniverse === NULL_ADDRESS) {
      // Deployment already gave us a genesis universe so just record it.
      this.universes[childUniverse] = this.user.augur.addresses.Universe;
    } else {
      // TODO No need to support forking yet. But when it is supported, remember
      //      that parentPayoutDistributionHash is part of the Universe contract.
    }
  }

  async MarketCreated(log: ParsedLog) {
    const {
      universe, endTime, extraInfo, market, marketCreator, designatedReporter,
      feeDivisor, prices, marketType, numTicks, outcomes } = log;

    console.log("> MarktedCreated", universe, marketType);

    // TODO
    // const u = new ContractInterfaces.Universe(1, universe);

    // TODO marketCreator is a user so we need to use it

    const feePerCashInAttoCash = new BigNumber(10).pow(16); // TODO this is used in canned markets but is it correct?
    // TODO extract original market creation date to derive market length, to derive new endTime
    const adjustedEndTime = new BigNumber(inOneMonths.getTime() / 1000);

    let result;
    switch(marketType) {
      case 0: // YES_NO
        result = await this.user.augur.contracts.universe.createYesNoMarket(
          adjustedEndTime,
          feePerCashInAttoCash,
          feeDivisor,
          designatedReporter, // TODO use mapped address of user since this user does not exist in the target chain
          extraInfo
          // options?: { sender?: string }
          );
        break;
      case 1: // CATEGORICAL
        result = await this.user.augur.contracts.universe.createCategoricalMarket(
          adjustedEndTime,
          feePerCashInAttoCash,
          feeDivisor,
          designatedReporter, // TODO use mapped address of user since this user does not exist in the target chain
          outcomes,
          extraInfo);
        break;
      case 2: // SCALAR
        result = await this.user.augur.contracts.universe.createScalarMarket(
          adjustedEndTime,
          feePerCashInAttoCash,
          feeDivisor,
          designatedReporter, // TODO use mapped address of user since this user does not exist in the target chain
          prices,
          numTicks,
          extraInfo);
        break;
      default: throw Error(`Unexpected market type "${marketType}`);
    }

    const resultingMarketLog =_.filter(result, (log) => log.name === "MarketCreated")[0];
    this.markets[market] = resultingMarketLog.parameters.market;
  }

  async OrderEvent(log: ParsedLog) {
    console.log(log);
    const { universe, market, eventType, orderType, orderId, tradeGroupId, addressData, uint256Data } = log;

    // From packages/augur-core/source/contracts/Augur.sol:61
    const [ kycToken, orderCreator, orderFiller ] = addressData;
    const [ price, amount, outcome, tokenRefund, sharesRefund, fees, amountFilled, timestamp, sharesEscrowed, tokensEscrowed ] = uint256Data;

    const betterOrderId = formatBytes32String("");
    const worseOrderId = formatBytes32String("");

    console.log("MARINA", eventType);
    const [ numShares, cost ] = [ new BigNumber(amount), new BigNumber(price) ];

    switch(eventType) { // See packages/augur-core/source/contracts/Augur.sol:40
      case 0: // OrderEventType.Create
        await this.user.placeOrder(market, orderType, numShares, price, outcome, betterOrderId, worseOrderId, tradeGroupId);
        break;
      case 1: // OrderEventType.Cancel
        await this.user.cancelOrder(orderId);
        break;
      case 2: // OrderEventType.ChangePrice
        await this.user.setOrderPrice(orderId, price, betterOrderId, worseOrderId);
        break;
      case 3: // OrderEventType.Fill
        await this.user.fillOrder(orderId, cost, numShares, tradeGroupId);
        break;
      default: throw Error(`Unexpected order event type "${eventType}"`);
    }



    // async function placeOrder(person: ContractAPI,
    //                           market: Market,
    //                           can: CannedMarket,
    //                           tradeGroupId: string,
    //                           outcome: BigNumber,
    //                           orderType: BigNumber,
    //                           shares: BigNumber,
    //                           price: BigNumber): Promise<string> {
    //   const tickSize = can.tickSize
    //     ? new BigNumber(can.tickSize)
    //     : numTicksToTickSize(new BigNumber("100"), new BigNumber("0"), new BigNumber("0x0de0b6b3a7640000"));
    //
    //   const minDisplayPrice = new BigNumber(can.minPrice || "0");
    //   const attoShares = convertDisplayAmountToOnChainAmount(shares, tickSize);
    //   const attoPrice = convertDisplayPriceToOnChainPrice(price, minDisplayPrice, tickSize);
    //   const betterOrderId = formatBytes32String("");
    //   const worseOrderId = formatBytes32String("");
    //
    //   console.log("Shares:", attoShares.toString());
    //   console.log("Price:", attoPrice.toString());
    //
    //   return person.placeOrder(
    //     market.address,
    //     orderType,
    //     attoShares,
    //     attoPrice,
    //     outcome,
    //     betterOrderId,
    //     worseOrderId,
    //     tradeGroupId
    //   );
    // }
  }
}
