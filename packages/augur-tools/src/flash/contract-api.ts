import { Augur, PlaceTradeDisplayParams, SimulateTradeData } from "@augurproject/sdk";
import { ContractInterfaces } from "@augurproject/core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { AccountList, makeDependencies, makeSigner } from "./ganache";
import { ContractAddresses } from "@augurproject/artifacts";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const ETERNAL_APPROVAL_VALUE = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); // 2^256 - 1

export class ContractAPI {
  static async userWrapper(accounts: AccountList, accountIndex: number, provider: EthersProvider, addresses: ContractAddresses) {
    const account = accounts[accountIndex];

    const signer = await makeSigner(account, provider);
    const dependencies = makeDependencies(account, provider, signer);
    const augur = await Augur.create(provider, dependencies, addresses);

    return new ContractAPI(augur, provider, account.publicKey);
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    public account: string // address
  ) {}

  async approveCentralAuthority(): Promise<void> {
    const authority = this.augur.addresses.Augur;
    await this.augur.contracts.cash.approve(authority, new BigNumber(2).pow(256).minus(new BigNumber(1)));
  }

  async createYesNoMarket(
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
    const byteTopic = ethers.utils.formatBytes32String(topic);

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

  async createReasonableYesNoMarket(universe: ContractInterfaces.Universe): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const endTime = new BigNumber(currentTimestamp + 30 * 24 * 60 * 60);
    const fee = new BigNumber(10).pow(16);
    const affiliateFeeDivisor = new BigNumber(25);
    return this.createYesNoMarket(universe, endTime, fee, affiliateFeeDivisor, this.account, " ", "{\"description\": \"description\"}");
  }

  async createCategoricalMarket(universe: ContractInterfaces.Universe, endTime: BigNumber, feePerCashInAttoCash: BigNumber, affiliateFeeDivisor: BigNumber, designatedReporter: string, outcomes: string[], topic: string, extraInfo: string): Promise<ContractInterfaces.Market> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();
    await this.faucet(marketCreationFee);
    const byteTopic = ethers.utils.formatBytes32String(topic);
    outcomes = outcomes.map(ethers.utils.formatBytes32String);

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

