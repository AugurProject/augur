
interface IntegrationHelpers {
  updateAccountAddress(address: string): void;
  findMarketId(marketDescription: string): void;
  hasDisclaimerModalBeenDismissed(): boolean;
  createMarket(market: object): object;
  getCurrentTimestamp(): number;
  getCurrentBlock(): object;
  logout(): void;
  getAccountData(): void;
  formatRep(value: string): object;
  formatEth(value: string): object;
  getRep(): void;
  getMarketCreationCostBreakdown(): object;
  getMarketDisputeOutcomes(): void;
  getReportingWindowStats(): void;
  getDaysRemaining(endTime: number, startTime: number): string;
  convertUnixToFormattedDate(date: number): string;
}

declare namespace window {
  export const integrationHelpers:IntegrationHelpers;
}

