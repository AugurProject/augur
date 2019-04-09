import {SortLimit} from './types';
import { DB } from "../db/DB";
import * as _ from "lodash";
import { Dictionary, NumericDictionary } from "lodash";
import { numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "@augurproject/api";
import { BigNumber } from "bignumber.js";
import { TrackedUsers } from '../db/TrackedUsers';

export interface UserTradingPositionsParams {
  universe?: string,
  account?: string,
  marketId?: string,
  outcome?: number,
};

export interface GetUserTradingPositionsParams extends UserTradingPositionsParams, SortLimit {
}

export interface GetProfitLossParams {
  universe?: string,
  account?: string,
  startTime?: number,
  endTime?: number,
  periodInterval?: number,
  marketId?: string,
  outcome?: number,
};


export interface GetProfitLossSummaryParams {
  universe?: string,
  account?: string,
  marketId?: string,
  endTime?: number,
};

export interface MarketTradingPosition {
  timestamp: number;
  frozenFunds: string;
  marketId: string;
  realized: string; // realized profit in tokens (eg. ETH) user already got from this market outcome. "realized" means the user bought/sold shares in such a way that the profit is already in the user's wallet
  unrealized: string; // unrealized profit in tokens (eg. ETH) user could get from this market outcome. "unrealized" means the profit isn't in the user's wallet yet; the user could close the position to "realize" the profit, but instead is holding onto the shares. Computed using last trade price.
  total: string; // total profit in tokens (eg. ETH). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
}

export interface TradingPosition {
  timestamp: number;
  position: string;
  frozenFunds: string;
  marketId: string; // user's position is in this market
  outcome: number; // user's position is in this market outcome
  netPosition: string; // current quantity of shares in user's position for this market outcome. "net" position because if user bought 4 shares and sold 6 shares, netPosition would be -2 shares (ie. 4 - 6 = -2). User is "long" this market outcome (gets paid if this outcome occurs) if netPosition is positive. User is "short" this market outcome (gets paid if this outcome does not occur) if netPosition is negative
  averagePrice: string; // denominated in tokens/share. average price user paid for shares in the current open position
  realized: string; // realized profit in tokens (eg. ETH) user already got from this market outcome. "realized" means the user bought/sold shares in such a way that the profit is already in the user's wallet
  unrealized: string; // unrealized profit in tokens (eg. ETH) user could get from this market outcome. "unrealized" means the profit isn't in the user's wallet yet; the user could close the position to "realize" the profit, but instead is holding onto the shares. Computed using last trade price.
  total: string; // total profit in tokens (eg. ETH). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
}

export interface UserTradingPositions {
  tradingPositions: Array<TradingPosition>; // per-outcome TradingPosition, where unrealized profit is relative to an outcome's last price (as traded by anyone)
  tradingPositionsPerMarket: { // per-market rollup of trading positions
    [marketId: string]: MarketTradingPosition,
  };
  frozenFundsTotal: string; // User's total frozen funds. See docs on FrozenFunds. This total includes market validity bonds in addition to sum of frozen funds for all market outcomes in which user has a position.
}

export class Users {
  constructor() {
  }

  public async getUserTradingPositions(params: GetUserTradingPositionsParams): Promise<UserTradingPositions> {
    // TODO
    return null;
  }

  public async getProfitLoss(params: GetProfitLossParams): Promise<Array<TradingPosition>> {
    // TODO
    return null;
  }

  public async getProfitLossSummary(params: GetProfitLossSummaryParams): Promise<NumericDictionary<TradingPosition>> {
    // TODO
    return null;
  }
}
