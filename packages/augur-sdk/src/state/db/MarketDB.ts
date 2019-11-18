import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { DerivedDB } from './DerivedDB';
import { DB } from './DB';
import {
  CLAIM_GAS_COST,
  DEFAULT_GAS_PRICE_IN_GWEI,
  EULERS_NUMBER,
  INVALID_OUTCOME,
  MAX_TRADE_GAS_PERCENTAGE_DIVISOR,
  MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI,
  SECONDS_IN_A_YEAR,
  WORST_CASE_FILL,
} from '../../constants';
import { MarketData, MarketType, OrderType, TimestampSetLog } from '../logs/types';
import { BigNumber } from 'bignumber.js';
import { OrderBook } from '../../api/Liquidity';
import { ParsedLog } from '@augurproject/types';
import { MarketReportingState, SECONDS_IN_A_DAY } from '../../constants';
import { QUINTILLION, padHex } from '../../utils';
import { Block } from 'ethereumjs-blockstream';
import { isTemplateMarket } from '@augurproject/artifacts';


interface MarketOrderBookData {
  _id: string;
  invalidFilter: boolean;
  liquidity: LiquidityResults;
}

interface LiquidityResults {
  [liquidity: number]: number;
}

/**
 * Market specific derived DB intended for filtering purposes
 */
