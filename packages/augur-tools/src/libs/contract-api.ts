import { WSClient } from '@0x/mesh-rpc-client';
import { ContractInterfaces } from '@augurproject/core';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  GnosisSafeState,
  GnosisSafeStateReponse,
  IGnosisRelayAPI,
  SafeResponse,
} from '@augurproject/gnosis-relay-api';
import {
  Augur,
  BrowserMesh,
  Connectors,
  CreateCategoricalMarketParams,
  CreateScalarMarketParams,
  CreateYesNoMarketParams,
  DisputeWindow,
  EmptyConnector,
  Getters,
  HotLoadMarketInfo,
  PlaceTradeDisplayParams,
  SimulateTradeData,
  WarpSyncData,
  ZeroX,
  ZeroXPlaceTradeDisplayParams,
  ZeroXSimulateTradeData,
} from '@augurproject/sdk';
import { BigNumber } from 'bignumber.js';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { formatBytes32String } from 'ethers/utils';
import { Account } from '../constants';
import { makeGnosisDependencies, makeSigner } from './blockchain';
import { SDKConfiguration } from '@augurproject/artifacts';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const ETERNAL_APPROVAL_VALUE = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); // 2^256 - 1

export class ContractAPI {
  static async userWrapper(
    account: Account,
    provider: EthersProvider,
    config: SDKConfiguration,
    connector: Connectors.BaseConnector = new EmptyConnector(),
    gnosisRelay: IGnosisRelayAPI = undefined,
    meshClient: WSClient = undefined,
    meshBrowser: BrowserMesh = undefined,
  ) {
    const signer = await makeSigner(account, provider);
    const dependencies = makeGnosisDependencies(provider, gnosisRelay, signer, config.addresses.Cash, new BigNumber(0), null, account.publicKey);

    let zeroX = null;
    if (meshClient || meshBrowser) {
      zeroX = new ZeroX();
      zeroX.rpc = meshClient;
    }
    const augur = await Augur.create(provider, dependencies, config, connector, zeroX, true);
    if (zeroX && meshBrowser) {
      zeroX.mesh = meshBrowser;
    }
    return new ContractAPI(augur, provider, dependencies, account);
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    readonly dependencies: ContractDependenciesGnosis,
    public account: Account
  ) {}

  async sendEther(to: string, amount: BigNumber): Promise<void> {
    await this.dependencies.signer.sendTransaction({
      to,
      value: `0x${amount.toString(16)}`,
    })
  }

