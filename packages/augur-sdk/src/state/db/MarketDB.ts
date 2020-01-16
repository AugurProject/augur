import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { DerivedDB } from './DerivedDB';
import { DB } from './DB';
import {
  CLAIM_GAS_COST,
  EULERS_NUMBER,
  INVALID_OUTCOME,
  MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI,
  SECONDS_IN_A_YEAR,
  WORST_CASE_FILL,
  DEFAULT_GAS_PRICE_IN_GWEI,
  MAX_TRADE_GAS_PERCENTAGE_DIVISOR,
} from '../../constants';
import { MarketData, MarketType, OrderTypeHex, TimestampSetLog } from '../logs/types';
import { BigNumber } from 'bignumber.js';
import { OrderBook } from '../../api/Liquidity';
import { ParsedLog } from '@augurproject/types';
import { MarketReportingState, SECONDS_IN_A_DAY } from '../../constants';
import { QUINTILLION, padHex } from '../../utils';
import { Block } from 'ethereumjs-blockstream';
import { isTemplateMarket } from '@augurproject/artifacts';


interface MarketOrderBookData {
  _id: string;
  invalidFilter: number;
  liquidity: LiquidityResults;
}

interface LiquidityResults {
  [liquidity: number]: number;
}

/**
 * Market specific derived DB intended for filtering purposes
 */
export class MarketDB extends DerivedDB {
  readonly liquiditySpreads = [10, 15, 20, 100];
  private readonly docProcessMap;

  constructor(db: DB, networkId: number, augur: Augur) {
    super(db, networkId, 'Markets', [
      'MarketCreated',
      'MarketVolumeChanged',
      'MarketOIChanged',
      'InitialReportSubmitted',
      'DisputeCrowdsourcerCompleted',
      'MarketFinalized',
      'MarketParticipantsDisavowed',
      'MarketMigrated',
    ], augur);

    this.docProcessMap = {
      'MarketCreated': this.processMarketCreated.bind(this),
      'InitialReportSubmitted': this.processInitialReportSubmitted,
      'DisputeCrowdsourcerCompleted': this.processDisputeCrowdsourcerCompleted.bind(this),
      'MarketFinalized': this.processMarketFinalized,
      'MarketVolumeChanged': this.processMarketVolumeChanged,
      'MarketOIChanged': this.processMarketOIChanged,
      'MarketParticipantsDisavowed': this.processMarketParticipantsDisavowed,
      'MarketMigrated': this.processMarketMigrated,
    };

    this.augur.events.subscribe('DerivedDB:updated:CurrentOrders', this.syncOrderBooks);
    this.augur.events.subscribe('DerivedDB:updated:ZeroXOrders', this.syncOrderBooks);
    this.augur.events.subscribe('controller:new:block', this.processNewBlock);
    this.augur.events.subscribe('TimestampSet', this.processTimestampSet);
  }

  async doSync(highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;
    await super.doSync(highestAvailableBlockNumber);
    await this.syncOrderBooks();
    const timestamp = (await this.augur.getTimestamp()).toNumber();
    await this.processTimestamp(timestamp, highestAvailableBlockNumber);
    await this.syncFTS();
    this.syncing = false;
  }

  syncFTS = async (): Promise<void> => {
    if (this.augur.syncableFlexSearch) {
      let marketDocs = await this.allDocs();
      marketDocs = marketDocs.slice(0, marketDocs.length);
      await this.augur.syncableFlexSearch.addMarketCreatedDocs(marketDocs);
    }
  }

  syncOrderBooks = async (): Promise<void> => {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    const documents = [];

    const currentZeroXOrders = await this.stateDB.ZeroXOrders.toArray();

    if (currentZeroXOrders.length < 1) return;

    const marketIds: string[] = _.uniq(_.map(currentZeroXOrders, 'market')) as string[];
    const marketsData = await this.stateDB.Markets.where("market").anyOf(marketIds).toArray();
    const reportingFeeDivisor = await this.augur.contracts.universe.getReportingFeeDivisor_();
    // TODO Get ETH -> DAI price via uniswap when we integrate that as an oracle
    const ETHInAttoDAI = new BigNumber(200).multipliedBy(10**18);

    const marketDataById = _.keyBy(marketsData, 'market');

    for (const marketId of marketIds) {
      const doc = await this.getOrderBookData(this.augur, marketId, marketDataById[marketId], reportingFeeDivisor, ETHInAttoDAI);
      // This is needed to make rollbacks work properly
      doc['blockNumber'] = highestSyncedBlockNumber;
      doc['market'] = marketId;
      documents.push(doc);
    }

    await this.bulkUpsertDocuments(documents);
  }

