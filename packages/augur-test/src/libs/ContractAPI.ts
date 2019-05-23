import { stringTo32ByteHex, NULL_ADDRESS} from "./Utils";
import { Augur, PlaceTradeDisplayParams } from "@augurproject/sdk";
import { ContractInterfaces } from "@augurproject/core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { AccountList, makeDependencies, makeSigner } from "./LocalAugur";
import { ContractAddresses } from "@augurproject/artifacts";
import { BigNumber } from "bignumber.js";

const ETERNAL_APPROVAL_VALUE = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); // 2^256 - 1

export class ContractAPI {
  public static async userWrapper(accounts: AccountList, accountIndex: number, provider: EthersProvider, addresses: ContractAddresses) {
    const account = accounts[accountIndex];

    const signer = await makeSigner(account, provider);
    const dependencies = makeDependencies(account, provider, signer);
    const augur = await Augur.create(provider, dependencies, addresses);

    return new ContractAPI(augur, provider, account.publicKey);
  }

  public constructor(
    public readonly augur: Augur,
    public readonly provider: EthersProvider,
    public account: string, // address
  ) {}

  public async approveCentralAuthority(): Promise<void> {
    const authority = this.augur.addresses.Augur;
    await this.augur.contracts.cash.approve(authority, new BigNumber(2).pow(256).minus(new BigNumber(1)));
  }

  public async createYesNoMarket(
    universe: ContractInterfaces.Universe,
    endTime: BigNumber,
    feePerCashInAttoCash: BigNumber,
    affiliateFeeDivisor: BigNumber,
    designatedReporter: string,
    topic: string,
    extraInfo:string
  ): Promise<ContractInterfaces.Market> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();
    await this.faucet(marketCreationFee);
    const byteTopic = stringTo32ByteHex(topic);

    const createMarketEvents = await universe.createYesNoMarket(endTime, feePerCashInAttoCash, affiliateFeeDivisor, designatedReporter, byteTopic, extraInfo);

    // TODO: turn this into a function
    let marketId = "";
    for (const ev of createMarketEvents) {
      if (ev.name === "MarketCreated") {
        interface HasMarket {
          market: string;
        }
        marketId = (ev.parameters as HasMarket).market;
      }
    }