  async approveCentralAuthority(): Promise<void> {
    const authority = this.augur.config.addresses.Augur;
    await this.augur.contracts.cash.approve(authority, new BigNumber(2).pow(256).minus(new BigNumber(1)));

    const fillOrder = this.augur.config.addresses.FillOrder;
    await this.augur.contracts.cash.approve(fillOrder, new BigNumber(2).pow(256).minus(new BigNumber(1)));
    await this.augur.contracts.shareToken.setApprovalForAll(fillOrder, true);

    const createOrder = this.augur.config.addresses.CreateOrder;
    await this.augur.contracts.cash.approve(createOrder, new BigNumber(2).pow(256).minus(new BigNumber(1)));
    await this.augur.contracts.shareToken.setApprovalForAll(createOrder, true);

    await this.augur.contracts.cash.approve(this.augur.config.addresses.ZeroXTrade, new BigNumber(2).pow(256).minus(new BigNumber(1)));
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

  async getRepBond(): Promise<BigNumber> {
    return this.augur.contracts.universe.getOrCacheMarketRepBond_();
  }

  async marketFauceting() {
    const marketCreationFee = await this.augur.contracts.universe.getOrCacheValidityBond_();
    const repBond = await this.getRepBond();
    await this.faucet(marketCreationFee);
    await this.repFaucet(repBond.plus(10**18));
  }

  async createReasonableYesNoMarket(description = 'YesNo market description'): Promise<ContractInterfaces.Market> {
    const currentTimestamp = (await this.getTimestamp()).toNumber();

    return this.createYesNoMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(10).pow(16),
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter: this.account.publicKey,
      extraInfo: JSON.stringify({
        categories: ['flash', 'Reasonable', 'YesNo'],
        description,
      }),
    });
  }

  async createReasonableMarket(outcomes: string[], description = 'Categorical market description'): Promise<ContractInterfaces.Market> {
    const currentTimestamp = (await this.getTimestamp()).toNumber();

    return this.createCategoricalMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(10).pow(16),
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter: this.account.publicKey,
      extraInfo: JSON.stringify({
        categories: ['flash', 'Reasonable', 'Categorical'],
        description,
      }),
      outcomes,
    });
  }

  async createReasonableScalarMarket(description = 'Scalar market description'): Promise<ContractInterfaces.Market> {
    const currentTimestamp = (await this.getTimestamp()).toNumber();
    const minPrice = new BigNumber(50).multipliedBy(new BigNumber(10).pow(18));
    const maxPrice = new BigNumber(250).multipliedBy(new BigNumber(10).pow(18));

    return this.createScalarMarket({
      endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
      feePerCashInAttoCash: new BigNumber(10).pow(16),
      affiliateFeeDivisor: new BigNumber(25),
      designatedReporter: this.account.publicKey,
      extraInfo: JSON.stringify({
        categories: ['flash', 'Reasonable', 'Scalar'],
        description,
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
      tradeGroupID
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
    await this.augur.contracts.fillOrder.publicFillOrder(orderId, numShares, formatBytes32String(tradeGroupId), formatBytes32String(''));
  }

  async placeZeroXOrder(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
    await this.augur.zeroX.placeOrder(params);
  }

  async placeZeroXOrders(params: ZeroXPlaceTradeDisplayParams[]): Promise<void> {
    await this.augur.zeroX.placeOrders(params);
  }

  async placeZeroXTrade(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
    const price = params.direction === 0 ? params.displayPrice : params.numTicks.minus(params.displayPrice);
    const cost = params.displayAmount.multipliedBy(price).multipliedBy(10**18);
    await this.faucet(cost);
    await this.augur.zeroX.placeTrade(params);
  }

  async placeBasicYesNoZeroXTrade(direction: 0 | 1, market: string, outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, displayAmount: BigNumber, displayPrice: BigNumber, displayShares: BigNumber, expirationTime: BigNumber): Promise<void> {
    await this.placeZeroXTrade({
      direction,
      market,
      numTicks: new BigNumber(100),
      numOutcomes: 3,
      outcome,
      tradeGroupId: formatBytes32String('42'),
      fingerprint: formatBytes32String('11'),
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount,
      displayPrice,
      displayShares,
      expirationTime,
    });
  }

  async takeBestOrder(marketAddress: string, type: BigNumber, numShares: BigNumber, price: BigNumber, outcome: BigNumber, tradeGroupID: string): Promise<void> {
    const cost = numShares.multipliedBy(price);
    await this.faucet(cost);
    const bestPriceAmount = await this.augur.contracts.trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), formatBytes32String(''));
    if (bestPriceAmount === new BigNumber(0)) {
      throw new Error('Could not take best Order');
    }

    await this.augur.contracts.trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new BigNumber(3), formatBytes32String(''));
  }

  async cancelOrder(orderID: string): Promise<void> {
    await this.augur.cancelOrder(orderID);
  }

  async cancelNativeOrder(orderID: string): Promise<void> {
    await this.augur.contracts.cancelOrder.cancelOrder(orderID);
  }

  async placeNativeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const price = params.direction === 0 ? params.displayPrice : params.numTicks.minus(params.displayPrice);
    const cost = params.displayAmount.multipliedBy(price).multipliedBy(10**18);
    await this.faucet(cost);
    await this.augur.trade.placeTrade(params);
  }

  async simulateNativeTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    return this.augur.trade.simulateTrade(params);
  }

  async simulateZeroXTrade(params: ZeroXPlaceTradeDisplayParams): Promise<ZeroXSimulateTradeData> {
    return this.augur.zeroX.simulateTrade(params);
  }

  async placeBasicYesNoTrade(direction: 0 | 1, market: ContractInterfaces.Market, outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, displayAmount: BigNumber, displayPrice: BigNumber, displayShares: BigNumber): Promise<void> {
    await this.placeNativeTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: await market.getNumberOfOutcomes_() as unknown as 3 | 4 | 5 | 6 | 7 | 8,
      outcome,
      tradeGroupId: formatBytes32String('42'),
      fingerprint: formatBytes32String('11'),
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount,
      displayPrice,
      displayShares,
    });
  }

  async simulateBasicYesNoTrade(direction: 0 | 1, market: ContractInterfaces.Market, outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, displayAmount: BigNumber, displayPrice: BigNumber, displayShares: BigNumber): Promise<SimulateTradeData> {
    return this.simulateNativeTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: await market.getNumberOfOutcomes_() as unknown as 3 | 4 | 5 | 6 | 7 | 8,
      outcome,
      tradeGroupId: formatBytes32String('42'),
      fingerprint: formatBytes32String('11'),
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount,
      displayPrice,
      displayShares,
    });
  }

  async simulateBasicZeroXYesNoTrade(
    direction: 0 | 1,
    market: ContractInterfaces.Market,
    outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    displayAmount: BigNumber,
    displayPrice: BigNumber,
    displayShares: BigNumber,
    doNotCreateOrders = false,
  ): Promise<ZeroXSimulateTradeData> {
    return this.simulateZeroXTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: await market.getNumberOfOutcomes_() as unknown as 3 | 4 | 5 | 6 | 7 | 8,
      outcome,
      tradeGroupId: formatBytes32String('42'),
      expirationTime: new BigNumber(Date.now() + 10000000),
      fingerprint: formatBytes32String('11'),
      doNotCreateOrders,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount,
      displayPrice,
      displayShares,
    });
  }

  async claimTradingProceeds(market: ContractInterfaces.Market, shareholder: string, fingerprint = formatBytes32String('11')): Promise<void> {
    await this.augur.contracts.shareToken.claimTradingProceeds(market.address, shareholder, fingerprint);
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
    const orderID = await this.augur.contracts.orders.getBestOrderId_(type, market, outcome);
    if (!orderID) {
      throw new Error('Unable to get order price');
    }
    return orderID;
  }

  async getOrders(marketId: string, orderType: string, outcome: number) {
    return this.augur.getZeroXOrders({
      marketId,
      orderType,
      outcome
    })
  }

  async buyCompleteSets(market: ContractInterfaces.Market, amount: BigNumber): Promise<void> {
    const numTicks = await market.getNumTicks_();
    const cashValue = amount.multipliedBy(numTicks);
    await this.faucet(cashValue);
    await this.augur.contracts.shareToken.publicBuyCompleteSets(market.address, amount);
  }

  async sellCompleteSets(market: ContractInterfaces.Market, amount: BigNumber): Promise<void> {
    await this.augur.contracts.shareToken.publicSellCompleteSets(market.address, amount);
  }

  async contribute(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], amount: BigNumber, description = ''): Promise<void> {
    // Below is to ensure the signer is the account we're using in this instance
    market = this.augur.contracts.marketFromAddress(market.address);
    await market.contribute(payoutNumerators, amount, description);
  }

  async contributeToTentative(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], amount: BigNumber, description = ''): Promise<void> {
    await market.contributeToTentative(payoutNumerators, amount, description);
  }

  async getRemainingToFill(market: ContractInterfaces.Market, payoutNumerators: BigNumber[]): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(market, payoutNumerators);
    const crowdsourcerAddress = await market.getCrowdsourcer_(payoutDistributionHash);
    if (crowdsourcerAddress === NULL_ADDRESS) {
      return new BigNumber(-1);
    }
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

  migrateOutByPayoutNumerators(payoutNumerators: BigNumber[], attotokens: BigNumber) {
    const reputationToken = this.augur.contracts.getReputationToken();
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  async getNumSharesInMarket(market: ContractInterfaces.Market, outcome: BigNumber): Promise<BigNumber> {
    return this.augur.contracts.shareToken.balanceOfMarketOutcome_(market.address, outcome, await this.augur.getAccount());
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
    return (this.augur.contracts.augur.getTimestamp_());
  }

  async doInitialReport(market: ContractInterfaces.Market, payoutNumerators: BigNumber[], description = '', extraStake = '0'): Promise<void> {
    // Below is to ensure the signer is the account we're using in this instance
    market = this.augur.contracts.marketFromAddress(market.address);
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

  async faucet(attoCash: BigNumber, account?: string): Promise<void> {
    const realAccount = await this.augur.getAccount();
    account = account || realAccount;
    let balance = await this.getCashBalance(realAccount);
    const desired = attoCash;
    while (balance.lt(attoCash)) {
      console.log(`CASH FAUCETING FOR ${realAccount}. BALANCE: ${balance}. DESIRED: ${desired}`);
      await this.augur.contracts.cashFaucet.faucet(attoCash);
      balance = await this.getCashBalance(realAccount);
    }
    if (account !== realAccount) {
      await this.augur.contracts.cash.transfer(account, attoCash);
    }
  }

  async faucetOnce(attoCash: BigNumber, account?: string): Promise<void> {
    account = account ||  await this.augur.getAccount();
    await this.augur.contracts.cashFaucet.faucet(attoCash, { sender: account });
  }

  async repFaucet(attoRep: BigNumber, useLegacy = false): Promise<void> {
    const reputationToken = this.augur.contracts.getReputationToken();
    if (useLegacy) {
      await this.augur.contracts.legacyReputationToken.faucet(attoRep);
    } else {
      if (typeof reputationToken['faucet'] === 'function') {
        await reputationToken['faucet'](attoRep);
      } else {
        throw Error('Cannot faucet REP with non-test version of REP contract.');
      }
    }
  }

  async transferCash(to: string, attoCash: BigNumber): Promise<void> {
    await this.augur.contracts.cash.transfer(to, attoCash);
  }

  async addEthExchangeLiquidity(attoCash: BigNumber, attoEth: BigNumber): Promise<void> {
    await this.faucet(attoCash);
    const owner = await this.augur.getAccount();
    await this.augur.contracts.ethExchange.publicMintAuto(owner, attoCash, {attachedEth: attoEth});
  }

  async initWarpSync(universe: string): Promise<void> {
    await this.augur.contracts.warpSync.initializeUniverse(universe);
  }

  async approve(wei: BigNumber): Promise<void> {
    await this.augur.contracts.cash.approve(this.augur.config.addresses.Augur, wei);

    await this.augur.contracts.cash.approve(this.augur.config.addresses.FillOrder, wei);
    await this.augur.contracts.shareToken.setApprovalForAll(this.augur.config.addresses.FillOrder, true);

    await this.augur.contracts.cash.approve(this.augur.config.addresses.CreateOrder, wei);
    await this.augur.contracts.shareToken.setApprovalForAll(this.augur.config.addresses.CreateOrder, true);
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
    return this.augur.contracts.reputationTokenFromAddress(repContractAddress, this.augur.config.networkId);
  }

  // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
  async getEthBalance(owner?: string): Promise<BigNumber> {
    const balance = await this.provider.getBalance(owner || this.account.publicKey);
    return new BigNumber(balance.toString());
  }

  async getRepBalance(owner?: string): Promise<BigNumber> {
    if (!owner) owner = await this.augur.getAccount();
    return this.augur.contracts.getReputationToken().balanceOf_(owner);
  }

  async getCashBalance(owner?: string): Promise<BigNumber> {
    if (!owner) owner = await this.augur.getAccount();
    return this.augur.contracts.cash.balanceOf_(owner);
  }

  getRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.getReputationToken().allowance_(owner, spender);
  }

  setGnosisSafeAddress(safeAddress: string): void {
    this.augur.setGnosisSafeAddress(safeAddress);
  }

  setGasPrice(gasPrice: BigNumber): void {
    this.augur.setGasPrice(gasPrice);
  }

  getGasPrice(): Promise<BigNumber> {
    return this.augur.getGasPrice()
  }

  setUseGnosisSafe(useSafe: boolean): void {
    this.augur.setUseGnosisSafe(useSafe);
  }

  setUseGnosisRelay(useRelay: boolean): void {
    this.augur.setUseGnosisRelay(useRelay);
  }

  async approveAugurEternalApprovalValue(owner: string) {
    const augur = this.augur.config.addresses.Augur;
    const allowance = new BigNumber(await this.augur.contracts.cash.allowance_(owner, augur));

    if (!allowance.eq(ETERNAL_APPROVAL_VALUE)) {
      const fillOrder = this.augur.config.addresses.FillOrder;
      const createOrder = this.augur.config.addresses.CreateOrder;
      await this.augur.contracts.cash.approve(augur, ETERNAL_APPROVAL_VALUE, { sender: this.account.publicKey });
      await this.augur.contracts.cash.approve(fillOrder, ETERNAL_APPROVAL_VALUE, { sender: this.account.publicKey });
      await this.augur.contracts.cash.approve(createOrder, ETERNAL_APPROVAL_VALUE, { sender: this.account.publicKey });

      await this.augur.contracts.shareToken.setApprovalForAll(fillOrder, true, { sender: this.account.publicKey });
      await this.augur.contracts.shareToken.setApprovalForAll(createOrder, true, { sender: this.account.publicKey });
    }
  }

  async createGnosisSafeDirectlyWithETH(): Promise<ContractInterfaces.GnosisSafe> {
    const address = await this.augur.gnosis.createGnosisSafeDirectlyWithETH(this.account.publicKey);
    return this.augur.contracts.gnosisSafeFromAddress(address);
  }

  async getGnosisSafeAddress(account: string): Promise<string> {
    return this.augur.gnosis.getGnosisSafeAddress(account);
  }

  async createGnosisSafeViaRelay(paymentToken: string): Promise<SafeResponse> {
    const params = {
      paymentToken,
      owner: this.account.publicKey,
      affiliate: NULL_ADDRESS,
      fingerprint: formatBytes32String('')
    };
    return this.augur.gnosis.createGnosisSafeViaRelay(params);
  }

  async getGnosisSafeDeploymentStatusViaRelay(owner: string, safe: string): Promise<GnosisSafeStateReponse> {
    return this.augur.gnosis.getGnosisSafeDeploymentStatusViaRelay({
      owner,
      safe,
    });
  }

  async getHotLoadingMarketData(market: string): Promise<HotLoadMarketInfo> {
    return this.augur.hotLoading.getMarketDataParams({market});
  }

  async getHotLoadingDisputeWindowData(): Promise<DisputeWindow> {
    return this.augur.hotLoading.getCurrentDisputeWindowData({
      augur: this.augur.contracts.augur.address,
      universe: this.augur.contracts.universe.address,
    });
  }

  async mineBlock(): Promise<void> {
    await this.provider.sendAsync({
      id: 42,
      method: 'evm_mine',
      params: [],
      jsonrpc: '2.0'
    });
  }

  async startMining(): Promise<void> {
    await this.provider.sendAsync({
      id: 42,
      method: 'miner_start',
      params: [],
      jsonrpc: '2.0'
    });
  }

  async stopMining(): Promise<void> {
    await this.provider.sendAsync({
      id: 42,
      method: 'miner_stop',
      params: [],
      jsonrpc: '2.0'
    });
  }

  async fundSafe(safe?: string, minimum=new BigNumber(1e21)) {
    safe = safe || await this.getOrCreateSafe();

    if ((await this.getCashBalance(safe)).lt(minimum)) {
      await this.faucet(minimum, safe);
      await this.waitForSafeFunding(safe);
    }

    return safe;
  }

  async waitForSafeFunding(safe: string): Promise<void> {
    let status: string;
    for (let i = 0; i < 10; i++) {
      status = await this.getSafeStatus(safe);
      if (status !== GnosisSafeState.WAITING_FOR_FUNDS) {
        break;
      }
      await sleep(2000);
    }

    // TODO this sleep call can be reduced or eliminated
    await sleep(10000);
  }

  async getOrCreateSafe(): Promise<string> {
    const safeFromRegistry = await this.augur.contracts.gnosisSafeRegistry.getSafe_(this.account.publicKey);
    if(safeFromRegistry !== NULL_ADDRESS) {
      console.log(`Found safe: ${safeFromRegistry}`);
      return safeFromRegistry;
    }

    console.log('Attempting to create safe via relay');
    const safeResponse = await this.createGnosisSafeViaRelay(this.augur.config.addresses.Cash);
    return safeResponse.safe
  }

  async getSafeStatus(safe: string) {
    const status = await this.augur.checkSafe(this.account.publicKey, safe);
    if (typeof status === 'string') {
      return status;
    } else if (typeof status === 'object' && typeof status.status === 'string') {
      return status.status
    } else {
      throw Error(`Received erroneous response when deploying safe via relay: "${status}"`);
    }
  }

  async initializeUniverseForWarpSync(): Promise<void> {
    return this.augur.warpSync.initializeUniverse(this.augur.contracts.universe.address);
  }

  async getWarpSyncMarket(): Promise<ContractInterfaces.Market> {
    return this.augur.warpSync.getWarpSyncMarket(this.augur.contracts.universe.address);
  }

  async getLastWarpSyncData(): Promise<WarpSyncData> {
    return this.augur.warpSync.getLastWarpSyncData(this.augur.contracts.universe.address);
  }

  async getWarpSyncHashFromPayout(payout: BigNumber[]): Promise<string> {
    return this.augur.warpSync.getWarpSyncHashFromPayout(payout);
  }

  async getPayoutFromWarpSyncHash(hash: string): Promise<BigNumber[]> {
    return this.augur.warpSync.getPayoutFromWarpSyncHash(hash);
  }

  async getWarpSyncHashFromMarket(market: ContractInterfaces.Market): Promise<string> {
    return this.augur.warpSync.getWarpSyncHashFromMarket(market);
  }
}
