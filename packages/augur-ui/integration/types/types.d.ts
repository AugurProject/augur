export interface IFlash {
  pushSeconds(numberOfSeconds: number): Promise<Boolean>;
  pushDays(numberOfDays: number): Promise<Boolean>;
  pushWeeks(numberOfWeeks: number): Promise<Boolean>;
  setTimestamp(timestamp: number): Promise<Boolean>;
  setMarketEndTime(marketId: string): Promise<Boolean>;
  forceFinalize(marketId: string): Promise<Boolean>;
  finalizeMarket(marketId: string): Promise<Boolean>;
  tradeCompleteSets(marketId: string): Promise<Boolean>;
  designateReport(marketId: string, outcome: string): Promise<Boolean>;
  fillMarketOrders(
    marketId: string,
    outcome: string,
    orderType: string
  ): Promise<Boolean>;
  initialReport(
    marketId: string,
    outcome: string,
    invalid: boolean,
    noPush: boolean
  ): Promise<Boolean>;
  disputeContribute(
    marketId: string,
    outcome: string,
    invalid: boolean,
    noPush: boolean,
    amount?: string
  ): Promise<Boolean>;
  createMarketOrder(
    marketId: string,
    outcome: string,
    orderType: string,
    price: string,
    amount: string
  ): Promise<Boolean>;
  dispose(): void;
}

export interface IMarket extends Object {
  id: string;
  endTime: number;
  reportingState: string;
  description: string;
}

export interface MarketCosts extends Object {
  reportingFeeDivisor: string;
  designatedReportNoShowReputationBond: string;
  validityBond: string;
}

export interface Outcome extends Object {
  id: string;
  tentativeWinning: boolean;
}