  async getOrderBookData(augur: Augur, marketId: string, marketData: MarketData, reportingFeeDivisor: BigNumber, ETHInAttoDAI: BigNumber): Promise<MarketOrderBookData> {
    const numOutcomes = marketData.marketType === MarketType.Categorical ? marketData.outcomes.length + 1 : 3;
    const estimatedTradeGasCost = WORST_CASE_FILL[numOutcomes];
    const estimatedGasCost = ETHInAttoDAI.multipliedBy(DEFAULT_GAS_PRICE_IN_GWEI).div(10**9);
    const estimatedTradeGasCostInAttoDai = estimatedGasCost.multipliedBy(estimatedTradeGasCost);
    const estimatedClaimGasCostInAttoDai = estimatedGasCost.multipliedBy(CLAIM_GAS_COST);
    const feePerCashInAttoCash = new BigNumber(marketData.feePerCashInAttoCash);
    const feeDivisor = new BigNumber(marketData.feeDivisor);
    const numTicks = new BigNumber(marketData.numTicks);
    const feeMultiplier = new BigNumber(1).minus(new BigNumber(1).div(reportingFeeDivisor)).minus(new BigNumber(1).div(feeDivisor));
    const orderBook = await this.getOrderBook(marketData, numOutcomes, estimatedTradeGasCostInAttoDai);
    const invalidFilter = await this.recalcInvalidFilter(orderBook, marketData, feeMultiplier, estimatedTradeGasCostInAttoDai, estimatedClaimGasCostInAttoDai);

    const marketOrderBookData = {
      _id: marketId,
      invalidFilter,
      liquidity: {},
    };

    for (const spread of this.liquiditySpreads) {
      const liquidity = await this.augur.liquidity.getLiquidityForSpread({
        orderBook,
        numTicks,
        marketType: marketData.marketType,
        reportingFeeDivisor,
        feePerCashInAttoCash,
        numOutcomes,
        spread,
      });
      marketOrderBookData.liquidity[spread] = liquidity.toFixed().padStart(30, '0');
    }

    return marketOrderBookData;
  }

  async getOrderBook(marketData: MarketData, numOutcomes: number, estimatedTradeGasCostInAttoDai: BigNumber): Promise<OrderBook> {
    const currentOrdersResponse = await this.stateDB.ZeroXOrders
      .toArray();

      const currentOrdersFiltered = currentOrdersResponse
      .filter(m => m.market === marketData.market)
      .filter(order => order.amount > '0x00');

    const currentOrdersByOutcome = _.groupBy(currentOrdersFiltered, (order) => new BigNumber(order.outcome).toNumber());
    for (let outcome = 0; outcome < numOutcomes; outcome++) {
      if (currentOrdersByOutcome[outcome] === undefined) currentOrdersByOutcome[outcome] = [];
    }

    const outcomeBidAskOrders = Object.keys(currentOrdersByOutcome).map((outcomeOrders) => {
      // Cut out orders where gas costs > 1% of the trade
      const sufficientlyLargeOrders = _.filter(currentOrdersByOutcome[outcomeOrders], (order) => {
        const maxGasCost = new BigNumber(order.amount).multipliedBy(marketData.numTicks).div(MAX_TRADE_GAS_PERCENTAGE_DIVISOR);
        return maxGasCost.gte(estimatedTradeGasCostInAttoDai);
      });

      const groupedByOrderType = _.groupBy(sufficientlyLargeOrders, 'orderType');
      const bids = groupedByOrderType ? _.reverse(_.sortBy(groupedByOrderType[OrderTypeHex.Bid], 'price')) : [];
      const asks = groupedByOrderType ? _.sortBy(groupedByOrderType[OrderTypeHex.Ask], 'price') : [];

      return {
        bids,
        asks,
      };
    });

    return outcomeBidAskOrders.map(order => {
      if (order.bids === undefined) {
        order.bids = [];
      }

      if (order.asks === undefined) {
        order.asks = [];
      }

      return order;
    });
  }

