
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
}

declare namespace window {
  export const integrationHelpers:IntegrationHelpers;
}

