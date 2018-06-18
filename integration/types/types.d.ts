
export interface IFlash {
  pushSeconds(numberOfSeconds: number): Promise<Boolean>;
  pushDays(numberOfDays: number): Promise<Boolean>;
  pushWeeks(numberOfWeeks: number): Promise<Boolean>;
  setTimestamp(timestamp: number): Promise<Boolean>;
  setMarketEndTime(marketId: string): Promise<Boolean>;
  forceFinalize(marketId: string): Promise<Boolean>;
  tradeCompleteSets(marketId: string): Promise<Boolean>;
  designateReport(marketId: string, outcome: string): Promise<Boolean>;
  fillMarketOrders(marketId: string, outcome: string, orderType: string): Promise<Boolean>;
  dispose(): void;
}

export interface IMarket extends Object {
  id: string
  endTime: number
  reportingState: string
  description: string
}