  // A Market is marked as True in the invalidFilter if the best bid for Invalid on the book would not be profitable to take were the market Valid
  async recalcInvalidFilter(orderbook: OrderBook, marketData: MarketData, feeMultiplier: BigNumber, estimatedTradeGasCostInAttoDai: BigNumber, estimatedClaimGasCostInAttoDai: BigNumber): Promise<number> {
    if (orderbook[INVALID_OUTCOME].bids.length < 1) return 0;

    const bestBid = orderbook[INVALID_OUTCOME].bids[0];

    const bestBidAmount = new BigNumber(bestBid.amount);
    const bestBidPrice = new BigNumber(bestBid.price);
    const numTicks = new BigNumber(marketData.numTicks);

    let timeTillMarketFinalizesInSeconds = new BigNumber(marketData.endTime).minus((new Date).getTime()/1000);
    if (timeTillMarketFinalizesInSeconds.lt(0)) timeTillMarketFinalizesInSeconds = new BigNumber(0);
    const timeTillMarketFinalizesInYears = timeTillMarketFinalizesInSeconds.div(SECONDS_IN_A_YEAR);

    let validRevenue = bestBidAmount.multipliedBy(numTicks);
    validRevenue = validRevenue.multipliedBy(feeMultiplier);
    validRevenue = validRevenue.multipliedBy((EULERS_NUMBER ** timeTillMarketFinalizesInYears.multipliedBy(-.15).precision(14).toNumber()).toPrecision(14));
    validRevenue = validRevenue.minus(estimatedTradeGasCostInAttoDai).minus(estimatedClaimGasCostInAttoDai);

    const validCost = bestBidAmount.multipliedBy(numTicks.minus(bestBidPrice));

    const validProfit = validRevenue.minus(validCost);

    return validProfit.gt(MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI) ? 1 : 0;
  }

  protected processDoc(log: ParsedLog): ParsedLog {
    const processFunc = this.docProcessMap[log.name];
    if (processFunc) {
      return processFunc({
        ...log
      });
    }
    return {
      ...log
    };
  }

  private processMarketCreated = (log: ParsedLog): ParsedLog => {
    log['reportingState'] = MarketReportingState.PreReporting;
    log['finalized'] = 0;
    log['invalidFilter'] = 0;
    log['marketOI'] = '0x00';
    log['volume'] = '0x00';
    log['disputeRound'] = '0x00';
    log['totalRepStakedInMarket'] = '0x00';
    log['hasRecentlyDepletedLiquidity'] = 0;
    log['liquidity'] = {
      0: '000000000000000000000000000000',
      10: '000000000000000000000000000000',
      15: '000000000000000000000000000000',
      20: '000000000000000000000000000000',
      100: '000000000000000000000000000000'
    }
    log['feeDivisor'] = new BigNumber(1).dividedBy(new BigNumber(log['feePerCashInAttoCash'], 16).dividedBy(QUINTILLION)).toNumber();
    log['feePercent'] = new BigNumber(log['feePerCashInAttoCash'], 16).div(QUINTILLION).toNumber();
    log['lastTradedTimestamp'] = 0;
    log['timestamp'] = new BigNumber(log['timestamp'], 16).toNumber();
    log['endTime'] = new BigNumber(log['endTime'], 16).toNumber();
    try {
      log['extraInfo'] = JSON.parse(log['extraInfo']);
      log['extraInfo'].categories = log['extraInfo'].categories.map((category) => category.toLowerCase());
      if(log['extraInfo'].template) {
        log['isTemplate'] = isTemplateMarket(log['extraInfo'].description, log['extraInfo'].template, log['outcomes'], log['extraInfo'].longDescription, log['endTime']);
      }
    } catch (err) {
      log['extraInfo'] = {};
    }
    if (this.augur.syncableFlexSearch) {
      this.augur.syncableFlexSearch.addMarketCreatedDocs([log as unknown as MarketData]);
    }
    return log;
  }

