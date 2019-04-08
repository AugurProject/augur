// TODO: Define Users class

export interface GetUserTradingPositionsParams {
  universe: string,
  creator?: string,
  category?: string,
  search?: string,
  reportingState?: string,
  disputeWindow?: string,
  designatedReporter?: string,
  maxFee?: number,
  hasOrders?: boolean,
}

export class Users {
  constructor() {
  }

  public async getUserTradingPositions(params: GetUserTradingPositionsParams): Promise<void> {
    // TODO
  }

  public async getProfitLoss(params: GetUserTradingPositionsParams): Promise<void> {
    // TODO
  }

  public async getProfitLossSummary(params: GetUserTradingPositionsParams): Promise<void> {
    // TODO
  }
}
