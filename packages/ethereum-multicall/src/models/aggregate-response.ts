export interface AggregateResponse {
  blockNumber: number;
  results: Array<{
    contractContextIndex: number;
    methodResults: Array<{
      // tslint:disable-next-line: no-any
      returnData: any;
      contractMethodIndex: number;
    }>;
  }>;
}