export class MarketDB extends DerivedDB {
  private readonly events;
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
      'MarketMigrated'
    ], ['market'],
      augur);

    this.events = this.augur.getAugurEventEmitter();

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

    this.events.subscribe('DerivedDB:updated:CurrentOrders', this.syncOrderBooks);
    this.events.subscribe('controller:new:block', this.processNewBlock);
    this.events.subscribe('TimestampSet', this.processTimestampSet);
  }

  async doSync(highestAvailableBlockNumber: number): Promise<void> {
    await super.doSync(highestAvailableBlockNumber);
    await this.syncOrderBooks(true);
    const timestamp = (await this.augur.getTimestamp()).toNumber();
    await this.processTimestamp(timestamp, highestAvailableBlockNumber);
    await this.syncFTS();
  }

  syncFTS = async (): Promise<void> => {
    if (this.augur.syncableFlexSearch) {
      const allDocs = await this.allDocs();
      let marketDocs: any[] = allDocs.rows ? allDocs.rows.map(row => row.doc) : [];
      marketDocs = marketDocs.slice(0, marketDocs.length - 1);
      await this.augur.syncableFlexSearch.addMarketCreatedDocs(marketDocs);
    }
  }

  syncOrderBooks = async (syncing: boolean): Promise<void> => {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    let success = true;
    const documents = [];
    const request = {
      selector: {
        blockNumber: { $gte: highestSyncedBlockNumber },
      },
    };

    const currentOrderLogs = await this.stateDB.findCurrentOrderLogs(request);

    if (currentOrderLogs.length < 1) return;

    const marketIds: string[] = _.uniq(_.map(currentOrderLogs, 'market')) as string[];
    const highestBlockNumber: number = _.max(_.map(currentOrderLogs, 'blockNumber')) as number;
    const marketsData = await this.stateDB.findMarkets({
      selector: {
        market: { $in: marketIds },
      },
    });

    const marketDataById = _.keyBy(marketsData, 'market');

    const reportingFeeDivisor = await this.augur.contracts.universe.getReportingFeeDivisor_();
    // TODO Get ETH -> DAI price via uniswap when we integrate that as an oracle
    const ETHInAttoDAI = new BigNumber(200).multipliedBy(10**18);

    for (const marketId of marketIds) {
      const doc = await this.getOrderBookData(this.augur, marketId, marketDataById[marketId], reportingFeeDivisor, ETHInAttoDAI);
      // This is needed to make rollbacks work properly
      doc['blockNumber'] = highestBlockNumber;
      documents.push(doc);
    }

    success = await this.bulkUpsertUnorderedDocuments(documents);

    if (success) {
      if (!syncing) {
        await this.syncStatus.setHighestSyncBlock(this.dbName, highestBlockNumber, false);
      }
    } else {
      throw new Error('Syncing market orderbook liquidity stats failed');
    }
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
    const currentOrdersResponse = await this.stateDB.findCurrentOrderLogs({
      selector : {
        market: marketData.market,
        amount: { $gt: '0x00' },
        eventType: { $ne: 1 },
      },
    });

    const currentOrdersByOutcome = _.groupBy(currentOrdersResponse, (order) => new BigNumber(order.outcome).toNumber());
    for (let outcome = 0; outcome < numOutcomes; outcome++) {
      if (currentOrdersByOutcome[outcome] === undefined) currentOrdersByOutcome[outcome] = [];
    }

    const outcomeBidAskOrders = _.map(currentOrdersByOutcome, (outcomeOrders) => {
      // Cut out orders where gas costs > 1% of the trade
      const sufficientlyLargeOrders = _.filter(outcomeOrders, (order) => {
        const maxGasCost = new BigNumber(order.amount).multipliedBy(marketData.numTicks).div(MAX_TRADE_GAS_PERCENTAGE_DIVISOR);
        return maxGasCost.gte(estimatedTradeGasCostInAttoDai);
      });

      const groupedByOrderType = _.groupBy(sufficientlyLargeOrders, 'orderType');

      const bids = _.reverse(_.sortBy(groupedByOrderType[OrderType.Bid], 'price'));
      const asks = _.sortBy(groupedByOrderType[OrderType.Ask], 'price');

      return {
        bids,
        asks,
      };
    });
    return outcomeBidAskOrders;
  }

  // A Market is marked as True in the invalidFilter if the best bid for Invalid on the book would not be profitable to take were the market Valid
  async recalcInvalidFilter(orderbook: OrderBook, marketData: MarketData, feeMultiplier: BigNumber, estimatedTradeGasCostInAttoDai: BigNumber, estimatedClaimGasCostInAttoDai: BigNumber): Promise<boolean> {
    if (orderbook[INVALID_OUTCOME].bids.length < 1) return false;

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

    return validProfit.gt(MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI);
  }

  protected processDoc(log: ParsedLog): ParsedLog {
    const processFunc = this.docProcessMap[log.name];
    if (processFunc) {
      return processFunc(log);
    }
    return log;
  }

  private processMarketCreated = (log: ParsedLog): ParsedLog => {
    log['reportingState'] = MarketReportingState.PreReporting;
    log['finalized'] = false;
    log['invalidFilter'] = false;
    log['marketOI'] = '0x00';
    log['volume'] = '0x00';
    log['disputeRound'] = '0x00';
    log['totalRepStakedInMarket'] = '0x00';
    log['hasRecentlyDepletedLiquidity'] = false;
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
    try {
      log['extraInfo'] = JSON.parse(log['extraInfo']);
      log['extraInfo'].categories = log['extraInfo'].categories.map((category) => category.toLowerCase());
      if(log['extraInfo'].template) {
        log['isTemplate'] = isTemplateMarket(log['extraInfo'].description, log['extraInfo'].template);
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
    log['finalized'] = true;
    return log;
  }

  private processMarketVolumeChanged(log: ParsedLog): ParsedLog {
    log['volume'] = padHex(log['volume']);
    return log;
  }

  private processMarketOIChanged(log: ParsedLog): ParsedLog {
    log['marketOI'] = padHex(log['marketOI']);
    return log;
  }

  private processMarketParticipantsDisavowed(log: ParsedLog): ParsedLog {
    log['disavowed'] = true;
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

    const eligibleMarketDocs = await this.find({
      selector: {
        reportingState: { $in: [
          MarketReportingState.PreReporting,
          MarketReportingState.DesignatedReporting,
          MarketReportingState.CrowdsourcingDispute,
          MarketReportingState.AwaitingNextWindow,
        ] }
      }
    });
    const eligibleMarketsData = eligibleMarketDocs.docs as unknown as MarketData[];
    const updateDocs = [];

    for (const marketData of eligibleMarketsData) {
      let reportingState: MarketReportingState = null;
      const marketEnd = new BigNumber(marketData.endTime, 16);
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

      if (reportingState) {
        updateDocs.push({
          _id: marketData._id,
          market: marketData._id,
          blockNumber,
          reportingState
        });
      }
    }

    if (updateDocs.length > 0) {
      await this.bulkUpsertUnorderedDocuments(updateDocs);
    }
  }
}
