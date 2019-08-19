import { Account, NULL_ADDRESS, _1_HUNDRED_ETH } from "../constants";
import { ContractAPI } from "..";
import { ParsedLog } from "@augurproject/types";
import { BigNumber } from "bignumber.js";
import { formatBytes32String } from "ethers/utils";
import { ContractAddresses } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ethers } from "ethers";

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
interface IdMapping { [id1: string]: string; }
interface AccountMapping { [addr1: string]: Account; }

export class LogReplayer {
  accounts: AccountMapping = {};
  universes: AddressMapping = {};
  markets: AddressMapping = {};
  orders: IdMapping = {};

  piggybank: Account;
  availableAccounts: Account[];

  constructor(
    initialAccounts: Account[],
    private provider: EthersProvider,
    private contractAddresses: ContractAddresses
  ) {
    if (initialAccounts.length < 1) {
      throw Error("LogReplayer's initial accounts list must contain at least one account");
    }
    this.piggybank = initialAccounts[0];
    this.availableAccounts = initialAccounts.slice(1);

    this.universes[NULL_ADDRESS] = NULL_ADDRESS;
  }

  async User(account: Account): Promise<ContractAPI> {
    const user = await ContractAPI.userWrapper(account, this.provider, this.contractAddresses);
    await user.approveCentralAuthority();
    return user;
  }

  async Account(address: string): Promise<Account> {
    if (typeof this.accounts[address] === 'undefined') {
      if (this.availableAccounts.length > 0) {
        this.accounts[address] = this.availableAccounts.pop();
      } else { // Create and fund new account.
        const wallet = ethers.Wallet.createRandom();
        this.accounts[address] = {
          secretKey: wallet.privateKey,
          publicKey: wallet.address,
          balance: _1_HUNDRED_ETH,
        };

        const piggybankWallet = new ethers.Wallet(this.piggybank.secretKey, this.provider);
        await piggybankWallet.sendTransaction({
          to: wallet.address,
          value: `0x${new BigNumber(_1_HUNDRED_ETH).toString(16)}`,
        });
      }
    }

    return this.accounts[address];
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
      default:
    }
  }

  async UniverseCreated(log: ParsedLog) {
    const { parentUniverse, childUniverse, payoutNumberators } = log;

    console.log(`Replaying UniverseCreated "${childUniverse}"`);

    if (parentUniverse === NULL_ADDRESS) { // Deployment already gave us a genesis universe so just record it.
      const user = await this.User(this.piggybank); // Piggybank is typically the Augur deployer, including genesis universe.
      this.universes[childUniverse] = user.augur.addresses.Universe;
    } else {
      // TODO No need to support forking yet. But when it is supported, remember
      //      that parentPayoutDistributionHash is part of the Universe contract.
    }
  }

  async MarketCreated(log: ParsedLog) {
    const {
      universe, endTime, extraInfo, market, marketCreator, designatedReporter,
      feeDivisor, prices, marketType, numTicks, outcomes, timestamp } = log;

    console.log(`Replaying MarketCreated "${market}"`);

    const feePerCashInAttoCash = new BigNumber(10).pow(16); // 1% fee
    const [ start, end ] = [ makeDate(timestamp), makeDate(endTime) ];
    const marketLength = end.getTime() - start.getTime();
    const adjustedEndTime = new BigNumber(Math.floor((Date.now() + marketLength) / 1000));

    const user = await this.Account(marketCreator).then((account) => this.User(account));
    const reporter = await this.Account(designatedReporter);

    let result;
    switch(marketType) {
      case 0: // YES_NO
        result = await user.createYesNoMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.publicKey,
          extraInfo,
        });
        break;
      case 1: // CATEGORICAL
        result = await user.createCategoricalMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.publicKey,
          outcomes,
          extraInfo});
        break;
      case 2: // SCALAR
        result = await user.createScalarMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.publicKey,
          prices,
          numTicks,
          extraInfo});
        break;
      default: throw Error(`Unexpected market type "${marketType}`);
    }

    this.markets[market] = result.address;
  }

  async OrderEvent(log: ParsedLog) {
    const { universe, market, eventType, orderType, orderId, tradeGroupId, addressData, uint256Data } = log;

    // From packages/augur-core/source/contracts/Augur.sol:61
    const [ kycToken, orderCreator, orderFiller ] = addressData;
    const [ price, amount, outcome, tokenRefund, sharesRefund, fees, amountFilled, timestamp, sharesEscrowed, tokensEscrowed ] = uint256Data;

    console.log(`Replaying OrderEvent "${orderId}"`);

    const betterOrderId = formatBytes32String("");
    const worseOrderId = formatBytes32String("");

    const orderCreatorUser = await this.Account(orderCreator).then((account) => this.User(account));

    switch(eventType) { // See packages/augur-core/source/contracts/Augur.sol:40
      case 0: // OrderEventType.Create
        this.orders[orderId] = await orderCreatorUser.placeOrder(
          this.markets[market],
          new BigNumber(orderType),
          new BigNumber(amount),
          new BigNumber(price),
          outcome,
          betterOrderId,
          worseOrderId,
          tradeGroupId);
        break;
      case 1: // OrderEventType.Cancel
        await orderCreatorUser.cancelOrder(this.orders[orderId]);
        break;
      case 2: // OrderEventType.ChangePrice
        await orderCreatorUser.setOrderPrice(
          this.orders[orderId],
          new BigNumber(price),
          betterOrderId,
          worseOrderId);
        break;
      case 3: // OrderEventType.Fill
        const orderFillerUser = await this.Account(orderFiller).then((account) => this.User(account));
        await orderFillerUser.fillOrder(
          this.orders[orderId],
          new BigNumber(amountFilled),
          ethers.utils.parseBytes32String(tradeGroupId),
          new BigNumber(price).times(amountFilled).times(10) // not sure why this needs to be multiplied
        );
        break;
      default: throw Error(`Unexpected order event type "${eventType}"`);
    }
  }
}

function makeDate(fromChain: string): Date {
  const bn = new BigNumber(fromChain);
  const n = bn.toNumber() * 1000;
  return new Date(n);
}
