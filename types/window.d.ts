interface IntegrationHelpers {
  updateAccountAddress(address: string): void;
  findMarketId(marketDescription: string): void;
}

declare namespace window {
  export const integrationHelpers:IntegrationHelpers;
}
