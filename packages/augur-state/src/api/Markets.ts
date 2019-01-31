import { SortLimit } from './types';

export interface GetMarketsParamsSpecific {
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
  
export interface GetMarketsParams extends GetMarketsParamsSpecific, SortLimit { };

export interface MarketsInfoParams {
    marketIds: Array<string>
}

export class Markets {
    constructor() {}

    public async getMarkets(params: GetMarketsParams): Promise<void> {
        // TODO
    }

    public async getMarketsInfo(params: MarketsInfoParams): Promise<void> {
        // TODO
    }
}
