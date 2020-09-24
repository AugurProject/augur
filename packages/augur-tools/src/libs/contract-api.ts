import { ContractInterfaces } from '@augurproject/core';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  Augur,
  Connectors,
  CreateCategoricalMarketParams,
  createClient,
  CreateScalarMarketParams,
  CreateYesNoMarketParams,
  DisputeWindow,
  EmptyConnector,
  HotLoadMarketInfo,
  PlaceTradeDisplayParams,
  SimulateTradeData,
  WarpSyncData,
  ZeroXPlaceTradeDisplayParams,
  ZeroXSimulateTradeData,
} from '@augurproject/sdk';
import {
  MarketInfo,
  MarketList,
  TemplateFilters,
} from '@augurproject/sdk-lite';
import { SDKConfiguration } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import moment from 'moment';
import { Account } from '../constants';
import { makeSigner } from './blockchain';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_APPROVAL = new BigNumber(2).pow(256).minus(1);
const MAX_REP_FAUCET = new BigNumber(499999).multipliedBy(10 ** 18);

export class ContractAPI {
  static async userWrapper(
    account: Account,
    provider: EthersProvider,
    config: SDKConfiguration,
    connector: Connectors.BaseConnector = new EmptyConnector()
  ) {
    const signer = await makeSigner(account, provider);
    const augur = await createClient(config, connector, signer, provider, true);

    return new ContractAPI(augur, provider, account);
  }

  static async wrapUsers(
    accounts: Account[],
    provider: EthersProvider,
    config: SDKConfiguration,
    connector: Connectors.BaseConnector = new EmptyConnector()
  ): Promise<ContractAPI[]> {
    return Promise.all(
      accounts.map(account =>
        ContractAPI.userWrapper(account, provider, config, connector)
      )
    );
  }

  constructor(
    readonly augur: Augur,
    readonly provider: EthersProvider,
    public account: Account
  ) {}

  get dependencies() {
    return this.augur.dependencies;
  }

  async sendEther(to: string, amount: BigNumber): Promise<void> {
    return await this.augur.sendETH(to, amount);
  }

  async approve(wei = MAX_APPROVAL): Promise<void> {
    const authority = this.augur.config.addresses.Augur;
    await this.augur.contracts.cash.approve(authority, wei);

    const fillOrder = this.augur.config.addresses.FillOrder;
    await this.augur.contracts.cash.approve(fillOrder, wei);
    await this.augur.contracts.shareToken.setApprovalForAll(fillOrder, true);

    const createOrder = this.augur.config.addresses.CreateOrder;
    await this.augur.contracts.cash.approve(createOrder, wei);
    await this.augur.contracts.shareToken.setApprovalForAll(createOrder, true);

    const zeroXTrade = this.augur.config.addresses.ZeroXTrade;
    await this.augur.contracts.cash.approve(zeroXTrade, wei);
  }

  async getCashAllowance(): Promise<BigNumber> {
    const owner = this.account.address;
    const authority = this.augur.config.addresses.Augur;
    return this.augur.contracts.cash.allowance_(owner, authority);
  }

  async approveIfNecessary(wei = MAX_APPROVAL): Promise<void> {
    const current = await this.getCashAllowance();
    if (current.lt(wei)) {
      await this.approve(wei);
    }
  }

  async createYesNoMarket(
    params: CreateYesNoMarketParams,
    faucet = true
  ): Promise<ContractInterfaces.Market> {
    if (faucet) await this.marketFauceting();
    return this.augur.createYesNoMarket(params);
  }

  async createCategoricalMarket(
    params: CreateCategoricalMarketParams,
    faucet = true
  ): Promise<ContractInterfaces.Market> {
    if (faucet) await this.marketFauceting();
    return this.augur.createCategoricalMarket(params);
  }

  async createScalarMarket(
    params: CreateScalarMarketParams,
    faucet = true
  ): Promise<ContractInterfaces.Market> {
    if (faucet) await this.marketFauceting();
    return this.augur.createScalarMarket(params);
  }

  async getRepBond(): Promise<BigNumber> {
    return this.augur.contracts.universe.getOrCacheMarketRepBond_();
  }

