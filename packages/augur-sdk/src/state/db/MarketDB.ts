import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { DerivedDB } from './DerivedDB';
import { DB } from './DB';
import {
  CLAIM_GAS_COST,
  EULERS_NUMBER,
  INVALID_OUTCOME,
  MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI,
  SECONDS_IN_A_DAY,
  SECONDS_IN_A_YEAR,
  WORST_CASE_FILL,
  DEFAULT_GAS_PRICE_IN_GWEI,
  MAX_TRADE_GAS_PERCENTAGE_DIVISOR,
  orderTypes,
  MarketReportingState,
} from '../../constants';
import { NewBlock } from "../../events";
import { MarketData, MarketType, OrderTypeHex, TimestampSetLog, UnixTimestamp } from '../logs/types';
import { BigNumber } from 'bignumber.js';
import { OrderBook } from '../../api/Liquidity';
import { ParsedLog } from '@augurproject/types';
import { QUINTILLION, padHex } from '../../utils';
import { SubscriptionEventName } from '../../constants';
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

let liquidityCheckInterval = null;
const liquidityDirty = new Set();

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

    this.augur.events.subscribe('DB:updated:ZeroXOrders', (orderEvents) => this.markMarketLiquidityAsDirty(orderEvents.market));
    this.augur.events.subscribe(SubscriptionEventName.NewBlock, this.processNewBlock);
    this.augur.events.subscribe(SubscriptionEventName.TimestampSet, this.processTimestampSet);

    // Don't call this interval during tests
    if (process.env.NODE_ENV !== 'test') {
      if (!liquidityCheckInterval) {
        // call recalc liquidity every 3mins
        const THREE_MINS_IN_MS = 180000;
        liquidityCheckInterval = setInterval(async () => {
          if (liquidityDirty.size > 0) {
            const marketIdsToCheck = Array.from(liquidityDirty) as string[];
            await this.syncOrderBooks(marketIdsToCheck);
            liquidityDirty.clear();
          }
        },THREE_MINS_IN_MS);
      }
    }
  }

  syncFTS = async (): Promise<void> => {
    if (this.augur.syncableFlexSearch) {
      let marketDocs = await this.allDocs();
      marketDocs = marketDocs.slice(0, marketDocs.length);
      await this.augur.syncableFlexSearch.addMarketCreatedDocs(marketDocs);
    }
  }

  async doSync(highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;
    await super.doSync(highestAvailableBlockNumber);
    await this.syncOrderBooks([]);
    const timestamp = (await this.augur.getTimestamp()).toNumber();
    await this.processTimestamp(timestamp, highestAvailableBlockNumber);
    await this.syncFTS();
    this.syncing = false;
  }

  async handleMergeEvent(
    blocknumber: number, logs: ParsedLog[],
    syncing = false): Promise<number> {

    const result = await super.handleMergeEvent(blocknumber, logs, syncing);

    await this.syncOrderBooks([]);

    const timestamp = (await this.augur.getTimestamp()).toNumber();
    await this.processTimestamp(timestamp, result);
    await this.syncFTS();
    return result;
  }

  syncOrderBooks = async (marketIds: string[]): Promise<void> => {;
    let ids = marketIds;
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    const documents = [];

    let marketsData;
    if (marketIds.length === 0) {
      marketsData = await this.table.toArray();
      ids = marketsData.map(data => data.market);
    } else {
      marketsData = await this.table.where('market').anyOf(marketIds).toArray();
    }

    const reportingFeeDivisor = await this.augur.contracts.universe.getReportingFeeDivisor_();
    // TODO Get ETH -> DAI price via uniswap when we integrate that as an oracle
    const ETHInAttoDAI = new BigNumber(200).multipliedBy(10**18);

    const marketDataById = _.keyBy(marketsData, 'market');
    for (const marketId of ids) {
      if (Object.keys(marketDataById).includes(marketId)) {
        const doc = await this.getOrderBookData(this.augur, marketId, marketDataById[marketId], reportingFeeDivisor, ETHInAttoDAI);
        // This is needed to make rollbacks work properly
        doc['blockNumber'] = highestSyncedBlockNumber;
        doc['market'] = marketId;
        documents.push(doc);
      }
    }

    await this.bulkUpsertDocuments(documents);
  }

  markMarketLiquidityAsDirty(marketId: string) {
    liquidityDirty.add(marketId);
  }

  async getOrderBookData(augur: Augur, marketId: string, marketData: MarketData, reportingFeeDivisor: BigNumber, ETHInAttoDAI: BigNumber): Promise<MarketOrderBookData> {
    const numOutcomes = marketData.outcomes && marketData.outcomes.length > 0 ? marketData.outcomes.length + 1 : 3;
    const estimatedTradeGasCost = WORST_CASE_FILL[numOutcomes - 1];
    const estimatedGasCost = ETHInAttoDAI.multipliedBy(DEFAULT_GAS_PRICE_IN_GWEI).div(10**9);
    const estimatedTradeGasCostInAttoDai = estimatedGasCost.multipliedBy(estimatedTradeGasCost);
    const estimatedClaimGasCostInAttoDai = estimatedGasCost.multipliedBy(CLAIM_GAS_COST);
    const feePerCashInAttoCash = new BigNumber(marketData.feePerCashInAttoCash);
    const feeDivisor = new BigNumber(marketData.feeDivisor);
    const numTicks = new BigNumber(marketData.numTicks);
    const feeMultiplier = new BigNumber(1).minus(new BigNumber(1).div(reportingFeeDivisor)).minus(new BigNumber(1).div(feeDivisor));
    const orderBook = await this.getOrderBook(marketData, numOutcomes, estimatedTradeGasCostInAttoDai);
    const invalidFilter = await this.recalcInvalidFilter(orderBook, marketData, feeMultiplier, estimatedTradeGasCostInAttoDai, estimatedClaimGasCostInAttoDai);

    let marketOrderBookData = {
      _id: marketId,
      invalidFilter,
      hasRecentlyDepletedLiquidity: false,
      lastPassingLiquidityCheck: 0,
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

    const spread10 = new BigNumber(marketOrderBookData.liquidity[10]);
    const spread15 = new BigNumber(marketOrderBookData.liquidity[15]);
    const lastSpread10 = marketData.liquidity ? new BigNumber(marketData.liquidity[10]) : new BigNumber(0);
    const lastSpread15 = marketData.liquidity ? new BigNumber(marketData.liquidity[15]) : new BigNumber(0);

    const passesSpreadCheck = (spread10.gt(0) || spread15.gt(0));
    // Keep track when a market has under a 15% spread. Used for `hasRecentlyDepletedLiquidity`
    if (passesSpreadCheck) {
      const now = Math.floor(Date.now() / 1000);
      marketOrderBookData.lastPassingLiquidityCheck = now;
    } else if (lastSpread10.gt(0) || lastSpread15.gt(0)) {
      marketOrderBookData.lastPassingLiquidityCheck = marketData.lastPassingLiquidityCheck;
    } else if (marketData.hasRecentlyDepletedLiquidity) {
      marketOrderBookData.lastPassingLiquidityCheck = marketData.lastPassingLiquidityCheck;
    }

    const prevInvalidFilter = marketData.invalidFilter;
    const prevHasRecentlyDepletedLiquidity = marketData.hasRecentlyDepletedLiquidity;
    const currentIvalidFilter = marketOrderBookData.invalidFilter;

    // Add markets that recently became invalid to Recently Depleted Liquidity
    if (passesSpreadCheck) {
      if (!prevInvalidFilter && currentIvalidFilter ||
          (prevInvalidFilter && currentIvalidFilter && prevHasRecentlyDepletedLiquidity)) {
        marketOrderBookData.hasRecentlyDepletedLiquidity = true;
      } else {
        marketOrderBookData.hasRecentlyDepletedLiquidity = await this.hasRecentlyDepletedLiquidity(marketData, marketOrderBookData.liquidity, marketOrderBookData.lastPassingLiquidityCheck);
      }
    } else {
      marketOrderBookData.hasRecentlyDepletedLiquidity = await this.hasRecentlyDepletedLiquidity(marketData, marketOrderBookData.liquidity, marketOrderBookData.lastPassingLiquidityCheck);
    }

    return marketOrderBookData;
  }

  async getOrderBook(marketData: MarketData, numOutcomes: number, estimatedTradeGasCostInAttoDai: BigNumber): Promise<OrderBook> {
    let outcomes = ['0x00', '0x01', '0x02'];

    if (marketData.outcomes && marketData.outcomes.length > 0) {
      outcomes = [];
      for (let i = 0; i <= marketData.outcomes.length; i++) {
        outcomes = outcomes.concat('0x0' + i);
      }
    }

    let allOutcomesAllOrderTypes = [];

    for (const outcome of outcomes) {
      for (const orderType of orderTypes) {
        allOutcomesAllOrderTypes = allOutcomesAllOrderTypes.concat([[marketData.market, outcome, orderType]]);
      }
    }

    const currentOrdersResponse = await this.stateDB.ZeroXOrders
      .where('[market+outcome+orderType]')
      .anyOf(allOutcomesAllOrderTypes)
      .and((order) => order.amount > '0x00')
      .and((order) => {
        const expirationTimeSeconds = Number(order.signedOrder.expirationTimeSeconds);
        const nowInSeconds = Math.round(+new Date() / 1000);
        return expirationTimeSeconds - nowInSeconds > 70;
      })
      .toArray();

    const currentOrdersByOutcome = _.groupBy(currentOrdersResponse, (order) => new BigNumber(order.outcome).toNumber());
    for (let outcome = 0; outcome < numOutcomes; outcome++) {
      if (currentOrdersByOutcome[outcome] === undefined) currentOrdersByOutcome[outcome] = [];
    }

    const outcomeBidAskOrders = Object.keys(currentOrdersByOutcome).map((outcomeOrders) => {
      // Cut out orders where gas costs > 2% of the trade
      const sufficientlyLargeOrders = _.filter(currentOrdersByOutcome[outcomeOrders], (order) => {
        const gasCost = new BigNumber(order.amount).multipliedBy(marketData.numTicks).div(MAX_TRADE_GAS_PERCENTAGE_DIVISOR);
        const maxGasCost = gasCost.multipliedBy(2); // 2%
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

    const data = outcomeBidAskOrders.map(order => {
      if (order.bids === undefined) {
        order.bids = [];
      }

      if (order.asks === undefined) {
        order.asks = [];
      }

      return order;
    });
    return data;
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
    log['lastPassingLiquidityCheck'] = 0;
    log['feeDivisor'] = new BigNumber(1).dividedBy(new BigNumber(log['feePerCashInAttoCash'], 16).dividedBy(QUINTILLION)).toNumber();
    log['feePercent'] = new BigNumber(log['feePerCashInAttoCash'], 16).div(QUINTILLION).toNumber();
    log['lastTradedTimestamp'] = 0;
    log['timestamp'] = new BigNumber(log['timestamp'], 16).toNumber();
    log['creationTime'] = log['timestamp'];
    log['endTime'] = new BigNumber(log['endTime'], 16).toNumber();
    try {
      log['extraInfo'] = JSON.parse(log['extraInfo']);
      log['extraInfo'].categories = log['extraInfo'].categories.map((category) => category.toLowerCase());
      if(log['extraInfo'].template) {
        let errors = [];
        log['isTemplate'] = isTemplateMarket(log['extraInfo'].description, log['extraInfo'].template, log['outcomes'], log['extraInfo'].longDescription, log['endTime'], errors);
        if (errors.length > 0) console.error(log['extraInfo'].description, errors);
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
    log['finalizationTime'] = new BigNumber(log['timestamp'], 16).toNumber();
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

  processNewBlock = async (block: NewBlock): Promise<void> => {
    await this.processTimestamp(block.timestamp, block.highestAvailableBlockNumber);
  };

  processTimestampSet = async (log: TimestampSetLog): Promise<void> => {
    const timestamp = new BigNumber(log.newTimestamp).toNumber();
    await this.processTimestamp(timestamp, log.blockNumber)
  };

  private async processTimestamp(timestamp: UnixTimestamp, blockNumber: number): Promise<void> {
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
      const marketEnd = marketData.endTime;
      const openReportingStart = marketEnd + SECONDS_IN_A_DAY.toNumber() + 1;

      if (marketData.nextWindowEndTime && timestamp >= marketData.nextWindowEndTime) {
        reportingState = MarketReportingState.AwaitingFinalization;
      } else if (marketData.nextWindowStartTime && timestamp >= marketData.nextWindowStartTime) {
        reportingState = MarketReportingState.CrowdsourcingDispute;
      } else if ((marketData.reportingState === MarketReportingState.PreReporting || marketData.reportingState === MarketReportingState.DesignatedReporting) && timestamp >= openReportingStart) {
          reportingState = MarketReportingState.OpenReporting;
      } else if (marketData.reportingState === MarketReportingState.PreReporting && timestamp >= marketEnd && timestamp < openReportingStart) {
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
      this.augur.events.emit(SubscriptionEventName.ReportingStateChanged, { data: updateDocs });
    }
  }

  // A market's liquidity is considered recently depleted if it had liquidity under
  // a 15% spread in the last 24 hours, but doesn't currently have liquidity
  async hasRecentlyDepletedLiquidity(marketData: MarketData, currentLiquiditySpreads, currentLastPassingLiquidityCheck): Promise<boolean>  {
    const moreThantwentyFourHoursAgo = (date) => {
      const twentyFourHours = Date.now() - (60 * 60 * 24 * 1000);
      return twentyFourHours > date;
    }

    const lastPassingLiquidityCheck = currentLastPassingLiquidityCheck * 1000;
    const liquidity15Percent = new BigNumber(currentLiquiditySpreads[10]);
    const liquidity10Percent = new BigNumber(currentLiquiditySpreads[15]);
    const currentlyHasLiquidity = liquidity10Percent.gt(0) || liquidity15Percent.gt(0)
    let hadLiquidityInLast24Hour = false;

    if (marketData.lastPassingLiquidityCheck === 0) {
      hadLiquidityInLast24Hour = false;
    }
    else if (moreThantwentyFourHoursAgo(lastPassingLiquidityCheck)) {
      hadLiquidityInLast24Hour = false;
    }
    else if (!moreThantwentyFourHoursAgo(lastPassingLiquidityCheck)) {
      hadLiquidityInLast24Hour = true;
    }

    // had liquidity under a 15% spread in the last 24 hours, but doesn't currently have liquidity
    if (hadLiquidityInLast24Hour && !currentlyHasLiquidity) {
      return true;
    } else {
      return false;
    }
  }
}