  async createReasonableMarket(universe: ContractInterfaces.Universe, outcomes: string[]): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const endTime = new BigNumber(currentTimestamp + 30 * 24 * 60 * 60);
    const fee = new BigNumber(10).pow(16);
    const affiliateFeeDivisor = new BigNumber(25);
    return this.createCategoricalMarket(universe, endTime, fee, affiliateFeeDivisor, this.account, outcomes, " ", "{\"description\": \"description\"}");
  }

  async createScalarMarket(
    universe: ContractInterfaces.Universe,
    endTime: BigNumber,
    feePerCashInAttoCash: BigNumber,
    affiliateFeeDivisor: BigNumber,
    designatedReporter: string,
    prices: BigNumber[],
    numTicks: BigNumber,
    topic: string,
    extraInfo: string
    ): Promise<ContractInterfaces.Market> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();
    await this.faucet(marketCreationFee);
    const byteTopic = ethers.utils.formatBytes32String(topic);

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

  async createReasonableScalarMarket(universe: ContractInterfaces.Universe): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const endTime = new BigNumber(currentTimestamp + 30 * 24 * 60 * 60);
    const fee = new BigNumber(10).pow(16);
    const affiliateFeeDivisor = new BigNumber(25);
    const minPrice = new BigNumber(50).multipliedBy(new BigNumber(10).pow(18));
    const maxPrice = new BigNumber(250).multipliedBy(new BigNumber(10).pow(18));
    const numTicks = new BigNumber(20000);
    return this.createScalarMarket(universe, endTime, fee, affiliateFeeDivisor, this.account, [minPrice, maxPrice], numTicks, " ", "{\"description\": \"description\", \"_scalarDenomination\": \"scalar denom 1\"}");
  }

  async placeOrder(
    market: string,
    type: BigNumber,
    numShares: BigNumber,
    price: BigNumber,
    outcome: BigNumber,
    betterOrderID: string,
    worseOrderID: string,
    tradeGroupID: string
  ): Promise<string> {
    const cost = numShares.multipliedBy(price);
    await this.faucet(cost);
    const orderId = await this.augur.contracts.createOrder.publicCreateOrder_(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, NULL_ADDRESS);
    console.log("orderId", orderId);
    await this.augur.contracts.createOrder.publicCreateOrder(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, NULL_ADDRESS);
    return orderId;
  }

  async fillOrder(orderId: string, cost: BigNumber, numShares: BigNumber, tradeGroupId: string) {
    await this.faucet(cost.multipliedBy(10000));
    await this.augur.contracts.fillOrder.publicFillOrder(orderId, numShares, ethers.utils.formatBytes32String(tradeGroupId), false, NULL_ADDRESS);
  }

  async setOrderPrice(orderId: string, price: BigNumber, betterOrderId: string, worseOrderId: string): Promise<void> {
    await this.augur.contracts.orders.setOrderPrice(orderId, price, betterOrderId, worseOrderId);
  }

  async takeBestOrder(marketAddress: string, type: BigNumber, numShares: BigNumber, price: BigNumber, outcome: BigNumber, tradeGroupID: string): Promise<void> {
    const cost = numShares.multipliedBy(price);
    await this.faucet(cost);
    const bestPriceAmount = await this.augur.contracts.trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), false, NULL_ADDRESS, NULL_ADDRESS);
    if (bestPriceAmount === new BigNumber(0)) {
      throw new Error("Could not take best Order");
    }

    await this.augur.contracts.trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), false, NULL_ADDRESS, NULL_ADDRESS);
  }

  async cancelOrder(orderID: string): Promise<void> {
    await this.augur.contracts.cancelOrder.cancelOrder(orderID);
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const price = params.direction === 0 ? params.displayPrice : params.numTicks.minus(params.displayPrice);
    const cost = params.displayAmount.multipliedBy(price).multipliedBy(10**18);
    await this.faucet(cost);
    await this.augur.trade.placeTrade(params);
  }

  async simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    return this.augur.trade.simulateTrade(params);
  }

  async placeBasicYesNoTrade(direction: 0 | 1, market: ContractInterfaces.Market, outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, displayAmount: BigNumber, displayPrice: BigNumber, displayShares: BigNumber): Promise<void> {
    await this.placeTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: await market.getNumberOfOutcomes_() as unknown as 3 | 4 | 5 | 6 | 7 | 8,
      outcome,
      tradeGroupId: ethers.utils.formatBytes32String("42"),
      ignoreShares: false,
      affiliateAddress: NULL_ADDRESS,
      kycToken: NULL_ADDRESS,
      doNotCreateOrders: false,
      minPrice: new BigNumber(0),
      maxPrice: new BigNumber(10**18),
      displayAmount,
      displayPrice,
      displayShares,
    });
  }

  async simulateBasicYesNoTrade(direction: 0 | 1, market: ContractInterfaces.Market, outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, displayAmount: BigNumber, displayPrice: BigNumber, displayShares: BigNumber): Promise<SimulateTradeData> {
    return this.simulateTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: await market.getNumberOfOutcomes_() as unknown as 3 | 4 | 5 | 6 | 7 | 8,
      outcome,
      tradeGroupId: ethers.utils.formatBytes32String("42"),
      ignoreShares: false,
      affiliateAddress: NULL_ADDRESS,
      kycToken: NULL_ADDRESS,
      doNotCreateOrders: false,
      minPrice: new BigNumber(0),
      maxPrice: new BigNumber(10**18),
      displayAmount,
      displayPrice,
      displayShares,
    });
  }

  async claimTradingProceeds(market: ContractInterfaces.Market, shareholder: string): Promise<void> {
    await this.augur.contracts.claimTradingProceeds.claimTradingProceeds(market.address, shareholder);
  }

  async getOrderPrice(orderID: string): Promise<BigNumber> {
    const price = await this.augur.contracts.orders.getPrice_(orderID);
    if (price.toNumber() === 0) {
      throw new Error("Unable to get order price");
    }
    return price;
  }

  getOrderAmount(orderID: string): Promise<BigNumber> {
    return this.augur.contracts.orders.getAmount_(orderID);
  }

  async getBestOrderId(type: BigNumber, market: string, outcome: BigNumber): Promise<string> {
    const orderID = await this.augur.contracts.orders.getBestOrderId_(type, market, outcome, NULL_ADDRESS);
    if (!orderID) {
      throw new Error("Unable to get order price");
    }
    return orderID;
  }

  async buyCompleteSets(market: ContractInterfaces.Market, amount: BigNumber): Promise<void> {
    const numTicks = await market.getNumTicks_();
    const cashValue = amount.multipliedBy(numTicks);
    await this.faucet(cashValue);
    await this.augur.contracts.completeSets.publicBuyCompleteSets(market.address, amount);
  }

  async sellCompleteSets(market: ContractInterfaces.Market, amount: BigNumber): Promise<void> {
    await this.augur.contracts.completeSets.publicSellCompleteSets(market.address, amount);
  }

  async contribute(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], amount: BigNumber): Promise<void> {
    await market.contribute(payoutNumerators, amount, "");
  }

  // TODO Update this to handle case where crowdsourcer is 0 address (hasn't gotten any contributions)
  async getRemainingToFill(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const crowdsourcerAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    const crowdsourcer = this.augur.contracts.getReportingParticipant(crowdsourcerAddress);
    return crowdsourcer.getRemainingToFill_();
  }

  async derivePayoutDistributionHash(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<string> {
    return market.derivePayoutDistributionHash_(payoutNumerators);
  }

  async isForking(): Promise<boolean> {
    return this.augur.contracts.universe.isForking_();
  }

  migrateOutByPayout(reputationToken: ContractInterfaces.ReputationToken, payoutNumerators: BigNumber[], attotokens: BigNumber) {
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  async getNumSharesInMarket(market: ContractInterfaces.Market, outcome: BigNumber): Promise<BigNumber> {
    const shareTokenAddress = await market.getShareToken_(outcome);
    const shareToken = this.augur.contracts.shareTokenFromAddress(shareTokenAddress);
    return shareToken.balanceOf_(this.account);
  }

  async getDisputeWindow(market: ContractInterfaces.Market): Promise<ContractInterfaces.DisputeWindow> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    return this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
  }

  async getDisputeWindowEndTime(market: ContractInterfaces.Market): Promise<BigNumber> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
    return disputeWindow.getEndTime_();
  }

  async getInitialReporter(market: ContractInterfaces.Market): Promise<ContractInterfaces.InitialReporter> {
    const initialReporterAddress = await market.getInitialReporter_();
    return this.augur.contracts.getInitialReporter(initialReporterAddress);
  }

  async getWinningReportingParticipant(market: ContractInterfaces.Market): Promise<ContractInterfaces.DisputeCrowdsourcer> {
    const reportingParticipantAddress = await market.getWinningReportingParticipant_();
    return this.augur.contracts.getReportingParticipant(reportingParticipantAddress);
  }

  async buyParticipationTokens(disputeWindowAddress: string, amount: BigNumber, sender: string=this.account): Promise<void> {
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
    await disputeWindow.buy(amount, {sender});
  }

  async redeemParticipationTokens(disputeWindowAddress: string, account: string=this.account): Promise<void> {
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
    await disputeWindow.redeem(account);
  }

  async getUniverse(market: ContractInterfaces.Market): Promise<ContractInterfaces.Universe> {
    const universeAddress = await market.getUniverse_();
    return this.augur.contracts.universeFromAddress(universeAddress);
  }

  async setTimestamp(timestamp: BigNumber): Promise<void> {
    const time = this.augur.contracts.getTime();

    if (this.augur.contracts.isTimeControlled(time)) {
      await time.setTimestamp(timestamp);
    } else {
      throw Error("Cannot set timestamp because Time contract is not TimeControlled");
    }
  }

  async getTimestamp(): Promise<BigNumber> {
    return this.augur.contracts.augur.getTimestamp_();
  }

  async doInitialReport(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<void> {
    await market.doInitialReport(payoutNumerators, "");
  }

  async getInitialReporterStake(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const initialReporterAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    const initialReporter = this.augur.contracts.getInitialReporter(initialReporterAddress);
    return initialReporter.getStake_();
  }

  async finalizeMarket(market: ContractInterfaces.Market): Promise<void> {
    await market.finalize();
  }

  async faucet(attoCash: BigNumber): Promise<void> {
    await this.augur.contracts.cash.faucet(attoCash);
  }

  async approve(wei: BigNumber): Promise<void> {
    await  this.augur.contracts.cash.approve(this.augur.addresses.Augur, wei);
  }

  getLegacyRepBalance(owner: string): Promise<BigNumber> {
    return this.augur.contracts.legacyReputationToken.balanceOf_(owner);
  }

  getLegacyRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.legacyReputationToken.allowance_(owner, spender);
  }

  async transferLegacyRep(to: string, amount: BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.transfer(to, amount);
  }

  async approveLegacyRep(spender: string, amount: BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.approve(spender, amount);
  }

  async getChildUniverseReputationToken(parentPayoutDistributionHash: string) {
    const childUniverseAddress = await this.augur.contracts.universe!.getChildUniverse_(parentPayoutDistributionHash);
    const childUniverse = this.augur.contracts.universeFromAddress(childUniverseAddress);
    const repContractAddress = await childUniverse.getReputationToken_();
    return this.augur.contracts.reputationTokenFromAddress(repContractAddress, this.augur.networkId);
  }

  // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
  async getEthBalance(): Promise<BigNumber> {
    const balance = await this.provider.getBalance(this.account);
    return new BigNumber(balance.toString());
  }

  getRepBalance(owner: string=this.account): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().balanceOf_(owner);
  }

  getCashBalance(owner: string=this.account): Promise<BigNumber> {
    return this.augur.contracts.cash.balanceOf_(owner);
  }

  getRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().allowance_(owner, spender);
  }

  async approveAugurEternalApprovalValue(owner: string) {
    const spender = this.augur.addresses.Augur;
    const allowance = new BigNumber(await this.augur.contracts.cash.allowance_(owner, spender));

    if (!allowance.eq(ETERNAL_APPROVAL_VALUE)) {
      await this.augur.contracts.cash.approve(spender, ETERNAL_APPROVAL_VALUE, { sender: this.account });
    }
  }
}