  async marketFauceting() {
    const marketCreationFee = await this.augur.contracts.universe.getOrCacheValidityBond_();
    const repBond = await this.getRepBond();
    console.log('Cash Faucet for market creation');
    await this.faucetCashUpTo(marketCreationFee);
    console.log('REP Faucet for market creation');
    await this.faucetRepUpTo(repBond.plus(1e18));
  }

  async createReasonableYesNoMarket(
    description = 'YesNo market description',
    faucet = true,
    feePercentage = 1
  ): Promise<ContractInterfaces.Market> {
    const currentTimestamp = (await this.getTimestamp()).toNumber();

    return this.createYesNoMarket(
      {
        endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
        feePerCashInAttoCash: new BigNumber(feePercentage * 10).pow(16),
        affiliateFeeDivisor: new BigNumber(25),
        designatedReporter: this.account.address,
        extraInfo: JSON.stringify({
          categories: ['flash', 'Reasonable', 'YesNo'],
          description,
        }),
      },
      faucet
    );
  }

  async createReasonableMarket(
    outcomes: string[],
    description = 'Categorical market description',
    faucet = true
  ): Promise<ContractInterfaces.Market> {
    const currentTimestamp = (await this.getTimestamp()).toNumber();

    return this.createCategoricalMarket(
      {
        endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
        feePerCashInAttoCash: new BigNumber(10).pow(16),
        affiliateFeeDivisor: new BigNumber(25),
        designatedReporter: this.account.address,
        extraInfo: JSON.stringify({
          categories: ['flash', 'Reasonable', 'Categorical'],
          description,
        }),
        outcomes,
      },
      faucet
    );
  }

