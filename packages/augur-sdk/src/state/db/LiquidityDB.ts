/*
import { AbstractTable } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { DB } from './DB';
import { SECONDS_IN_A_DAY, SECONDS_IN_AN_HOUR } from '../../constants';
import { GetLiquidityParams, Liquidity } from '../../api/Liquidity';
import { Augur } from '../../Augur';
import { BigNumber } from 'bignumber.js';
import { MaxLiquiditySpread, getLiquidityOrderBook } from '../../state/getter/Markets';
import { Doc, MarketType } from '../logs/types';
import { OrderState, OnChainTrading } from '../getter/OnChainTrading';
import * as _ from 'lodash';

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

export class LiquidityDB extends AbstractTable {
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
    this.table.createIndex({
      index: {
        fields: ['market'],
      },
    });
    this.table.createIndex({
      index: {
        fields: ['timestamp'],
      },
    });
  }

  async updateLiquidity(augur: Augur, db: DB, currentTimestamp: number): Promise<void> {
    // @TODO: Need to factor in blockStreamDelay?
    try {
      const liquidityDB = db.getLiquidityDatabase();
      const lastUpdatedTimestamp = await db.findLiquidityLastUpdatedTimestamp();
      const currentTimestampBN = new BigNumber(currentTimestamp);
      const secondsPerHour = SECONDS_IN_AN_HOUR.toNumber();
      const mostRecentOnTheHourTimestamp = currentTimestampBN.minus(currentTimestampBN.mod(secondsPerHour));

      if (!lastUpdatedTimestamp || mostRecentOnTheHourTimestamp.gt(lastUpdatedTimestamp)) {
        await this.deleteOldLiquidityData(liquidityDB, mostRecentOnTheHourTimestamp);
        const marketsLiquidityDocs = [];
        const liquidity = new Liquidity(augur);
        const marketsLiquidityParams = await this.getMarketsLiquidityParams(db, augur);
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
                    _id: market + '_' + marketsLiquidityParams[market].spread + '_' + mostRecentOnTheHourTimestamp.toString(),
                    market,
                    spread: marketsLiquidityParams[market].spread,
                    liquidity: marketLiquidity.toString(),
                    timestamp: mostRecentOnTheHourTimestamp.toNumber(),
                  });
                }
              }
            }
          }
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

  private async deleteOldLiquidityData(liquidityDB: LiquidityDB, mostRecentOnTheHourTimestamp: BigNumber): Promise<void> {
    const oldLiquidityDocs = await liquidityDB.find({
      selector: {
        _id: { $ne: 'lastUpdated' },
        timestamp: { $lt: mostRecentOnTheHourTimestamp.minus(SECONDS_IN_A_DAY).toNumber() },
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

  async getMarketsLiquidityParams(db: DB, augur: Augur): Promise<MarketsLiquidityParams> {
    const liquidityParams = {};
    // TODO Filter markets with open order better by filtering by market reporting state
    const marketsWithOpenOrders = await OnChainTrading.getOrders(
      augur,
      db,
      {
        universe: augur.contracts.universe.address,
        orderState: OrderState.OPEN,
      }
    );

    const marketIds = Object.keys(marketsWithOpenOrders);
    const marketCreatedLogs = await db.findMarketCreatedLogs({
      selector: { market: { $in: marketIds } },
    });
    const reportingFeeDivisor = await augur.contracts.universe.getReportingFeeDivisor_();
    for (let i = 0; i < marketCreatedLogs.length; i++) {
      const marketCreatedLog = marketCreatedLogs[i];
      const liquidityOrderBook = await getLiquidityOrderBook(augur, db, marketCreatedLog.market);
      if (!_.isEmpty(liquidityOrderBook)) {
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
*/
