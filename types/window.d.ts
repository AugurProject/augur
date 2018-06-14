
interface IntegrationHelpers {
  updateAccountAddress(address: string): void;
  findMarketId(marketDescription: string): void;
  hasDisclaimerModalBeenDismissed(): boolean;
  getMarketData(marketId: string): object;
}

declare namespace window {
  export const integrationHelpers:IntegrationHelpers;
}

