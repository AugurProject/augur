import { AbstractDB } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { DB } from './DB';
import { SECONDS_IN_A_DAY, SECONDS_IN_AN_HOUR } from '../../constants';
import { GetLiquidityParams, Liquidity } from '../../api/Liquidity';
import { Augur } from '../../Augur';
import { BigNumber } from 'bignumber.js';
import { getLiquidityOrderBookInfo } from '../../state/getter/Markets';
import { MarketType } from '../logs/types';

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

  async recalculateLiquidity(augur: Augur, db: DB, timestamp: number): Promise<void> {
    // @TODO: Need to factor in blockStreamDelay?
    try {
      const liquidityDB = db.getLiquidityDatabase();
      const lastUpdated = await liquidityDB.getDocument('lastUpdated');
      const currentTimestamp = new BigNumber(timestamp);
      const secondsPerHour = SECONDS_IN_AN_HOUR.toNumber();
      const mostRecentOnTheHourTimestamp = currentTimestamp.minus(currentTimestamp.mod(secondsPerHour));
      if (!lastUpdated || mostRecentOnTheHourTimestamp >= lastUpdated) {
        await this.deleteOldLiquidityData(liquidityDB, mostRecentOnTheHourTimestamp);
        const marketsLiquidityDocs = [];
        const liquidity = new Liquidity(augur);
        const marketsLiquidityParams = await this.getMarketsLiquidityParams(db, augur);
        for (const market in marketsLiquidityParams) {
          if (marketsLiquidityParams.hasOwnProperty(market) && marketsLiquidityParams[market].spread) {
            const marketLiquidity = await liquidity.getLiquidityForSpread(marketsLiquidityParams[market]);
            marketsLiquidityDocs.push({
              _id: market + '_' + mostRecentOnTheHourTimestamp.toString(),
              market,
              liquidity: marketLiquidity.toString(),
              timestamp: mostRecentOnTheHourTimestamp.minus(SECONDS_IN_A_DAY).toNumber(),// mostRecentOnTheHourTimestamp.toNumber(),
            });
          }
        }
        await liquidityDB.bulkUpsertUnorderedDocuments(marketsLiquidityDocs);
        liquidityDB.upsertDocument('lastUpdated', {
          timestamp: mostRecentOnTheHourTimestamp.toNumber(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  private async deleteOldLiquidityData(liquidityDB: LiquidityDB, mostRecentOnTheHourTimestamp: BigNumber): Promise<void> {
    const oldLiquidityDocs = await liquidityDB.find({
      selector: { timestamp: { $lte: mostRecentOnTheHourTimestamp.minus(SECONDS_IN_A_DAY).toNumber() } },
    });
    const docs: any = oldLiquidityDocs.docs;
    for (let i = 0; i < docs.length; i++) {
        if (docs[i].hasOwnProperty('market')) {
          docs[i]._deleted = true;
        }
    }
    await liquidityDB.bulkUpsertUnorderedDocuments(oldLiquidityDocs.docs);
  }

  private async getMarketsLiquidityParams(db: DB, augur: Augur): Promise<MarketsLiquidityParams> {
    const liquidityParams = {};

    const currentOrdersDB = db.getDerivedDatabase(db.getDatabaseName('CurrentOrders'));
    const currentOrdersLogs = await currentOrdersDB.allDocs();
    if (currentOrdersLogs && currentOrdersLogs.rows) {
      // @TODO: Filter out finalized markets
      for (let i = 0; i < currentOrdersLogs.rows.length; i++) {
        const doc: any = currentOrdersLogs.rows[i].doc;
        if (doc.market) {
          liquidityParams[doc.market] = {};
        }
      }
      const marketIds = Object.keys(liquidityParams);
      const marketCreatedLogs = await db.findMarketCreatedLogs({
        selector: { market: { $in: marketIds } },
      });
      const reportingFeeDivisor = await augur.contracts.universe.getReportingFeeDivisor_();
      for (let i = 0; i < marketCreatedLogs.length; i++) {
        const marketCreatedLog = marketCreatedLogs[i];
        const liquidityOrderBookInfo = await getLiquidityOrderBookInfo(augur, db, marketCreatedLog.market);
        const market = augur.getMarket(marketCreatedLog.market);
        const marketFeeDivisor = await market.getMarketCreatorSettlementFeeDivisor_();
        liquidityParams[marketCreatedLog.market] = {
          orderBook: liquidityOrderBookInfo.orderBook,
          numTicks: new BigNumber(marketCreatedLog.numTicks),
          marketType: marketCreatedLog.marketType,
          reportingFeeDivisor,
          marketFeeDivisor,
          numOutcomes: marketCreatedLog.marketType === MarketType.Categorical ? marketCreatedLog.outcomes.length : 3,
          spread: liquidityOrderBookInfo.lowestSpread,
        };
      }
     }

    return liquidityParams;
  }
}
