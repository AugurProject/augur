import { AbstractDB } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { DB } from './DB';
import { MaxLiquiditySpread, SECONDS_IN_A_DAY, SECONDS_IN_AN_HOUR } from '../../constants';
import { GetLiquidityParams, Liquidity } from '../../api/Liquidity';
import { Augur } from '../../Augur';
import { BigNumber } from 'bignumber.js';
import { getLiquidityOrderBook } from '../../state/getter/Markets';
import { Doc, MarketType, OrderEventType } from '../logs/types';

export interface LiquidityLastUpdated {
  _doc_id_rev: string;
  timestamp: number;
}

export interface MarketHourlyLiquidity extends Doc {
  market: string;
  spread: number;
  liquidity: string;
  timestamp: number;
}

interface MarketsLiquidityParams {
  [marketId: string]: GetLiquidityParams;
}

export class LiquidityDB extends AbstractDB {
  private readonly augur: Augur;
  protected syncStatus: SyncStatus;
  protected stateDB: DB;
  protected name: string;

  constructor(
    augur: Augur,
    db: DB,
    networkId: number,
    name: string
  ) {
    super(networkId, db.getDatabaseName(name), db.pouchDBFactory);
    this.augur = augur;
    this.stateDB = db;
    this.db.createIndex({
      index: {
        fields: ['market'],
      },
    });
    this.db.createIndex({
      index: {
        fields: ['timestamp'],
      },
    });
  }

  async recalculateLiquidity(augur: Augur, db: DB, currentTimestamp: number): Promise<void> {
  console.log('currentTimestamp', currentTimestamp);
    // @TODO: Need to factor in blockStreamDelay?
    try {
      const liquidityDB = db.getLiquidityDatabase();
      const lastUpdatedTimestamp = await db.findLiquidityLastUpdatedTimestamp();
      const currentTimestampBN = new BigNumber(currentTimestamp);
      const secondsPerHour = SECONDS_IN_AN_HOUR.toNumber();
      const mostRecentOnTheHourTimestamp = currentTimestampBN.minus(currentTimestampBN.mod(secondsPerHour));
console.log('mostRecentOnTheHourTimestamp', mostRecentOnTheHourTimestamp.toNumber());
      // TODO Optimize saving hourly liquidity so that existing data isn't recalculated
      if (!lastUpdatedTimestamp || mostRecentOnTheHourTimestamp.gt(lastUpdatedTimestamp)) {
        await this.deleteOldLiquidityData(liquidityDB, mostRecentOnTheHourTimestamp);
        const marketsLiquidityDocs = [];
        const liquidity = new Liquidity(augur);
        let hourlyLiquidityStartTime = mostRecentOnTheHourTimestamp.minus(SECONDS_IN_A_DAY);
        while (!hourlyLiquidityStartTime.eq(mostRecentOnTheHourTimestamp)) {
          const marketsLiquidityParams = await this.getMarketsLiquidityParams(db, augur, hourlyLiquidityStartTime.toNumber(), hourlyLiquidityStartTime.plus(SECONDS_IN_AN_HOUR).toNumber());
          for (const market in marketsLiquidityParams) {
            if (marketsLiquidityParams.hasOwnProperty(market)) {
              // Store liquidity for each spread percent
              for (const spread of Object.values(MaxLiquiditySpread)) {
                // Do not save liquidity for spread of 0, as it's not necessary
                if (spread !== MaxLiquiditySpread.ZeroPercent) {
                  marketsLiquidityParams[market].spread = new BigNumber(spread).toNumber();
                  const marketLiquidity = await liquidity.getLiquidityForSpread(marketsLiquidityParams[market]);
                  // Only save liquidity if it's > 0
                  if (new BigNumber(marketLiquidity).gt(0)) {
                    marketsLiquidityDocs.push({
                      _id: /*universe + '_' +*/ market + '_' + marketsLiquidityParams[market].spread + '_' + mostRecentOnTheHourTimestamp.toString(),
                      market,
                      // universe,
                      spread: marketsLiquidityParams[market].spread,
                      liquidity: marketLiquidity.toString(),
                      timestamp: mostRecentOnTheHourTimestamp.toNumber(),
                    });
                  }
                }
              }
            }
          }
          hourlyLiquidityStartTime = hourlyLiquidityStartTime.plus(SECONDS_IN_AN_HOUR);
        }
        marketsLiquidityDocs.push({
          _id: 'lastUpdated',
          timestamp: mostRecentOnTheHourTimestamp.toNumber(),
        });
        await liquidityDB.bulkUpsertUnorderedDocuments(marketsLiquidityDocs);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Deletes hourly liquidity data older than 24 hours
   * @param liquidityDB
   * @param mostRecentOnTheHourTimestamp
   */
  private async deleteOldLiquidityData(liquidityDB: LiquidityDB, mostRecentOnTheHourTimestamp: BigNumber): Promise<void> {
    const oldLiquidityDocs = await liquidityDB.find({
      selector: {
        _id: { $ne: 'lastUpdated' },
        timestamp: { $lte: mostRecentOnTheHourTimestamp.minus(SECONDS_IN_A_DAY).toNumber() },
      },
    });
    const docs: any = oldLiquidityDocs.docs;
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].hasOwnProperty('market')) {
          docs[i]._deleted = true;
        }
    }
    await liquidityDB.bulkUpsertUnorderedDocuments(oldLiquidityDocs.docs);
  }

  private async getMarketsLiquidityParams(db: DB, augur: Augur, startTime: number, endTime: number): Promise<MarketsLiquidityParams> {
    const liquidityParams = {};
    const orderFilledRequest = {
      selector: {
        $and: [
          { orderType: OrderEventType.Fill },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lt: `0x${endTime.toString(16)}` } },
        ],
      },
    };
    const currentOrdersLogs = await db.findCurrentOrderLogs(orderFilledRequest);
    if (currentOrdersLogs) {
      // @TODO: Filter out finalized markets
      for (let i = 0; i < currentOrdersLogs.length; i++) {
        liquidityParams[currentOrdersLogs[i].market] = {};
      }
      const marketIds = Object.keys(liquidityParams);
      const marketCreatedLogs = await db.findMarketCreatedLogs({
        selector: { market: { $in: marketIds } },
      });
      const reportingFeeDivisor = await augur.contracts.universe.getReportingFeeDivisor_();
      for (let i = 0; i < marketCreatedLogs.length; i++) {
        const marketCreatedLog = marketCreatedLogs[i];
        const liquidityOrderBook = await getLiquidityOrderBook(augur, db, marketCreatedLog.market);
        const market = augur.getMarket(marketCreatedLog.market);
        const marketFeeDivisor = await market.getMarketCreatorSettlementFeeDivisor_();
        liquidityParams[marketCreatedLog.market] = {
          orderBook: liquidityOrderBook,
          numTicks: new BigNumber(marketCreatedLog.numTicks),
          marketType: marketCreatedLog.marketType,
          reportingFeeDivisor,
          marketFeeDivisor,
          numOutcomes: marketCreatedLog.marketType === MarketType.Categorical ? marketCreatedLog.outcomes.length : 3,
        };
      }
    }

    return liquidityParams;
  }
}
