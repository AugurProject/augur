interface IntegrationHelpers {
  updateAccountAddress(address: string): void;
  findMarketId(marketDescription: string): void;
}

declare namespace Window {
  export const integrationHelpers:IntegrationHelpers;
}