    console.log("Market created with id: ", marketId);
    return this.augur.contracts.marketFromAddress(marketId);
  }

  public async createReasonableYesNoMarket(universe: ContractInterfaces.Universe): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const endTime = new BigNumber(currentTimestamp + 30 * 24 * 60 * 60);
    const fee = new BigNumber(10).pow(16);
    const affiliateFeeDivisor = new BigNumber(25);
    return this.createYesNoMarket(universe, endTime, fee, affiliateFeeDivisor, this.account, " ", "{\"description\": \"description\"}");
  }

  public async createCategoricalMarket(universe: ContractInterfaces.Universe, endTime: BigNumber, feePerCashInAttoCash: BigNumber, affiliateFeeDivisor: BigNumber, designatedReporter: string, outcomes: Array<string>, topic: string, extraInfo: string): Promise<ContractInterfaces.Market> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();
    await this.faucet(marketCreationFee);
    const byteTopic = stringTo32ByteHex(topic);

    const createMarketEvents = await universe.createCategoricalMarket(endTime, feePerCashInAttoCash, affiliateFeeDivisor, designatedReporter, outcomes, byteTopic, extraInfo);

    // TODO: turn this into a function
    let marketId = "";
    for (const ev of createMarketEvents) {
      if (ev.name === "MarketCreated") {
        interface HasMarket {
          market: string;
        }
        marketId = (ev.parameters as HasMarket).market;
      }
    }

    return this.augur.contracts.marketFromAddress(marketId);
  }

  public async createReasonableMarket(universe: ContractInterfaces.Universe, outcomes: Array<string>): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const endTime = new BigNumber(currentTimestamp + 30 * 24 * 60 * 60);
    const fee = new BigNumber(10).pow(16);
    const affiliateFeeDivisor = new BigNumber(25);
    return this.createCategoricalMarket(universe, endTime, fee, affiliateFeeDivisor, this.account, outcomes, " ", "{\"description\": \"description\"}");
  }

  public async createScalarMarket(
    universe: ContractInterfaces.Universe,
    endTime: BigNumber,
    feePerCashInAttoCash: BigNumber,
    affiliateFeeDivisor: BigNumber,
    designatedReporter: string,
    prices: Array<BigNumber>,
    numTicks: BigNumber,
    topic: string,
    extraInfo: string,
    ): Promise<ContractInterfaces.Market> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();
    await this.faucet(marketCreationFee);
    const byteTopic = stringTo32ByteHex(topic);

    const createMarketEvents = await universe.createScalarMarket(endTime, feePerCashInAttoCash, affiliateFeeDivisor, designatedReporter, prices, numTicks, byteTopic, extraInfo);

    // TODO: turn this into a function
    let marketId = "";
    for (const ev of createMarketEvents) {
      if (ev.name === "MarketCreated") {
        interface HasMarket {
          market: string;
        }
        marketId = (ev.parameters as HasMarket).market;
      }
    }

    return this.augur.contracts.marketFromAddress(marketId);
  }

  public async createReasonableScalarMarket(universe: ContractInterfaces.Universe): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const endTime = new BigNumber(currentTimestamp + 30 * 24 * 60 * 60);
    const fee = new BigNumber(10).pow(16);
    const affiliateFeeDivisor = new BigNumber(25);
    const minPrice = new BigNumber(50).multipliedBy(new BigNumber(10).pow(18));
    const maxPrice = new BigNumber(250).multipliedBy(new BigNumber(10).pow(18));
    const numTicks = new BigNumber(20000);
    return this.createScalarMarket(universe, endTime, fee, affiliateFeeDivisor, this.account, [minPrice, maxPrice], numTicks, " ", "{\"description\": \"description\"}");
  }

  public async placeOrder(
    market: string,
    type: BigNumber,
    numShares: BigNumber,
    price: BigNumber,
    outcome: BigNumber,
    betterOrderID: string,
    worseOrderID: string,
    tradeGroupID: string,
  ): Promise<string> {
    const cost = numShares.multipliedBy(price);
    await this.faucet(cost);
    const orderId = await this.augur.contracts.createOrder.publicCreateOrder_(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, NULL_ADDRESS);
    console.log("orderId", orderId);
    await this.augur.contracts.createOrder.publicCreateOrder(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, NULL_ADDRESS);
    return orderId;
  }

  public async fillOrder(orderId: string, cost: BigNumber, numShares: BigNumber, tradeGroupId: string) {
    await this.faucet(cost.multipliedBy(10000));
    await this.augur.contracts.fillOrder.publicFillOrder(orderId, numShares, stringTo32ByteHex(tradeGroupId), false, NULL_ADDRESS);
  }

  public async takeBestOrder(marketAddress: string, type: BigNumber, numShares: BigNumber, price: BigNumber, outcome: BigNumber, tradeGroupID: string): Promise<void> {
    const cost = numShares.multipliedBy(price);
    await this.faucet(cost);
    const bestPriceAmount = await this.augur.contracts.trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), false, NULL_ADDRESS, NULL_ADDRESS);
    if (bestPriceAmount === new BigNumber(0)) {
      throw new Error("Could not take best Order");
    }

    await this.augur.contracts.trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), false, NULL_ADDRESS, NULL_ADDRESS);
  }

  public async cancelOrder(orderID: string): Promise<void> {
    await this.augur.contracts.cancelOrder.cancelOrder(orderID);
  }

  public async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const price = params.direction == 0 ? params.displayPrice : params.numTicks.minus(params.displayPrice);
    const cost = params.displayAmount.multipliedBy(price).multipliedBy(10**18);
    await this.faucet(cost);
    await this.augur.trade.placeTrade(params);
  }

  public async placeBasicYesNoTrade(direction: 0 | 1, market: ContractInterfaces.Market, outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, displayAmount: BigNumber, displayPrice: BigNumber, displayShares: BigNumber): Promise<void> {
    await this.placeTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: <3 | 4 | 5 | 6 | 7 | 8><unknown>await market.getNumberOfOutcomes_(),
      outcome,
      tradeGroupId: stringTo32ByteHex("42"),
      ignoreShares: false,
      affiliateAddress: NULL_ADDRESS,
      kycToken: NULL_ADDRESS,
      doNotCreateOrders: false,
      minPrice: new BigNumber(0),
      maxPrice: new BigNumber(10**18),
      displayAmount,
      displayPrice,
      displayShares,
      onSuccess: function (r) { console.log(`SUCCESS: ${JSON.stringify(r)}`); },
      onFailed: function (r) { console.log(`FAIL: ${r}`); },
      onSent: function (r) { console.log(`SENT: ${JSON.stringify(r)}`); },
    });
  }

  public async claimTradingProceeds(market: ContractInterfaces.Market, shareholder: string): Promise<void> {
    await this.augur.contracts.claimTradingProceeds.claimTradingProceeds(market.address, shareholder);
  }

  public async getOrderPrice(orderID: string): Promise<BigNumber> {
    const price = await this.augur.contracts.orders.getPrice_(orderID);
    if (price.toNumber() === 0) {
      throw new Error("Unable to get order price");
    }
    return price;
  }

  public getOrderAmount(orderID: string): Promise<BigNumber> {
    return this.augur.contracts.orders.getAmount_(orderID);
  }

  public async getBestOrderId(type: BigNumber, market: string, outcome: BigNumber): Promise<string> {
    const orderID = await this.augur.contracts.orders.getBestOrderId_(type, market, outcome, NULL_ADDRESS);
    if (!orderID) {
      throw new Error("Unable to get order price");
    }
    return orderID;
  }

  public async buyCompleteSets(market: ContractInterfaces.Market, amount: BigNumber): Promise<void> {
    const numTicks = await market.getNumTicks_();
    const cashValue = amount.multipliedBy(numTicks);
    await this.faucet(cashValue);
    await this.augur.contracts.completeSets.publicBuyCompleteSets(market.address, amount);
  }

  public async sellCompleteSets(market: ContractInterfaces.Market, amount: BigNumber): Promise<void> {
    await this.augur.contracts.completeSets.publicSellCompleteSets(market.address, amount);
  }

  public async contribute(market: ContractInterfaces.Market, payoutNumerators: Array<BigNumber>, amount: BigNumber): Promise<void> {
    await market.contribute(payoutNumerators, amount, "");
  }

  public async getRemainingToFill(market: ContractInterfaces.Market, payoutNumerators: Array<BigNumber>): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const crowdsourcerAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    const crowdsourcer = this.augur.contracts.getReportingParticipant(crowdsourcerAddress);
    return crowdsourcer.getRemainingToFill_();
  }

  public async derivePayoutDistributionHash(market: ContractInterfaces.Market, payoutNumerators: Array<BigNumber>): Promise<string> {
    return market.derivePayoutDistributionHash_(payoutNumerators);
  }

  public async isForking(): Promise<boolean> {
    return this.augur.contracts.universe.isForking_();
  }

  public migrateOutByPayout(reputationToken: ContractInterfaces.ReputationToken, payoutNumerators: Array<BigNumber>, attotokens: BigNumber) {
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  public async getNumSharesInMarket(market: ContractInterfaces.Market, outcome: BigNumber): Promise<BigNumber> {
    const shareTokenAddress = await market.getShareToken_(outcome);
    const shareToken = this.augur.contracts.shareTokenFromAddress(shareTokenAddress);
    return shareToken.balanceOf_(this.account);
  }

  public async getDisputeWindow(market: ContractInterfaces.Market): Promise<ContractInterfaces.DisputeWindow> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    return this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
  }

  public async getDisputeWindowEndTime(market: ContractInterfaces.Market): Promise<BigNumber> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
    return disputeWindow.getEndTime_();
  }

  public async getWinningReportingParticipant(market: ContractInterfaces.Market): Promise<ContractInterfaces.DisputeCrowdsourcer> {
    const reportingParticipantAddress = await market.getWinningReportingParticipant_();
    return this.augur.contracts.getReportingParticipant(reportingParticipantAddress);
  }

  public async getUniverse(market: ContractInterfaces.Market): Promise<ContractInterfaces.Universe> {
    const universeAddress = await market.getUniverse_();
    return this.augur.contracts.universeFromAddress(universeAddress);
  }

  public async setTimestamp(timestamp: BigNumber): Promise<void> {
    const time = this.augur.contracts.getTime();

    if (this.augur.contracts.isTimeControlled(time)) {
      await time.setTimestamp(timestamp);
    } else {
      throw Error("Cannot set timestamp because Time contract is not TimeControlled");
    }
  }

  public async getTimestamp(): Promise<BigNumber> {
    return this.augur.contracts.augur.getTimestamp_();
  }

  public async doInitialReport(market: ContractInterfaces.Market, payoutNumerators: Array<BigNumber>): Promise<void> {
    await market.doInitialReport(payoutNumerators, "");
  }

  public async getInitialReporterStake(market: ContractInterfaces.Market, payoutNumerators: Array<BigNumber>): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const initialReporterAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    const initialReporter = this.augur.contracts.getReportingParticipant(initialReporterAddress);
    return initialReporter.getStake_();
  }

  public async finalizeMarket(market: ContractInterfaces.Market): Promise<void> {
    await market.finalize();
  }

  public async faucet(attoCash: BigNumber): Promise<void> {
    await this.augur.contracts.cash.faucet(attoCash);
  }

  public async approve(wei: BigNumber): Promise<void> {
    await  this.augur.contracts.cash.approve(this.augur.addresses.Augur, wei);
  }

  public getLegacyRepBalance(owner: string): Promise<BigNumber> {
    return this.augur.contracts.legacyReputationToken.balanceOf_(owner);
  }

  public getLegacyRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.legacyReputationToken.allowance_(owner, spender);
  }

  public async transferLegacyRep(to: string, amount: BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.transfer(to, amount);
  }

  public async approveLegacyRep(spender: string, amount: BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.approve(spender, amount);
  }

  public async getChildUniverseReputationToken(parentPayoutDistributionHash: string) {
    const childUniverseAddress = await this.augur.contracts.universe!.getChildUniverse_(parentPayoutDistributionHash);
    const childUniverse = this.augur.contracts.universeFromAddress(childUniverseAddress);
    const repContractAddress = await childUniverse.getReputationToken_();
    return this.augur.contracts.reputationTokenFromAddress(repContractAddress, this.augur.networkId);
  }

  // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
  public async getEthBalance(): Promise<BigNumber> {
    const balance = await this.provider.getBalance(this.account);
    return new BigNumber(balance.toString());
  }

  public getRepBalance(owner: string=this.account): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().balanceOf_(owner);
  }

  public getCashBalance(owner: string=this.account): Promise<BigNumber> {
    return this.augur.contracts.cash.balanceOf_(owner);
  }

  public getRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().allowance_(owner, spender);
  }

  public async approveAugurEternalApprovalValue(owner: string) {
    const spender = this.augur.addresses.Augur;
    const allowance = new BigNumber(await this.augur.contracts.cash.allowance_(owner, spender));

    if (!allowance.eq(ETERNAL_APPROVAL_VALUE)) {
      await this.augur.contracts.cash.approve(spender, ETERNAL_APPROVAL_VALUE, { sender: this.account });
    }
  }
}
