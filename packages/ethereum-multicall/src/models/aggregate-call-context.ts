export interface AggregateCallContext {
  contractContextIndex: number;
  contractMethodIndex: number;
  target: string;
  encodedData: string;
}
