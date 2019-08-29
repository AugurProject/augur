import {
  Augur,
  Connectors,
  Getters,
  PlaceTradeDisplayParams,
  SimulateTradeData,
  CreateScalarMarketParams,
  CreateYesNoMarketParams,
  CreateCategoricalMarketParams,
} from '@augurproject/sdk';
import { ContractInterfaces } from '@augurproject/core';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { makeGnosisDependencies, makeSigner } from './blockchain';
import { Account } from '../constants';
import { ContractAddresses } from '@augurproject/artifacts';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { IGnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis/build';


const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const ETERNAL_APPROVAL_VALUE = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); // 2^256 - 1

export class ContractAPI {
  static async userWrapper(account: Account, provider: EthersProvider, addresses: ContractAddresses, connector: Connectors.SEOConnector = undefined, gnosisRelay: IGnosisRelayAPI = undefined) {
    const signer = await makeSigner(account, provider);
    const dependencies = makeGnosisDependencies(provider, gnosisRelay, signer, NULL_ADDRESS, new BigNumber(0), null, account.publicKey);
    const augur = await Augur.create(provider, dependencies, addresses, connector, gnosisRelay, true);

    return new ContractAPI(augur, provider, dependencies, account);
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    readonly dependencies: ContractDependenciesGnosis,
    public account: Account
  ) {}

  async approveCentralAuthority(): Promise<void> {
    const authority = this.augur.addresses.Augur;
    await this.augur.contracts.cash.approve(authority, new BigNumber(2).pow(256).minus(new BigNumber(1)));
  }

  async createYesNoMarket(params: CreateYesNoMarketParams): Promise<ContractInterfaces.Market> {
    await this.marketFauceting();
    return this.augur.createYesNoMarket(params);
  }

  async createCategoricalMarket(params: CreateCategoricalMarketParams): Promise<ContractInterfaces.Market> {
    await this.marketFauceting();
    return this.augur.createCategoricalMarket(params);
  }

  async createScalarMarket(params: CreateScalarMarketParams): Promise<ContractInterfaces.Market> {
    await this.marketFauceting();
    return this.augur.createScalarMarket(params);
  }

  async marketFauceting() {
    const marketCreationFee = await this.augur.contracts.universe.getOrCacheValidityBond_();
    const repBond = await this.augur.contracts.universe.getOrCacheMarketRepBond_();
    await this.faucet(marketCreationFee);
    await this.repFaucet(repBond);
  }

  async createReasonableYesNoMarket(): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();