  async createReasonableScalarMarket(
    description = 'Scalar market description',
    faucet = true
  ): Promise<ContractInterfaces.Market> {
    const currentTimestamp = (await this.getTimestamp()).toNumber();
    const minPrice = new BigNumber(50).multipliedBy(new BigNumber(10).pow(18));
    const maxPrice = new BigNumber(250).multipliedBy(new BigNumber(10).pow(18));

    return this.createScalarMarket(
      {
        endTime: new BigNumber(currentTimestamp + 30 * 24 * 60 * 60),
        feePerCashInAttoCash: new BigNumber(10).pow(16),
        affiliateFeeDivisor: new BigNumber(25),
        designatedReporter: this.account.address,
        extraInfo: JSON.stringify({
          categories: ['flash', 'Reasonable', 'Scalar'],
          description,
          _scalarDenomination: 'scalar denom 1',
        }),
        numTicks: new BigNumber(20000),
        prices: [minPrice, maxPrice],
      },
      faucet
    );
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
    if (type.isEqualTo(0)) {
      // BID
      const cost = numShares.multipliedBy(price);
      await this.faucetCashUpTo(cost);
    } else if (type.isEqualTo(1)) {
      // ASK
      const m = await this.getMarketContract(market);
      const numTicks = await m.getNumTicks_();
      const cost = numTicks
        .plus(price.multipliedBy(-1))
        .multipliedBy(numShares);
      await this.faucetCashUpTo(cost);
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
    outcome: BigNumber
  ): Promise<string> {
    return this.placeOrder(
      market,
      type,
      numShares,
      price,
      outcome,
      formatBytes32String(''),
      formatBytes32String(''),
      formatBytes32String('42')
    );
  }

  async fillOrder(
    orderId: string,
    numShares: BigNumber,
    tradeGroupId: string,
    cost?: BigNumber
  ) {
    if (cost) {
      await this.faucetCashUpTo(cost);
    }
    await this.augur.contracts.fillOrder.publicFillOrder(
      orderId,
      numShares,
      formatBytes32String(tradeGroupId),
      formatBytes32String('')
    );
  }

  async placeZeroXOrder(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
    await this.augur.zeroX.placeOrder(params);
  }

  async placeZeroXOrders(
    params: ZeroXPlaceTradeDisplayParams[]
  ): Promise<void> {
    console.log(
      `${this.account.address} is creating orders: ${JSON.stringify(
        params,
        null,
        2
      )}`
    );
    await this.augur.zeroX.placeOrders(params);
  }

  async safePlaceOrders(params: ZeroXPlaceTradeDisplayParams[]): Promise<void> {
    await this.augur.zeroX.safePlaceOrders(params);
  }

  async placeZeroXTrade(params: ZeroXPlaceTradeDisplayParams): Promise<void> {
    const price =
      params.direction === 0
        ? params.displayPrice
        : params.numTicks.minus(params.displayPrice);
    const cost = params.displayAmount
      .multipliedBy(price)
      .multipliedBy(10 ** 18);
    await this.faucetCashUpTo(cost);
    await this.augur.zeroX.placeTrade(params);
  }

  async placeBasicYesNoZeroXTrade(
    direction: 0 | 1,
    market: string,
    outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    displayAmount: BigNumber,
    displayPrice: BigNumber,
    displayShares: BigNumber,
    expirationTime: BigNumber
  ): Promise<void> {
    await this.placeZeroXTrade({
      direction,
      market,
      numTicks: new BigNumber(1000),
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

  async takeBestOrder(
    marketAddress: string,
    type: BigNumber,
    numShares: BigNumber,
    price: BigNumber,
    outcome: BigNumber,
    tradeGroupID: string
  ): Promise<void> {
    const cost = numShares.multipliedBy(price);
    await this.faucetCashUpTo(cost);
    const bestPriceAmount = await this.augur.contracts.trade.publicFillBestOrder_(
      type,
      marketAddress,
      outcome,
      numShares,
      price,
      tradeGroupID,
      new BigNumber(3),
      formatBytes32String('')
    );
    if (bestPriceAmount === new BigNumber(0)) {
      throw new Error('Could not take best Order');
    }

    await this.augur.contracts.trade.publicFillBestOrder(
      type,
      marketAddress,
      outcome,
      numShares,
      price,
      tradeGroupID,
      new BigNumber(3),
      formatBytes32String('')
    );
  }

  async cancelOrder(orderID: string): Promise<void> {
    await this.augur.cancelOrder(orderID);
  }

  async cancelNativeOrder(orderID: string): Promise<void> {
    await this.augur.contracts.cancelOrder.cancelOrder(orderID);
  }

  async placeNativeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    const price =
      params.direction === 0
        ? params.displayPrice
        : params.numTicks.minus(params.displayPrice);
    const cost = params.displayAmount
      .multipliedBy(price)
      .multipliedBy(10 ** 18);
    await this.faucetCashUpTo(cost);
    await this.augur.trade.placeTrade(params);
  }

  async simulateNativeTrade(
    params: PlaceTradeDisplayParams
  ): Promise<SimulateTradeData> {
    return this.augur.trade.simulateTrade(params);
  }

  async simulateZeroXTrade(
    params: ZeroXPlaceTradeDisplayParams
  ): Promise<ZeroXSimulateTradeData> {
    return this.augur.zeroX.simulateTrade(params);
  }

  async placeBasicYesNoTrade(
    direction: 0 | 1,
    market: ContractInterfaces.Market,
    outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    displayAmount: BigNumber,
    displayPrice: BigNumber,
    displayShares: BigNumber
  ): Promise<void> {
    await this.placeNativeTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: ((await market.getNumberOfOutcomes_()) as unknown) as
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8,
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

  async simulateBasicYesNoTrade(
    direction: 0 | 1,
    market: ContractInterfaces.Market,
    outcome: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    displayAmount: BigNumber,
    displayPrice: BigNumber,
    displayShares: BigNumber
  ): Promise<SimulateTradeData> {
    return this.simulateNativeTrade({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: ((await market.getNumberOfOutcomes_()) as unknown) as
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8,
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
    doNotCreateOrders = false
  ): Promise<ZeroXSimulateTradeData> {
    return this.simulateZeroXTrade({
      direction,
      takerAddress: this.account.address,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: ((await market.getNumberOfOutcomes_()) as unknown) as
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8,
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

  async claimTradingProceeds(
    market: ContractInterfaces.Market,
    shareholder = this.account.address,
    fingerprint = formatBytes32String('11')
  ): Promise<void> {
    await this.augur.contracts.shareToken.claimTradingProceeds(
      market.address,
      shareholder,
      fingerprint
    );
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

  async getBestOrderId(
    type: BigNumber,
    market: string,
    outcome: BigNumber
  ): Promise<string> {
    const orderID = await this.augur.contracts.orders.getBestOrderId_(
      type,
      market,
      outcome
    );
    if (!orderID) {
      throw new Error('Unable to get order price');
    }
    return orderID;
  }

  async getOrders(marketId: string, orderType: string, outcome: number) {
    return this.augur.getZeroXOrders({
      marketId,
      orderType,
      outcome,
    });
  }

  async buyCompleteSets(
    market: ContractInterfaces.Market,
    amount: BigNumber
  ): Promise<void> {
    const numTicks = await market.getNumTicks_();
    const cashValue = amount.multipliedBy(numTicks);
    await this.faucetCashUpTo(cashValue);
    await this.augur.contracts.shareToken.publicBuyCompleteSets(
      market.address,
      amount
    );
  }

  async sellCompleteSets(
    market: ContractInterfaces.Market,
    amount: BigNumber
  ): Promise<void> {
    await this.augur.contracts.shareToken.publicSellCompleteSets(
      market.address,
      amount
    );
  }

  async contribute(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[],
    amount: BigNumber,
    description = ''
  ): Promise<void> {
    // Below is to ensure the signer is the account we're using in this instance
    market = this.augur.contracts.marketFromAddress(market.address);
    await market.contribute(payoutNumerators, amount, description);
  }

  async contributeToTentative(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[],
    amount: BigNumber,
    description = ''
  ): Promise<void> {
    await market.contributeToTentative(payoutNumerators, amount, description);
  }

  async getRemainingToFill(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[]
  ): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(
      market,
      payoutNumerators
    );
    const crowdsourcerAddress = await market.getCrowdsourcer_(
      payoutDistributionHash
    );
    if (crowdsourcerAddress === NULL_ADDRESS) {
      return new BigNumber(-1);
    }
    const crowdsourcer = this.augur.contracts.getReportingParticipant(
      crowdsourcerAddress
    );
    return crowdsourcer.getRemainingToFill_();
  }

  async getCrowdsourcerDisputeBond(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[]
  ): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(
      market,
      payoutNumerators
    );
    const crowdsourcerAddress = await market.getCrowdsourcer_(
      payoutDistributionHash
    );
    if (crowdsourcerAddress === '0') {
      const totalStake = await market.getParticipantStake_();
      return totalStake.times(2);
    }
    const crowdsourcer = this.augur.contracts.getReportingParticipant(
      crowdsourcerAddress
    );
    const remaining = await crowdsourcer.getRemainingToFill_();
    return remaining;
  }

  async derivePayoutDistributionHash(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[]
  ): Promise<string> {
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
    return this.augur.contracts.universe.getInitialReportMinValue_();
  }

  migrateOutByPayout(
    reputationToken: ContractInterfaces.ReputationToken,
    payoutNumerators: BigNumber[],
    attotokens: BigNumber
  ) {
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  migrateOutByPayoutNumerators(
    payoutNumerators: BigNumber[],
    attotokens: BigNumber
  ) {
    const reputationToken = this.augur.contracts.getReputationToken();
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  async getNumSharesInMarket(
    market: ContractInterfaces.Market,
    outcome: BigNumber
  ): Promise<BigNumber> {
    return this.augur.contracts.shareToken.balanceOfMarketOutcome_(
      market.address,
      outcome,
      await this.augur.getAccount()
    );
  }

  async getOrCreateCurrentDisputeWindow(initial = false): Promise<string> {
    // Must make 2 calls because the first call is necessary but doesn't always return the dispute window.
    await this.augur.contracts.universe.getOrCreateCurrentDisputeWindow(
      initial
    );
    return this.augur.contracts.universe.getOrCreateCurrentDisputeWindow_(
      initial
    );
  }

  async getDisputeWindow(
    market: ContractInterfaces.Market
  ): Promise<ContractInterfaces.DisputeWindow> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    return this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
  }

  async getDisputeWindowEndTime(
    market: ContractInterfaces.Market
  ): Promise<BigNumber> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    return disputeWindow.getEndTime_();
  }

  async getInitialReporter(
    market: ContractInterfaces.Market
  ): Promise<ContractInterfaces.InitialReporter> {
    const initialReporterAddress = await market.getInitialReporter_();
    return this.augur.contracts.getInitialReporter(initialReporterAddress);
  }

  async getWinningReportingParticipant(
    market: ContractInterfaces.Market
  ): Promise<ContractInterfaces.DisputeCrowdsourcer> {
    const reportingParticipantAddress = await market.getWinningReportingParticipant_();
    return this.augur.contracts.getReportingParticipant(
      reportingParticipantAddress
    );
  }

  async buyParticipationTokens(
    disputeWindowAddress: string,
    amount: BigNumber,
    sender: string = this.account.address
  ): Promise<void> {
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    await disputeWindow.buy(amount, { sender });
  }

  async simpleBuyParticipationTokens(attoRep: BigNumber): Promise<void> {
    const universe = this.augur.contracts.universe.address;
    await this.augur.contracts.buyParticipationTokens.buyParticipationTokens(
      universe,
      attoRep
    );
  }

  async redeemParticipationTokens(
    disputeWindowAddress: string,
    account: string = this.account.address
  ): Promise<void> {
    const disputeWindow = this.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    await disputeWindow.redeem(account);
  }

  async getUniverse(
    market: ContractInterfaces.Market
  ): Promise<ContractInterfaces.Universe> {
    const universeAddress = await market.getUniverse_();
    return this.augur.contracts.universeFromAddress(universeAddress);
  }

  async advanceTimestamp(secondsToAdvance: number | BigNumber): Promise<void> {
    const currentTimestamp = await this.getTimestamp();
    return this.setTimestamp(currentTimestamp.plus(secondsToAdvance));
  }

  async setTimestamp(timestamp: BigNumber): Promise<void> {
    const time = this.augur.contracts.getTime();

    if (this.augur.contracts.isTimeControlled(time)) {
      await time.setTimestamp(timestamp);

      try {
        // sync our timestamp with our fake timestamp.
        await this.provider.providerSend('evm_mine', [timestamp.toNumber()]);
      } catch (e) {
        // Not using ganache. Nothing really to do here.
      }
    } else {
      throw Error(
        'Cannot set timestamp because Time contract is not TimeControlled'
      );
    }
  }

  async getTimestamp(): Promise<BigNumber> {
    return this.augur.contracts.augur.getTimestamp_();
  }

  async printTimestamp() {
    const blocktime = await this.getTimestamp();
    const epoch = Number(blocktime.toString()) * 1000;

    console.log(`block: ${blocktime}`);
    console.log(`local: ${moment(epoch).toString()}`);
    console.log(
      `utc: ${moment(epoch)
        .utc()
        .toString()}\n`
    );
  }

  async doInitialReport(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[],
    description = '',
    extraStake = '0'
  ): Promise<void> {
    // Below is to ensure the signer is the account we're using in this instance
    market = this.augur.contracts.marketFromAddress(market.address);
    await market.doInitialReport(
      payoutNumerators,
      description,
      new BigNumber(extraStake)
    );
  }

  async getMarketContract(address: string): Promise<ContractInterfaces.Market> {
    return this.augur.getMarket(address);
  }

  async getMarketInfo(
    marketIds: string | string[]
  ): Promise<MarketInfo[]> {
    marketIds = Array.isArray(marketIds) ? marketIds : [marketIds];
    return this.augur.getMarketsInfo({ marketIds });
  }

  async getMarkets(): Promise<MarketList> {
    const universe = this.augur.contracts.universe.address;
    return this.augur.getMarkets({ universe });
  }

  async getBettingMarkets(
    params = {}
  ): Promise<MarketList> {
    const universe = this.augur.contracts.universe.address;
    return this.augur.getMarkets({ universe, templateFilter: TemplateFilters.sportsBook });
  }

  async getInitialReporterStake(
    market: ContractInterfaces.Market,
    payoutNumerators: BigNumber[]
  ): Promise<BigNumber> {
    const payoutDistributionHash = await this.derivePayoutDistributionHash(
      market,
      payoutNumerators
    );
    const initialReporterAddress = await market.getCrowdsourcer_(
      payoutDistributionHash
    );
    const initialReporter = this.augur.contracts.getInitialReporter(
      initialReporterAddress
    );
    return initialReporter.getStake_();
  }

  async getParticipantStake(
    market: ContractInterfaces.Market
  ): Promise<BigNumber> {
    return market.getParticipantStake_();
  }

  async finalizeMarket(market: ContractInterfaces.Market): Promise<void> {
    await market.finalize();
  }

  async faucetCash(attoCash: BigNumber, targetAddress?: string): Promise<void> {
    const userAddress = await this.augur.getAccount();
    const account = targetAddress || userAddress;
    await this.augur.contracts.cash.faucet(attoCash);
    if (account !== userAddress) {
      await this.augur.contracts.cash.transfer(account, attoCash);
    }
  }

  // Faucets cash if the target address (or current user) has less than `attoCash`.
  // When fauceting, adds `extra` cash as a buffer.
  async faucetCashUpTo(
    attoCash: BigNumber,
    extra = new BigNumber(0),
    targetAddress: string = null
  ): Promise<void> {
    targetAddress = targetAddress || (await this.augur.getAccount());
    const balance = await this.getCashBalance(targetAddress);
    const leftToFaucet = attoCash.minus(balance);
    if (leftToFaucet.gt(0)) {
      const totalToFaucet = leftToFaucet.plus(extra);
      await this.faucetCash(totalToFaucet, targetAddress);
    }
  }

  async faucetRep(attoRep: BigNumber, useLegacy = false): Promise<void> {
    attoRep = BigNumber.min(attoRep, MAX_REP_FAUCET);
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

  // Faucets rep if the target address (or current user) has less than `attoRep`.
  // When fauceting, adds `extra` rep as a buffer.
  async faucetRepUpTo(
    attoRep: BigNumber,
    extra = new BigNumber(0),
    useLegacy = false
  ): Promise<void> {
    const address = await this.augur.getAccount();
    const balance = await this.getRepBalance(address);
    const leftToFaucet = attoRep.minus(balance);
    if (leftToFaucet.gt(0)) {
      const totalToFaucet = BigNumber.min(
        MAX_REP_FAUCET,
        leftToFaucet.plus(extra)
      );
      await this.faucetRep(totalToFaucet, useLegacy);
    }
  }

  async transferCash(to: string, attoCash: BigNumber): Promise<void> {
    await this.augur.contracts.cash.transfer(to, attoCash);
  }

  async addEthExchangeLiquidity(
    attoCash: BigNumber,
    attoEth: BigNumber
  ): Promise<void> {
    await this.faucetCashUpTo(attoCash);
    await this.augur.contracts.cash.transfer(
      this.augur.contracts.ethExchange.address,
      attoCash
    );
    await this.augur.contracts.weth.deposit({ attachedEth: attoEth });
    await this.augur.contracts.weth.transfer(
      this.augur.contracts.ethExchange.address,
      attoEth
    );
    const owner = await this.augur.getAccount();
    await this.augur.contracts.ethExchange.mint(owner);
  }

  async depositRelay(address: string, attoEth: BigNumber): Promise<void> {
    await this.augur.contracts.relayHub.depositFor(address, {
      attachedEth: attoEth,
    });
  }

  async initWarpSync(universe: string): Promise<void> {
    const warpSyncMarket = await this.augur.contracts.warpSync.markets_(
      universe
    );
    if (warpSyncMarket === NULL_ADDRESS) {
      await this.augur.contracts.warpSync.initializeUniverse(universe);
    }
  }

  async reportAndFinalizeWarpSyncMarket(hash: string) {
    const warpSyncMarket = await this.reportWarpSyncMarket(hash);
    return this.finalizeWarpSyncMarket(warpSyncMarket);
  }

  async finalizeWarpSyncMarket(warpSyncMarket: ContractInterfaces.Market) {
    const timestamp = (await this.getTimestamp()).plus(1000000);
    await this.setTimestamp(timestamp);

    await this.finalizeMarket(warpSyncMarket);

    return warpSyncMarket;
  }

  async reportWarpSyncMarket(hash: string) {
    const payoutNumerators = await this.getPayoutFromWarpSyncHash(hash);
    const warpSyncMarket = await this.getWarpSyncMarket();

    const timestamp = (await this.getTimestamp()).plus(1000000);
    await this.setTimestamp(timestamp);
    await this.doInitialReport(warpSyncMarket, payoutNumerators);

    return warpSyncMarket;
  }

  getLegacyRepBalance(owner: string): Promise<BigNumber> {
    return this.augur.contracts.legacyReputationToken.balanceOf_(owner);
  }

  getLegacyRepAllowance(owner: string, spender: string): Promise<BigNumber> {
    return this.augur.contracts.legacyReputationToken.allowance_(
      owner,
      spender
    );
  }

  async transferLegacyRep(to: string, amount: BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.transfer(to, amount);
  }

  async getChildUniverseReputationToken(parentPayoutDistributionHash: string) {
    const childUniverseAddress = await this.augur.contracts.universe!.getChildUniverse_(
      parentPayoutDistributionHash
    );
    const childUniverse = this.augur.contracts.universeFromAddress(
      childUniverseAddress
    );
    const repContractAddress = await childUniverse.getReputationToken_();
    return this.augur.contracts.reputationTokenFromAddress(
      repContractAddress,
      this.augur.config.networkId
    );
  }

  // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
  async getEthBalance(owner?: string): Promise<BigNumber> {
    const balance = await this.provider.getBalance(
      owner || this.account.address
    );
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

  getGasPrice(): Promise<BigNumber> {
    return this.augur.getGasPrice();
  }

  async getHotLoadingMarketData(market: string): Promise<HotLoadMarketInfo> {
    return this.augur.hotLoading.getMarketDataParams({ market });
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
      jsonrpc: '2.0',
    });
  }

  async startMining(): Promise<void> {
    await this.provider.sendAsync({
      id: 42,
      method: 'miner_start',
      params: [],
      jsonrpc: '2.0',
    });
  }

  async stopMining(): Promise<void> {
    await this.provider.sendAsync({
      id: 42,
      method: 'miner_stop',
      params: [],
      jsonrpc: '2.0',
    });
  }

  async fundSafe(safe: string, minimum = new BigNumber(1e21)) {
    if ((await this.getCashBalance(safe)).lt(minimum)) {
      await this.faucetCashUpTo(minimum, new BigNumber(0), safe);
    }

    return safe;
  }

  async initializeUniverseForWarpSync(): Promise<void> {
    return this.augur.warpSync.initializeUniverse(
      this.augur.contracts.universe.address
    );
  }

  async getWarpSyncMarket(): Promise<ContractInterfaces.Market> {
    return this.augur.warpSync.getWarpSyncMarket(
      this.augur.contracts.universe.address
    );
  }

  async getLastWarpSyncData(): Promise<WarpSyncData> {
    return this.augur.warpSync.getLastWarpSyncData(
      this.augur.contracts.universe.address
    );
  }

  async getWarpSyncHashFromPayout(payout: BigNumber[]): Promise<string> {
    return this.augur.warpSync.getWarpSyncHashFromPayout(payout[2]);
  }

  async getPayoutFromWarpSyncHash(hash: string): Promise<BigNumber[]> {
    return this.augur.warpSync.getPayoutFromWarpSyncHash(hash);
  }

  async getWarpSyncHashFromMarket(
    market: ContractInterfaces.Market
  ): Promise<string> {
    return this.augur.warpSync.getWarpSyncHashFromMarket(market);
  }

  async addTokenExchangeLiquidity(
    attoCash: BigNumber,
    attoRep: BigNumber
  ): Promise<void> {
    const contracts = this.augur.contracts;
    const owner = await this.augur.getAccount();
    const now = new Date();
    const deadline = now.valueOf() * 1 + 3600000;
    const APPROVAL_AMOUNT = new BigNumber(2 ** 255);

    await this.faucetCashUpTo(attoCash);
    await this.faucetRepUpTo(attoRep);
    await contracts.cash.approve(contracts.uniswap.address, APPROVAL_AMOUNT);
    await contracts.reputationToken.approve(
      contracts.uniswap.address,
      APPROVAL_AMOUNT
    );
    await contracts.uniswap.addLiquidity(
      contracts.reputationToken.address,
      contracts.cash.address,
      attoRep,
      attoCash,
      new BigNumber(0),
      new BigNumber(0),
      owner,
      new BigNumber(deadline)
    );
  }
}