  private processInitialReportSubmitted(log: ParsedLog): ParsedLog {
    log['reportingState'] = MarketReportingState.CrowdsourcingDispute;
    log['totalRepStakedInMarket'] = padHex(log['amountStaked']);
    log['tentativeWinningPayoutNumerators'] = log['payoutNumerators']
    log['disputeRound'] = '0x01';
    return log;
  }

  private processDisputeCrowdsourcerCompleted(log: ParsedLog): ParsedLog {
    const pacingOn: boolean = log['pacingOn'];
    log['reportingState'] = pacingOn ? MarketReportingState.AwaitingNextWindow : MarketReportingState.CrowdsourcingDispute;
    log['tentativeWinningPayoutNumerators'] = log['payoutNumerators'];
    log['totalRepStakedInMarket'] = padHex(log['totalRepStakedInMarket']);
    return log;
  }

  private processMarketFinalized(log: ParsedLog): ParsedLog {
    log['reportingState'] = MarketReportingState.Finalized;
    log['finalizationBlockNumber'] = log['blockNumber'];
    log['finalizationTime'] = log['timestamp'];
    log['finalized'] = 1;
    return log;
  }

  private processMarketVolumeChanged(log: ParsedLog): ParsedLog {
    log['volume'] = padHex(log['volume']);
    log['lastTradedTimestamp'] = new BigNumber(log['timestamp'], 16).toNumber();
    return log;
  }

  private processMarketOIChanged(log: ParsedLog): ParsedLog {
    log['marketOI'] = padHex(log['marketOI']);
    return log;
  }

  private processMarketParticipantsDisavowed(log: ParsedLog): ParsedLog {
    log['disavowed'] = 1;
    return log;
  }

  private processMarketMigrated(log: ParsedLog): ParsedLog {
    log['universe'] = log['newUniverse'];
    return log;
  }

  processNewBlock = async (block: Block): Promise<void> => {
    const timestamp = (await this.augur.getTimestamp()).toNumber();
    await this.processTimestamp(timestamp, Number(block.number))
  };

  processTimestampSet = async (log: TimestampSetLog): Promise<void> => {
    const timestamp = new BigNumber(log.newTimestamp).toNumber();
    await this.processTimestamp(timestamp, log.blockNumber)
  };

  private async processTimestamp(timestamp: number, blockNumber: number): Promise<void> {
    await this.waitOnLock(this.HANDLE_MERGE_EVENT_LOCK, 2000, 50);

    const eligibleMarketDocs = await this.table.where("reportingState").anyOfIgnoreCase([
      MarketReportingState.PreReporting,
      MarketReportingState.DesignatedReporting,
      MarketReportingState.CrowdsourcingDispute,
      MarketReportingState.AwaitingNextWindow,
    ]).toArray();
    const eligibleMarketsData = eligibleMarketDocs as unknown as MarketData[];
    const updateDocs = [];

    for (const marketData of eligibleMarketsData) {
      let reportingState: MarketReportingState = null;
      const marketEnd = new BigNumber(marketData.endTime);
      const openReportingStart = marketEnd.plus(SECONDS_IN_A_DAY).plus(1);

      if (marketData.nextWindowEndTime && timestamp >= new BigNumber(marketData.nextWindowEndTime, 16).toNumber()) {
        reportingState = MarketReportingState.AwaitingFinalization;
      } else if (marketData.nextWindowStartTime && timestamp >= new BigNumber(marketData.nextWindowStartTime, 16).toNumber()) {
        reportingState = MarketReportingState.CrowdsourcingDispute;
      } else if ((marketData.reportingState === MarketReportingState.PreReporting || marketData.reportingState === MarketReportingState.DesignatedReporting) && timestamp >= openReportingStart.toNumber()) {
          reportingState = MarketReportingState.OpenReporting;
      } else if (marketData.reportingState === MarketReportingState.PreReporting && timestamp >= marketEnd.toNumber() && timestamp < openReportingStart.toNumber()) {
          reportingState = MarketReportingState.DesignatedReporting;
      }

      if (reportingState && reportingState != marketData.reportingState) {
        updateDocs.push({
          market: marketData.market,
          blockNumber,
          reportingState
        });
      }
    }

    if (updateDocs.length > 0) {
      await this.bulkUpsertDocuments(updateDocs);
    }
  }
}