    return this.createYesNoMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(10).pow(16),
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter: this.account.publicKey,
      extraInfo: JSON.stringify({
        categories: ['flash', 'Reasonable', 'YesNo'],
        description: 'description',
      }),
    });
  }

  async createReasonableMarket(outcomes: string[]): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();

    return this.createCategoricalMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(10).pow(16),
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter: this.account.publicKey,
      extraInfo: JSON.stringify({
        categories: ['flash', 'Reasonable', 'Categorical'],
        description: 'description',
      }),
      outcomes,
    });
  }

  async createReasonableScalarMarket(): Promise<ContractInterfaces.Market> {
    const time = this.augur.contracts.getTime();
    const currentTimestamp = (await time.getTimestamp_()).toNumber();
    const minPrice = new BigNumber(50).multipliedBy(new BigNumber(10).pow(18));
    const maxPrice = new BigNumber(250).multipliedBy(new BigNumber(10).pow(18));

    return this.createScalarMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(10).pow(16),
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter: this.account.publicKey,
      extraInfo: JSON.stringify({
        categories: ['flash', 'Reasonable', 'Scalar'],
        description: 'description',
        _scalarDenomination: 'scalar denom 1',
      }),
      numTicks: new BigNumber(20000),
      prices: [minPrice, maxPrice],
    });
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

    if (type.isEqualTo(0)) { // BID
      const cost = numShares.multipliedBy(price);
      await this.faucet(cost);
    } else if (type.isEqualTo(1)) { // ASK
      const m = await this.getMarketContract(market);
      const numTicks = await m.getNumTicks_();
      const cost = numTicks.plus(price.multipliedBy(-1)).multipliedBy(numShares);
      await this.faucet(cost);
    } else {
      throw Error(`Invalid order type ${type.toString()}`);
    }

    const events = await this.augur.contracts.createOrder.publicCreateOrder(
      type,
      numShares,
      price,
      market,
      outcome,
      betterOrderID,
      worseOrderID,
      tradeGroupID,
      NULL_ADDRESS
    );

    let orderId = '';
    for (const ev of events) {
      if (ev.name === 'OrderEvent') {
        interface HasOrderId {
          orderId: string;
        }
        orderId = (ev.parameters as HasOrderId).orderId;
      }
    }

    return orderId;
  }

  async simplePlaceOrder(
    market: string,
    type: BigNumber,
    numShares: BigNumber,
    price: BigNumber,
    outcome: BigNumber): Promise<string> {
    return this.placeOrder(market, type, numShares, price, outcome, formatBytes32String(''), formatBytes32String(''), formatBytes32String('42'));
  }

  async fillOrder(orderId: string, numShares: BigNumber, tradeGroupId: string, cost?: BigNumber) {
    if (cost) {
      await this.faucet(cost);
    }
    await this.augur.contracts.fillOrder.publicFillOrder(orderId, numShares, formatBytes32String(tradeGroupId), NULL_ADDRESS);
  }

  async takeBestOrder(marketAddress: string, type: BigNumber, numShares: BigNumber, price: BigNumber, outcome: BigNumber, tradeGroupID: string): Promise<void> {
    const cost = numShares.multipliedBy(price);
    await this.faucet(cost);
    const bestPriceAmount = await this.augur.contracts.trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), NULL_ADDRESS, NULL_ADDRESS);
    if (bestPriceAmount === new BigNumber(0)) {
      throw new Error('Could not take best Order');
    }

    await this.augur.contracts.trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), NULL_ADDRESS, NULL_ADDRESS);
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
      tradeGroupId: formatBytes32String('42'),
      affiliateAddress: NULL_ADDRESS,
      kycToken: NULL_ADDRESS,
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
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
      tradeGroupId: formatBytes32String('42'),
      affiliateAddress: NULL_ADDRESS,
      kycToken: NULL_ADDRESS,
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount,
      displayPrice,
      displayShares,
    });
  }

  async claimTradingProceeds(market: ContractInterfaces.Market, shareholder: string, affiliateAddress = '0x0000000000000000000000000000000000000000'): Promise<void> {
    await this.augur.contracts.claimTradingProceeds.claimTradingProceeds(market.address, shareholder, affiliateAddress);
  }

  async getOrderPrice(orderID: string): Promise<BigNumber> {
    const price = await this.augur.contracts.orders.getPrice_(orderID);
    if (price.toNumber() === 0) {
      throw new Error('Unable to get order price');
    }
    return price;
  }

  getOrderAmount(orderID: string): Promise<BigNumber> {
    return this.augur.contracts.orders.getAmount_(orderID);
  }

  async getBestOrderId(type: BigNumber, market: string, outcome: BigNumber): Promise<string> {
    const orderID = await this.augur.contracts.orders.getBestOrderId_(type, market, outcome, NULL_ADDRESS);
    if (!orderID) {
      throw new Error('Unable to get order price');
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

  async contribute(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], amount: BigNumber, description = ''): Promise<void> {
    await this.repFaucet(amount.times(1e9)); // make sure you have the REP you're trying to contribute
    await market.contribute(payoutNumerators, amount, description);
  }

  async contributeToTentative(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], amount: BigNumber, description = ''): Promise<void> {
    await market.contributeToTentative(payoutNumerators, amount, description);
  }

  // TODO Update this to handle case where crowdsourcer is 0 address (hasn't gotten any contributions)
  async getRemainingToFill(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const crowdsourcerAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    const crowdsourcer = this.augur.contracts.getReportingParticipant(crowdsourcerAddress);
    return crowdsourcer.getRemainingToFill_();
  }

  async getCrowdsourcerDisputeBond(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const crowdsourcerAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    if (crowdsourcerAddress === '0') {
      const totalStake = await market.getParticipantStake_();
      return totalStake.times(2);
    }
    const crowdsourcer = this.augur.contracts.getReportingParticipant(crowdsourcerAddress);
    const remaining = await crowdsourcer.getRemainingToFill_();
    return remaining;
  }

  async derivePayoutDistributionHash(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<string> {
    return market.derivePayoutDistributionHash_(payoutNumerators);
  }

  async isForking(): Promise<boolean> {
    return this.augur.contracts.universe.isForking_();
  }

  async getDisputeThresholdForFork_(): Promise<BigNumber> {
    return this.augur.contracts.universe.getDisputeThresholdForFork_();
  }

  async getDisputeThresholdForDisputePacing(): Promise<BigNumber> {
    return this.augur.contracts.universe.getDisputeThresholdForDisputePacing_();
  }

  async getInitialReportMinValue(): Promise<BigNumber> {
    return this.augur.contracts.universe.  getInitialReportMinValue_();
  }

  migrateOutByPayout(reputationToken: ContractInterfaces.ReputationToken, payoutNumerators: BigNumber[], attotokens: BigNumber) {
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  async getNumSharesInMarket(market: ContractInterfaces.Market, outcome: BigNumber): Promise<BigNumber> {
    const shareTokenAddress = await market.getShareToken_(outcome);
    const shareToken = this.augur.contracts.shareTokenFromAddress(shareTokenAddress);
    return shareToken.balanceOf_(this.account.publicKey);
  }

  async getOrCreateCurrentDisputeWindow(initial = false): Promise<string> {
    // Must make 2 calls because the first call is necessary but doesn't always return the dispute window.
    await this.augur.contracts.universe.getOrCreateCurrentDisputeWindow(initial);
    return this.augur.contracts.universe.getOrCreateCurrentDisputeWindow_(initial);
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

  async buyParticipationTokens(disputeWindowAddress: string, amount: BigNumber, sender: string=this.account.publicKey): Promise<void> {
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
    await disputeWindow.buy(amount, {sender});
  }

  async redeemParticipationTokens(disputeWindowAddress: string, account: string=this.account.publicKey): Promise<void> {
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
      throw Error('Cannot set timestamp because Time contract is not TimeControlled');
    }
  }

  async getTimestamp(): Promise<BigNumber> {
    return this.augur.contracts.augur.getTimestamp_();
  }

  async doInitialReport(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], description = '', extraStake = '0'): Promise<void> {
    await market.doInitialReport(payoutNumerators, description, new BigNumber(extraStake));
  }

  async getMarketContract(address: string): Promise<ContractInterfaces.Market> {
    return this.augur.getMarket(address);
  }

  async getMarketInfo(address: string): Promise<Getters.Markets.MarketInfo[]> {
    return this.augur.getMarketsInfo({marketIds: [address]});
  }

  async getMarkets(): Promise<Getters.Markets.MarketList> {
    const universe = this.augur.contracts.universe.address;
    return this.augur.getMarkets({universe});
  }

  async getInitialReporterStake(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const initialReporterAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    const initialReporter = this.augur.contracts.getInitialReporter(initialReporterAddress);
    return initialReporter.getStake_();
  }

  async getParticipantStake(market: ContractInterfaces.Market): Promise<BigNumber> {
    return market.getParticipantStake_();
  }

  async finalizeMarket(market: ContractInterfaces.Market): Promise<void> {
    await market.finalize();
  }

  async faucet(attoCash: BigNumber): Promise<void> {
    await this.augur.contracts.cash.faucet(attoCash);
  }

  async repFaucet(attoRep: BigNumber): Promise<void> {
    const reputationToken = this.augur.contracts.getReputationToken();
    if (typeof reputationToken['faucet'] === 'function') {
      await reputationToken['faucet'](attoRep);
    }else {
      throw Error('Cannot faucet REP with non-test version of REP contract.');
    }
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
    const balance = await this.provider.getBalance(this.account.publicKey);
    return new BigNumber(balance.toString());
  }

  getRepBalance(owner: string=this.account.publicKey): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().balanceOf_(owner);
  }

  getCashBalance(owner: string=this.account.publicKey): Promise<BigNumber> {
    return this.augur.contracts.cash.balanceOf_(owner);
  }

  getRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().allowance_(owner, spender);
  }

  setGnosisSafeAddress(safeAddress: string): void {
    this.augur.setGnosisSafeAddress(safeAddress);
  }

  setUseGnosisSafe(useSafe: boolean): void {
    this.augur.setUseGnosisSafe(useSafe);
  }

  setUseGnosisRelay(useRelay: boolean): void {
    this.augur.setUseGnosisRelay(useRelay);
  }

  async approveAugurEternalApprovalValue(owner: string) {
    const spender = this.augur.addresses.Augur;
    const allowance = new BigNumber(await this.augur.contracts.cash.allowance_(owner, spender));

    if (!allowance.eq(ETERNAL_APPROVAL_VALUE)) {
      await this.augur.contracts.cash.approve(spender, ETERNAL_APPROVAL_VALUE, { sender: this.account.publicKey });
    }
  }

  async getGnosisSafeAddress(paymentToken: string, payment: BigNumber): Promise<string> {
    const params = {
      paymentToken,
      payment,
      owner: this.account.publicKey,
    };
    return this.augur.gnosis.getGnosisSafeAddress(params);
  }

  async createGnosisSafeDirectlyWithETH(paymentToken: string, payment: BigNumber): Promise<ContractInterfaces.GnosisSafe> {
    const params = {
      paymentToken,
      payment,
      owner: this.account.publicKey,
    };
    const address = await this.augur.gnosis.createGnosisSafeDirectlyWithETH(params);
    return this.augur.contracts.gnosisSafeFromAddress(address);
  }

  async createGnosisSafeViaRelay(paymentToken: string, payment: BigNumber): Promise<string> {
    const params = {
      paymentToken,
      payment,
      owner: this.account.publicKey,
    };
    return this.augur.gnosis.createGnosisSafeViaRelay(params);
  }

  async getGnosisSafeDeploymentStatusViaRelay(safeAddress: string): Promise<boolean> {
    return this.augur.gnosis.getGnosisSafeDeploymentStatusViaRelay(safeAddress);
  }
}
